from rest_framework import status, generics
from rest_framework.views import APIView # DRF 的基礎 CBV
from rest_framework.response import Response
from django.shortcuts import render, redirect
from django.views.generic import TemplateView, CreateView # Django 傳統網頁的 CBV
from django.urls import reverse_lazy

from .models import Barber, Appointment
from .forms import AppointmentForm
from .serializers import AppointmentSerializer, BarberSerializer

# ==========================================
# 1. 現代化 API 視圖 (DRF CBV) - 給 React 前端用的
# ==========================================

# class BarberListAPI(APIView):
#     """處理 /api/barbers/ 的 API"""

#     def get(self, request):
#         barbers = Barber.objects.all()
#         serializer = BarberSerializer(barbers, many=True)
#         return Response(serializer.data)

class BarberListAPI(generics.ListAPIView):
    queryset = Barber.objects.all()
    serializer_class = BarberSerializer


# class CreateAppointmentAPI(APIView):
#     """處理 /api/book/ 的 API"""

#     def post(self, request):
#         serializer = AppointmentSerializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CreateAppointmentAPI(generics.CreateAPIView):
    serializer_class = AppointmentSerializer


# ==========================================
# 2. 傳統 HTML 視圖 (Django 內建 CBV) - 舊版後端渲染
# ==========================================

# 繼承 TemplateView：專門用來單純顯示 HTML 的視圖
class HomeView(TemplateView):
    template_name = 'booking/home.html'
    
    # 透過覆寫 get_context_data 把資料庫的資料塞進 HTML 裡
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['barbers'] = Barber.objects.all()
        return context

# 繼承 CreateView：它會自動幫你處理 GET (顯示空白表單) 和 POST (驗證並儲存表單)
class BookAppointmentView(CreateView):
    form_class = AppointmentForm
    template_name = 'booking/book.html'
    success_url = reverse_lazy('appointment_success') # 儲存成功後自動跳轉

class SuccessView(TemplateView):
    template_name = 'booking/success.html'


# ==========================================
# 新增：撈取所有預約紀錄的 API
# ==========================================
class AppointmentListAPI(generics.ListAPIView):
    # .order_by('-id') 讓最新的預約排在最上面
    queryset = Appointment.objects.all().order_by('-id') 
    serializer_class = AppointmentSerializer
