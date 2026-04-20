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

I also used the native HTML `datetime-local` input for picking appointment times. It works for a quick demo, but preventing double-booking on the backend would be my immediate next priority if I kept building this out.


## Results

### Basic UI

<img width="2872" height="1532" alt="image" src="https://github.com/user-attachments/assets/ee2950b3-6d8f-4187-b4ff-041402058989" />

---

<img width="2904" height="1270" alt="image" src="https://github.com/user-attachments/assets/2d0b8711-0f3a-4ec0-940c-18390ee9c6f8" />

---

<img width="2886" height="1136" alt="image" src="https://github.com/user-attachments/assets/6742cd2f-c026-402b-9378-fe5ab6e0b2b2" />

---

<img width="1706" height="1436" alt="image" src="https://github.com/user-attachments/assets/d0005804-204f-4b6c-8550-01b730cf4abc" />

---

### Administration

<img width="1432" height="461" alt="image" src="https://github.com/user-attachments/assets/05459b38-ea1f-4bc9-b17c-0de019f11747" />



