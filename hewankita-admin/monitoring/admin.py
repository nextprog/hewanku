from django.contrib import admin
from django.db.models import Count, Sum
from .models import Profile, Animal, Order, OrderItem

@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ('id', 'full_name', 'phone', 'role', 'is_admin', 'created_at')
    list_filter = ('role', 'is_admin')
    search_fields = ('full_name', 'phone')
    readonly_fields = ('id', 'created_at')

@admin.register(Animal)
class AnimalAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'animal_type', 'age_months', 'price', 'status', 'is_qurban_eligible', 'seller_id')
    list_filter = ('animal_type', 'status', 'is_qurban_eligible')
    search_fields = ('name', 'seller_id')
    readonly_fields = ('id', 'created_at')

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ('animal_id', 'price_at_time')

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'buyer_id', 'order_date', 'total_amount', 'status', 'payment_method')
    list_filter = ('status', 'payment_method', 'order_date')
    search_fields = ('buyer_id', 'shipping_address')
    readonly_fields = ('id', 'order_date')
   # inlines = [OrderItemInline]
    
    actions = ['mark_as_paid']

    def mark_as_paid(self, request, queryset):
        updated = queryset.update(status='paid')
        # Tambahkan logika update animal status jika perlu via raw SQL
        self.message_user(request, f'{updated} pesanan ditandai sebagai paid.')
    mark_as_paid.short_description = "Tandai pesanan terpilih sebagai Lunas"

@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ('id', 'order_id', 'animal_id', 'price_at_time')
    search_fields = ('order_id', 'animal_id')