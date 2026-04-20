from rest_framework import generics
from .models import Barber, Appointment
from .serializers import AppointmentSerializer, BarberSerializer

class BarberListAPI(generics.ListAPIView):
    queryset = Barber.objects.all()
    serializer_class = BarberSerializer

class CreateAppointmentAPI(generics.CreateAPIView):
    serializer_class = AppointmentSerializer

class AppointmentListAPI(generics.ListAPIView):
    queryset = Appointment.objects.all().order_by('appointment_time') 
    serializer_class = AppointmentSerializer
