from django.db import models

class Appointment(models.Model):
	name = models.CharField(max_length=30)
	email = models.EmailField(max_length=50)
	appointment_time = models.DateTimeField()
	barber = models.ForeignKey(
        'Barber', 
        on_delete=models.CASCADE,
        related_name='appointments'
    )
	membership = models.BooleanField(default=False)

class Barber(models.Model):
    name = models.CharField(max_length=30)
    bio = models.TextField(blank=True)
    experience = models.IntegerField(default=0)

    def __str__(self):
        return self.name
