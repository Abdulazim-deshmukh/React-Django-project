"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from shop.views import ProductViewSet, CartViewSet, CategoryViewSet, OrderViewSet, checkout, verify_payment, AddressViewSet
from django.conf import settings
from django.conf.urls.static import static
from shop import auth_views  


router = routers.DefaultRouter()
router.register(r'products', ProductViewSet)
router.register(r'cart', CartViewSet, basename='cart')
router.register(r"categories", CategoryViewSet)
router.register(r'orders', OrderViewSet, basename='orders')
router.register(r'addresses', AddressViewSet, basename='address')




urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),

    #auth routes
    path('api/auth/register/', auth_views.register, name='register'),
    path('api/auth/login/', auth_views.login, name='login'),
    path('api/auth/logout/', auth_views.logout, name='logout'), 

    # Razorpay endpoints
    path('api/checkout/', checkout, name='checkout'),
    path("api/razorpay/verify-payment/", verify_payment, name="verify_payment"),
 
]
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
