from datetime import timedelta

from django.test import TestCase
from django.urls import reverse
from django.utils import timezone
from rest_framework import status
from rest_framework.test import APITestCase

from .models import Appointment, Barber
from .serializers import AppointmentSerializer


class BarberModelTests(TestCase):
	def test_str_returns_name(self):
		barber = Barber.objects.create(name="Alex", bio="Fade specialist", experience=5)

		self.assertEqual(str(barber), "Alex")


class AppointmentModelTests(TestCase):
	def test_create_appointment_with_membership_default_false(self):
		barber = Barber.objects.create(name="Mia", bio="Classic cuts", experience=3)
		appointment = Appointment.objects.create(
			name="John Doe",
			email="john@example.com",
			appointment_time=timezone.now() + timedelta(days=1),
			barber=barber,
		)

		self.assertEqual(appointment.name, "John Doe")
		self.assertEqual(appointment.email, "john@example.com")
		self.assertFalse(appointment.membership)


class AppointmentSerializerTests(TestCase):
	def setUp(self):
		self.barber = Barber.objects.create(name="Ryan", bio="Skin fades", experience=7)

	def test_serializer_accepts_valid_data(self):
		payload = {
			"name": "Alice",
			"email": "alice@example.com",
			"appointment_time": (timezone.now() + timedelta(days=2)).isoformat(),
			"barber": self.barber.id,
			"membership": True,
		}

		serializer = AppointmentSerializer(data=payload)

		self.assertTrue(serializer.is_valid(), serializer.errors)

	def test_serializer_rejects_missing_required_field(self):
		payload = {
			"name": "Alice",
			"appointment_time": (timezone.now() + timedelta(days=2)).isoformat(),
			"barber": self.barber.id,
			"membership": True,
		}

		serializer = AppointmentSerializer(data=payload)

		self.assertFalse(serializer.is_valid())
		self.assertIn("email", serializer.errors)


class BookingAPITests(APITestCase):
	def setUp(self):
		self.barber_one = Barber.objects.create(name="Ken", bio="Short styles", experience=4)
		self.barber_two = Barber.objects.create(name="Luca", bio="Beard trims", experience=6)

		base_time = timezone.now() + timedelta(days=1)
		self.early_appointment = Appointment.objects.create(
			name="Early",
			email="early@example.com",
			appointment_time=base_time,
			barber=self.barber_one,
			membership=False,
		)
		self.late_appointment = Appointment.objects.create(
			name="Late",
			email="late@example.com",
			appointment_time=base_time + timedelta(hours=1),
			barber=self.barber_two,
			membership=True,
		)

	def test_get_barbers_returns_all_records(self):
		url = reverse("get_barbers")

		response = self.client.get(url)

		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.assertEqual(len(response.data), 2)
		returned_names = {item["name"] for item in response.data}
		self.assertSetEqual(returned_names, {"Ken", "Luca"})

	def test_create_appointment_success(self):
		url = reverse("create_appointment")
		payload = {
			"name": "Nora",
			"email": "nora@example.com",
			"appointment_time": (timezone.now() + timedelta(days=3)).isoformat(),
			"barber": self.barber_one.id,
			"membership": True,
		}

		response = self.client.post(url, payload, format="json")

		self.assertEqual(response.status_code, status.HTTP_201_CREATED)
		self.assertTrue(
			Appointment.objects.filter(name="Nora", email="nora@example.com").exists()
		)

	def test_create_appointment_returns_400_for_invalid_payload(self):
		url = reverse("create_appointment")
		payload = {
			"name": "No Email",
			"appointment_time": (timezone.now() + timedelta(days=3)).isoformat(),
			"barber": self.barber_one.id,
		}

		response = self.client.post(url, payload, format="json")

		self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
		self.assertIn("email", response.data)

	def test_get_appointments_returns_records_sorted_by_time(self):
		url = reverse("get_appointments")

		response = self.client.get(url)

		self.assertEqual(response.status_code, status.HTTP_200_OK)
		returned_ids = [item["id"] for item in response.data]
		self.assertEqual(
			returned_ids,
			[self.early_appointment.id, self.late_appointment.id],
		)
