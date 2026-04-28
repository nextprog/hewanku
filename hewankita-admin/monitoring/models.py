from django.db import models

class Profile(models.Model):
    id = models.UUIDField(primary_key=True)
    full_name = models.CharField(max_length=255, blank=True)
    phone = models.CharField(max_length=20, blank=True)
    role = models.CharField(max_length=50, choices=[('buyer','Buyer'),('seller','Seller'),('admin','Admin')])
    is_admin = models.BooleanField(default=False)
    created_at = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'profiles'

class Animal(models.Model):
    id = models.UUIDField(primary_key=True)
    seller_id = models.UUIDField()
    name = models.CharField(max_length=255, blank=True)
    animal_type = models.CharField(max_length=50)
    age_months = models.IntegerField()
    price = models.DecimalField(max_digits=12, decimal_places=2)
    description = models.TextField(blank=True)
    location = models.CharField(max_length=255, blank=True)
    images = models.JSONField(default=list)
    is_qurban_eligible = models.BooleanField(default=False)
    health_status = models.CharField(max_length=50, default='Sehat')
    status = models.CharField(max_length=20, default='available')
    created_at = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'animals'

class Order(models.Model):
    id = models.UUIDField(primary_key=True)
    buyer_id = models.UUIDField()
    order_date = models.DateTimeField()
    total_amount = models.DecimalField(max_digits=12, decimal_places=2)
    status = models.CharField(max_length=50)  # pending, waiting_payment, paid, dll
    payment_method = models.CharField(max_length=50)
    shipping_address = models.TextField()
    payment_proof_url = models.TextField(blank=True)
    admin_notes = models.TextField(blank=True)

    class Meta:
        managed = False
        db_table = 'orders'

class OrderItem(models.Model):
    id = models.UUIDField(primary_key=True)
    order_id = models.UUIDField()
    animal_id = models.UUIDField()
    price_at_time = models.DecimalField(max_digits=12, decimal_places=2)

    class Meta:
        managed = False
        db_table = 'order_items'

class Cart(models.Model):
    id = models.UUIDField(primary_key=True)
    user_id = models.UUIDField()
    animal_id = models.UUIDField()
    created_at = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'carts'