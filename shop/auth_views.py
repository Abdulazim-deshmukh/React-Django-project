from rest_framework.decorators import api_view,permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from django.views.decorators.csrf import csrf_exempt


@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])  
def register(request):
    name = request.data.get('name')
    email = request.data.get('email')
    password = request.data.get('password')

    if not name or not email or not password:
        return Response({'message': 'All fields are required'}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(username=email).exists():
        return Response({'message': 'User already exists'}, status=status.HTTP_400_BAD_REQUEST)

    user = User.objects.create_user(username=email, email=email, password=password, first_name=name)
    token, _ = Token.objects.get_or_create(user=user)
    return Response({'message': 'User registered successfully', 'token': token.key}, status=status.HTTP_201_CREATED)


@csrf_exempt
@api_view(['POST'])
def login(request):
    email = request.data.get('email')
    password = request.data.get('password')

    if not email or not password:
        return Response({'message': 'Email and password required'}, status=status.HTTP_400_BAD_REQUEST)

    # handle duplicate emails safely
    user_obj = User.objects.filter(email=email).first()
    if not user_obj:
        return Response({'message': 'Invalid email'}, status=status.HTTP_400_BAD_REQUEST)

    # authenticate with username
    user = authenticate(username=user_obj.username, password=password)
    if not user:
        return Response({'message': 'Invalid password'}, status=status.HTTP_400_BAD_REQUEST)

    token, _ = Token.objects.get_or_create(user=user)
    return Response({'message': 'Login successful', 'token': token.key}, status=status.HTTP_200_OK)

@csrf_exempt
@api_view(['POST'])
def logout(request):
    token_key = request.headers.get('Authorization', '').replace('Token ', '')
    try:
        token = Token.objects.get(key=token_key)
        token.delete()
        return Response({'message': 'Logged out successfully'})
    except Token.DoesNotExist:
        return Response({'message': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)