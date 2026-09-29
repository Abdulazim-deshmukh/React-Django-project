from rest_framework import serializers
from .models import Product
from .models import Cart
from .models import Category
from .models import Order
from .models import OrderItem
from .models import Address

# to connect this to react later using REST API

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id', 'name', 'description', 'price', 'image', 'category']



class CategorySerializer(serializers.ModelSerializer):
    products = ProductSerializer(many=True, read_only=True)  # uses related_name="products"

    class Meta:
        model = Category
        fields = ["id", "name", "slug", "image", "products"]



class CartSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    product_price = serializers.DecimalField(source='product.price', max_digits=10, decimal_places=2, read_only=True)
    product_image = serializers.ImageField(source='product.image', read_only=True)

    class Meta:
        model = Cart
        fields = ['id', 'product', 'quantity', 'product_name', 'product_price', 'product_image']


class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.ReadOnlyField(source='product.name')
    product_image = serializers.SerializerMethodField()
    subtotal = serializers.SerializerMethodField()

    class Meta:
        model = OrderItem
        fields = ['id', 'product_name', 'product_image', 'quantity', 'price', 'subtotal']

    def get_product_image(self, obj):
        request = self.context.get('request')
        if obj.product.image and request:
            return request.build_absolute_uri(obj.product.image.url)
        elif obj.product.image:
            return obj.product.image.url
        return None

    def get_subtotal(self, obj):
        return float(obj.price) * obj.quantity


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    total_items = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = [
            'id',
            'total_price',
            'status',
            'created_at',
            'updated_at',
            'address',
            'total_items',
            'items',
        ]
        read_only_fields = ['total_price', 'status', 'created_at', 'updated_at']

    def get_total_items(self, obj):
        return obj.items.count()
    
    def create(self, validated_data):
        # Assign the logged-in user automatically
        user = self.context['request'].user
        return Order.objects.create(user=user, **validated_data)



class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = "__all__"
        read_only_fields = ["user"]