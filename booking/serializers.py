from rest_framework import serializers
from .models import Appointment, Barber

class BarberSerializer(serializers.ModelSerializer):
    class Meta:
        model = Barber
        fields = '__all__'  # Include all fields of the Barber model in the serialized output

class AppointmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = '__all__' # ['id', 'name', 'email', 'appointment_time', 'barber', 'membership']
