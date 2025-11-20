from rest_framework import viewsets, permissions
from rest_framework.response import Response
from rest_framework.decorators import action, api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
from .models import Product
from .serializers import ProductSerializer
from .models import Cart
from .serializers import CartSerializer
from .models import Category
from .serializers import CategorySerializer
from .models import Order
from .models import OrderItem
from .serializers import OrderSerializer
from .models import Address
from .serializers import AddressSerializer
from rest_framework.permissions import AllowAny,  IsAuthenticated
from django.http import JsonResponse
import razorpay
import hmac
import hashlib
import json
from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))









class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()  # ✅ default queryset
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = super().get_queryset()  # start with all products
        category_slug = self.request.query_params.get('category')  # get ?category=slug
        search = self.request.query_params.get('search')
        if category_slug:
            # filter products by category slug
            queryset = queryset.filter(category__slug=category_slug)

        if search:
            queryset = queryset.filter(name__icontains=search)

        return queryset

    def get_serializer_context(self):
        return {'request': self.request}

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]  # ✅ public



class CartViewSet(viewsets.ModelViewSet):
    serializer_class = CartSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Cart.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)







class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Return only logged-in user’s orders
        return Order.objects.filter(user=self.request.user)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def checkout(request):
    """
    Checkout API: Creates order for COD or Razorpay payment
    """
    user = request.user
    payment_method = request.data.get("payment_method", "COD").upper()
    address = request.data.get("address")

    # Fetch user's cart items
    cart_items = Cart.objects.filter(user=user)

    if not cart_items.exists():
        return Response({"detail": "Cart is empty"}, status=status.HTTP_400_BAD_REQUEST)

    if not address:
     return Response({"detail": "Address is required", "expected_fields": ["address", "payment_method"]},
                    status=status.HTTP_400_BAD_REQUEST)

    # Calculate total amount
    total = sum(item.product.price * item.quantity for item in cart_items)

    # Create order
    order = Order.objects.create(
        user=user,
        address=address,
        payment_method=payment_method,
        total_price=total,
        status="pending"
    )

    # Add each cart item to order
    for item in cart_items:
        OrderItem.objects.create(
            order=order,
            product=item.product,
            quantity=item.quantity,
            price=item.product.price
        )

    # Clear the user's cart
    cart_items.delete()

    # --- Handle payment method ---
    if payment_method == "COD":
        order.status = "completed"
        order.save()
        send_order_confirmed_email(order)
        serializer = OrderSerializer(order)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    elif payment_method == "RAZORPAY":
        try:
            razorpay_order = client.order.create({
                "amount": int(total * 100),  # Razorpay expects amount in paise
                "currency": "INR",
                "payment_capture": "1",
            })

            # Store Razorpay order ID
            order.razorpay_order_id = razorpay_order["id"]
            order.save()

            return Response({
                "order_id": razorpay_order["id"],
                "amount": razorpay_order["amount"],
                "currency": razorpay_order["currency"],
                "key_id": settings.RAZORPAY_KEY_ID,
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    else:
        return Response({"detail": "Invalid payment method"}, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def verify_payment(request):
    """
    Verifies Razorpay payment signature and marks order as completed
    """
    data = request.data
    order_id = data.get("razorpay_order_id")
    payment_id = data.get("razorpay_payment_id")
    signature = data.get("razorpay_signature")

    if not order_id or not payment_id or not signature:
        return Response({"detail": "Missing payment data"}, status=status.HTTP_400_BAD_REQUEST)

    # Verify Razorpay signature
    try:
        client.utility.verify_payment_signature({
            "razorpay_order_id": order_id,
            "razorpay_payment_id": payment_id,
            "razorpay_signature": signature,
        })
    except razorpay.errors.SignatureVerificationError:
        return Response({"detail": "Payment verification failed"}, status=status.HTTP_400_BAD_REQUEST)

    # Update order status
    try:
        order = Order.objects.get(razorpay_order_id=order_id, user=request.user)
        order.status = "completed"
        order.save()

         # Send confirmation email
        send_order_confirmed_email(order)
        
        serializer = OrderSerializer(order)
        return Response(serializer.data, status=status.HTTP_200_OK)

    except Order.DoesNotExist:
        return Response({"detail": "Order not found"}, status=status.HTTP_404_NOT_FOUND)
    



def send_order_confirmed_email(order):
    subject = f"Order Confirmed — #{order.id}"
    from_email = settings.DEFAULT_FROM_EMAIL
    to = [order.user.email]   # customer's email from user model

    context = {
        "order": order,
        "items": order.items.all(),   # FIXED
    }

    text_body = render_to_string("emails/orderconfirmed.txt", context)
    html_body = render_to_string("emails/orderconfirmed.html", context)

    msg = EmailMultiAlternatives(subject, text_body, from_email, to)
    msg.attach_alternative(html_body, "text/html")
    msg.send()



class AddressViewSet(viewsets.ModelViewSet):
    serializer_class = AddressSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Address.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        # automatically set the user
        serializer.save(user=self.request.user)