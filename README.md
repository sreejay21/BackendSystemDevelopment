# Event Management Backend

This is a **Node.js backend application** for managing events and participants. The system allows users to register, log in, create events, and register for events, with **email notifications sent automatically**. Data is stored **in-memory**, so no database is required.

---

## Key Features

### User Management
- Register new users  
- Login existing users  
- Authenticate and authorize users for protected routes  

### Event Management
- Create, update, and delete events  
- Each event stores:  
  - Date  
  - Time  
  - Description  
  - List of participants  
- Only the organizer can update or delete their events  

### Event Registration
- Users can register for events  
- Prevents multiple registrations for the same event  

### Email Notifications
- Welcome email on user registration  
- Confirmation email on event registration  
- Emails sent via **Gmail SMTP using Nodemailer**  

### In-Memory Data Storage
- Users and events are stored in memory (arrays)  
- Easy to set up, no database required  

### RESTful API Endpoints
- `/api/register` → User registration  
- `/api/login` → User login  
- `/api/events` → Get all events or create an event  
- `/api/events/:id` → Update or delete a specific event  
- `/api/events/:id/register` → Register for an event  

-----------------------------------------------------------

## Tech Stack
- **Node.js**  
- **Express.js**  
- **Nodemailer** for emails  
- **dotenv** for environment configuration  
- **JWT** for authentication  

----------------------------------------------------------------------------

How to generate a Gmail App Password:
Enable 2-Step Verification in Google Account
Go to App Passwords → Select App: Mail → Device: Other → Enter NodeJS App → Generate
Copy the 16-character password as EMAIL_PASS

----------------------------------------------------------------------------------