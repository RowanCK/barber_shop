from django.contrib import admin
from .models import Barber, Appointment

# This makes them show up in the Django admin panel
admin.site.register(Barber)
admin.site.register(Appointment)