from rest_framework import status, generics
from rest_framework.views import APIView # Base DRF class-based view
from rest_framework.response import Response
from django.shortcuts import render, redirect
from django.views.generic import TemplateView, CreateView # Django's traditional class-based views for server-rendered pages
from django.urls import reverse_lazy

from .models import Barber, Appointment
from .forms import AppointmentForm
from .serializers import AppointmentSerializer, BarberSerializer

# ==========================================
# 1. Modern API views (DRF CBVs) - for the React frontend
# ==========================================

# class BarberListAPI(APIView):
#     """Handles the /api/barbers/ API."""

#     def get(self, request):
#         barbers = Barber.objects.all()
#         serializer = BarberSerializer(barbers, many=True)
#         return Response(serializer.data)

class BarberListAPI(generics.ListAPIView):
    queryset = Barber.objects.all()
    serializer_class = BarberSerializer


# class CreateAppointmentAPI(APIView):
#     """Handles the /api/book/ API."""

#     def post(self, request):
#         serializer = AppointmentSerializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CreateAppointmentAPI(generics.CreateAPIView):
    serializer_class = AppointmentSerializer


# ==========================================
# 2. Traditional HTML views (built-in Django CBVs) - legacy server rendering
# ==========================================

# Inherit from TemplateView: used for views that only render HTML
class HomeView(TemplateView):
    template_name = 'booking/home.html'
    
    # Override get_context_data to pass database data into the HTML context
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['barbers'] = Barber.objects.all()
        return context

# Inherit from CreateView: it automatically handles GET (show empty form) and POST (validate and save form)
class BookAppointmentView(CreateView):
    form_class = AppointmentForm
    template_name = 'booking/book.html'
    success_url = reverse_lazy('appointment_success') # Redirect automatically after a successful save

class SuccessView(TemplateView):
    template_name = 'booking/success.html'


# ==========================================
# New: API for fetching all appointment records
# ==========================================
class AppointmentListAPI(generics.ListAPIView):
    # .order_by('-id') puts the newest appointments first
    queryset = Appointment.objects.all().order_by('-id') 
    serializer_class = AppointmentSerializer
