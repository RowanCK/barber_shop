from django import forms
from .models import Appointment

class AppointmentForm(forms.ModelForm):
    class Meta:
        model = Appointment
        fields = ['name', 'email', 'appointment_time', 'barber', 'membership']
        widgets = {
            # This renders an HTML5 date/time picker in the browser
            'appointment_time': forms.DateTimeInput(attrs={'type': 'datetime-local', 'class': 'form-control'}),
        }