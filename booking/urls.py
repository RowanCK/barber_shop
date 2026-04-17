"""
URL configuration for barber_shop project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
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
from django.urls import path
from . import views

urlpatterns = [
    # --- 傳統 HTML 路由 ---
    # 注意後面都加上了 .as_view()
    path('', views.HomeView.as_view(), name='home'),
    path('book/', views.BookAppointmentView.as_view(), name='book_appointment'),
    path('success/', views.SuccessView.as_view(), name='appointment_success'),
    
    # --- 現代 API 路由 ---
    path('api/barbers/', views.BarberListAPI.as_view(), name='get_barbers'),
    path('api/book/', views.CreateAppointmentAPI.as_view(), name='create_appointment'),
    path('api/appointments/', views.AppointmentListAPI.as_view(), name='get_appointments'),
]