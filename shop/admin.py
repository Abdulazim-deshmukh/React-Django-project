from django.contrib import admin

# Register your models here.
from .models import Product
from .models import Cart
from .models import Category
from .models import Order
from .models import OrderItem 
from .models import Address


admin.site.register(Product)
admin.site.register(Cart)
admin.site.register(Category)
admin.site.register(Order)
admin.site.register(OrderItem)
admin.site.register(Address)