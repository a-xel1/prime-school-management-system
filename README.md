# Prime School Management System

A modern, full-stack School Management System built with React, Django REST Framework, PostgreSQL, and Docker.

Prime is designed to simplify school administration by providing a secure and scalable platform for managing students, teachers, classes, attendance, assessments, fees, and more.

> **Project Status:** 🚧 In Active Development

---

## Features

### Authentication
- User Registration
- Secure Login with JWT Authentication
- Logout
- Protected Routes
- Guest Routes
- Remember Me
- Password Reset
- User Profile

### Dashboard
- Responsive Dashboard Layout
- Sidebar Navigation
- Welcome Card
- Statistics Cards
- Mobile-Friendly Interface

### Planned Modules
- Student Management
- Teacher Management
- Parent Portal
- Class & Subject Management
- Attendance Tracking
- Assessments & Grading
- Fee Management
- Academic Reports
- Timetable Management
- Announcements
- Role-Based Access Control (RBAC)
- School Settings

---

## Tech Stack

### Frontend
- React
- TypeScript
- Vite
- Axios
- CSS

### Backend
- Django
- Django REST Framework
- JWT Authentication
- PostgreSQL

### DevOps
- Docker
- Docker Compose

---

## Project Structure

```
Prime/
│
├── backend/
│   ├── accounts/
│   ├── config/
│   ├── manage.py
│   └── requirements.txt
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── services/
│   │   └── utils/
│   └── package.json
│
├── docker-compose.yml
└── README.md
```

---

## Getting Started

### Clone the Repository

```bash
git clone https://github.com/a-xel1/prime-school-management-system.git
cd prime-school-management-system
```

---

### Backend Setup

```bash
cd backend

python -m venv venv

source venv/bin/activate      # macOS/Linux

pip install -r requirements.txt
```

Run the server

```bash
python manage.py migrate
python manage.py runserver
```

---

### Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

---

## Running with Docker

```bash
docker compose up --build
```

---

## Authentication

Prime currently includes:

- JWT Authentication
- Login
- Registration
- Logout
- Password Reset
- Protected Routes
- Auto Login
- Token Refresh

---

## Screenshots

Screenshots will be added as development progresses.

---

## Roadmap

- [x] Authentication System
- [x] Responsive Dashboard
- [ ] Role-Based Access Control
- [ ] Student Management
- [ ] Teacher Management
- [ ] Parent Portal
- [ ] Attendance Module
- [ ] Assessment Module
- [ ] Fee Management
- [ ] Reports & Analytics
- [ ] Notifications
- [ ] Deployment

---

## Contributing

Contributions, suggestions, and feedback are welcome.

Feel free to fork the repository and submit a pull request.

---

## License

This project is licensed under the MIT License.

---

## Author

**Kingsley Opoku**

GitHub: https://github.com/a-xel1

---

⭐ If you like this project, consider giving it a star.