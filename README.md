# Barber-OS Booking Prototype

I built this project while preparing for the Junior Full Stack Developer interview with Barber-OS in Calgary. The job description highlighted Django, Django REST Framework, and React, so I wanted to build a working prototype that actually touches on the company's domain: barbershop management. 

It is a standard decoupled architecture. Django handles the API and database, and React handles the UI. 

## What it does

I didn't want to overcomplicate the MVP, so I kept the scope focused on the core booking flow.

* Users can browse a list of barbers pulled from the backend.
* Clicking a barber opens a form to select a date and time.
* A "My Bookings" tab acts as a basic admin dashboard. It fetches and displays the raw appointment data from the SQLite database.

I used Tailwind CSS for the frontend. I went with a modern, slightly darker aesthetic that usually fits the industry well. The tab switching is handled by simple React state rather than full routing to keep the demo lightweight.

## Tech Stack

* **Backend:** Python, Django, Django REST Framework
* **Frontend:** React (via Vite), Tailwind CSS v4
* **Database:** SQLite (default Django setup for the prototype)

## Running it locally

You will need two terminal windows to run the frontend and backend separately.

### Backend (Django)
1. Navigate to the `barber_shop` directory.
2. Activate your virtual environment.
3. Install the dependencies (you'll need `django`, `djangorestframework`, and `django-cors-headers`).
4. Apply migrations: `python manage.py migrate`
5. Create a superuser to add barbers in the admin panel: `python manage.py createsuperuser`
6. Start the server: `python manage.py runserver`

The backend API will run on `http://127.0.0.1:8000`.

### Frontend (React)
1. Navigate to the `frontend` directory.
2. Install dependencies: `npm install`
3. Start the Vite dev server: `npm run dev`

The app will run on `http://localhost:5173`.

## Thoughts and next steps

This is an interview prototype, so there are obvious gaps. The biggest missing piece is authentication. Right now, anyone who clicks the "My Bookings" tab can see all appointments. In a real system, that endpoint needs to be locked down (probably with session auth or JWTs) so only shop staff can access it.

I also used the native HTML `datetime-local` input for picking appointment times. It works for a quick demo, but handling timezone edge cases and preventing double-booking on the backend would be my immediate next priority if I kept building this out.
