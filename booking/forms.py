from django import forms
from .models import Appointment

class AppointmentForm(forms.ModelForm):
    class Meta:
        model = Appointment
        fields = ['name', 'email', 'appointment_time', 'barber', 'membership']
        widgets = {
            'appointment_time': forms.DateTimeInput(attrs={'type': 'datetime-local', 'class': 'form-control'}),
        }