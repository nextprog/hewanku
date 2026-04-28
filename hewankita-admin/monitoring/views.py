from django.shortcuts import render
from django.db import connection
from django.utils import timezone
from datetime import timedelta
from django.db.models import Count, Sum, Q
from .models import Animal, Order, Profile

def dashboard(request):
    # Total data
    total_users = Profile.objects.count()
    total_sellers = Profile.objects.filter(role='seller').count()
    total_animals = Animal.objects.count()
    available_animals = Animal.objects.filter(status='available').count()
    
    # Order stats
    total_orders = Order.objects.count()
    pending_payment = Order.objects.filter(status='pending').count()
    waiting_verification = Order.objects.filter(status='waiting_payment').count()
    paid_orders = Order.objects.filter(status='paid').count()
    
    # Revenue (total amount dari pesanan yang sudah paid)
    revenue = Order.objects.filter(status='paid').aggregate(total=Sum('total_amount'))['total'] or 0
    
    # Order per bulan (6 bulan terakhir)
    today = timezone.now()
    six_months_ago = today - timedelta(days=180)
    monthly_orders = Order.objects.filter(order_date__gte=six_months_ago) \
        .extra({'month': "date_trunc('month', order_date)"}) \
        .values('month') \
        .annotate(count=Count('id'), total=Sum('total_amount')) \
        .order_by('month')
    
    # Hewan paling laris (berdasarkan order_items)
    with connection.cursor() as cursor:
        cursor.execute("""
            SELECT a.animal_type, COUNT(oi.id) as sold_count
            FROM order_items oi
            JOIN animals a ON oi.animal_id = a.id
            GROUP BY a.animal_type
            ORDER BY sold_count DESC
            LIMIT 5
        """)
        top_animals = cursor.fetchall()
    
    # Penjual teraktif (berdasarkan jumlah hewan terjual)
    with connection.cursor() as cursor:
        cursor.execute("""
            SELECT p.full_name, COUNT(oi.id) as sold
            FROM order_items oi
            JOIN animals a ON oi.animal_id = a.id
            JOIN profiles p ON a.seller_id = p.id
            GROUP BY p.full_name
            ORDER BY sold DESC
            LIMIT 5
        """)
        top_sellers = cursor.fetchall()
    
    context = {
        'total_users': total_users,
        'total_sellers': total_sellers,
        'total_animals': total_animals,
        'available_animals': available_animals,
        'total_orders': total_orders,
        'pending_payment': pending_payment,
        'waiting_verification': waiting_verification,
        'paid_orders': paid_orders,
        'revenue': revenue,
        'monthly_orders': monthly_orders,
        'top_animals': top_animals,
        'top_sellers': top_sellers,
    }
    return render(request, 'monitoring/dashboard.html', context)