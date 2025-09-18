# 📈 LeadForge

A full-stack Lead Management System built with React, Tailwind CSS, React Router, and Spring Boot backend. It provides a clean, responsive dashboard with sidebar navigation, real-time lead statistics, and detailed lead management features.

**Tagline:** _"Crafting connections, powering growth."_

---

### 🚀 Live Demo

🔗 [Deployed Live on Vercel](https://lead-forge-frontend.vercel.app/)<br/>

📡 [Backend Deploy Link](https://leadforge-backend.onrender.com/api/health)

---

## Watch Demo video :- 

[Watch the video](https://drive.google.com/file/d/1vJc9WVTrAia6fuMxj8gPLhhw_C090uZa/view?usp=sharing)

---


## 🌟 Features

- Responsive sidebar navigation with expandable/collapsible functionality.
- Dynamic dashboard displaying total leads, new leads, qualified leads, and total value.
- Color-coded lead statuses for clear visualization.
- Authentication and authorization based on JWT tokens.
- React Router v6 nested layout using Outlet for content rendering.
- CRUD operations for leads with server-side API integration.
- User-friendly interface with hamburger menu toggle for sidebar.
- Styled with Tailwind CSS and Heroicons for modern UI.

---

## 📁 Tech Stack

- **Frontend:** React.js, Tailwind CSS, React Router, Tailwind CSS, Heroicons, AG Grid, Axios, React Hot Toast, Vite
- **Backend:** Node.js, Express.js, axios, bcrypt, cors, cookie-parser, dotenv, express-validator, nodemon
- **Database:** MongoDB

---

## 🔧 Getting Started

### 1. Clone the repo (frontend and backend)

```bash
git clone https://github.com/atharva5924/LeadForge.git
```

---

### 2. Backend Setup

In backend directory:

```bash
cd server
```

- Create `.env` file with:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string_here
JWT_SECRET=your_secret_jwt_key_here_make_it_long_and_secure
NODE_ENV=your_environment_here_development_or_production
```

```bash
- Install dependencies and run:
npm install
npm run dev # or npm start if configured
```

---

### 3. Frontend Setup

In frontend directory:

- Create `.env` file with:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

```bash
- Install dependencies and run dev server:
npm install
npm run dev
```

Frontend runs at `http://localhost:3000/`

---

## Database Seeding

This project includes a seed data script to quickly populate the database with sample leads, users, and related data for testing and development purposes.

### How to Seed Data

1. Ensure your database (MongoDB/MySQL/etc.) is running and accessible.

2. Run the seed script located at:

```bash
/server/scripts/seedData.js
```
Adjust path if needed depending on repository structure)

3. To execute the seed script:

- For Node.js (MongoDB):
  ```
  node server/scripts/seedData.js
  ```

4. The seed script inserts initial test data including:
- Sample leads with various statuses and values
- User accounts with roles and secure hashed passwords
- Associated metadata needed for app functionality

5. After seeding, restart the backend server if it was running to reflect the updated data.

---

Seeding the database helps get the application up and running quickly with realistic sample data, enabling faster testing and development.

---

## Project Structure

```bash
ims-backend/
│
├── controllers/
├── middlewares/
├── models/
├── routes/
├── db/
├── scripts/
├── uploads/ (optional if storing locally)
├── .env
├── server.js
│
client/
│
├── src/
│   ├── components/
│   └── App.jsx
├── index.html
├── tailwind.config.js
├── vite.config.js
```

---

# 📊 Database Schema

This project uses **MongoDB** with **Mongoose** to manage data.  
Below are the details of the collections and their fields.

For complete clarity, see the schema code in [`scripts/seedData.js`](./server/scripts/seedData.js).

## 🧑 User Schema

The `User` collection stores information about application users.

| Field      | Type     | Required | Unique | Description |
|------------|----------|----------|--------|-------------|
| `firstName` | String  | ✅ Yes   | ❌ No  | User's first name |
| `lastName`  | String  | ✅ Yes   | ❌ No  | User's last name |
| `email`     | String  | ✅ Yes   | ✅ Yes | User's email address (lowercased & trimmed) |
| `password`  | String  | ✅ Yes   | ❌ No  | Encrypted user password |
| `createdAt` | Date    | Auto     | ❌ No  | Automatically set by Mongoose timestamps |
| `updatedAt` | Date    | Auto     | ❌ No  | Automatically updated on modifications |

## 📊 Lead Database Schema

The `Lead` collection stores all lead data for tracking and management within the CRM.

| Field            | Type      | Required | Default   | Description |
|-------------------|-----------|----------|-----------|-------------|
| `id`              | ObjectId  | ✅ Yes    | Auto      | Unique identifier for each lead |
| `first_name`      | String    | ✅ Yes    | -         | Lead's first name |
| `last_name`       | String    | ✅ Yes    | -         | Lead's last name |
| `email`           | String    | ✅ Yes    | -         | Unique email address of the lead |
| `phone`           | String    | ✅ Yes    | -         | Contact phone number |
| `company`         | String    | ❌ No     | -         | Company the lead is associated with |
| `city`            | String    | ❌ No     | -         | Lead's city |
| `state`           | String    | ❌ No     | -         | Lead's state |
| `source`          | Enum      | ✅ Yes    | -         | Source of lead acquisition. <br>**Options:** `website`, `facebook_ads`, `google_ads`, `referral`, `events`, `other` |
| `status`          | Enum      | ✅ Yes    | `new`     | Current status of the lead. <br>**Options:** `new`, `contacted`, `qualified`, `lost`, `won` |
| `score`           | Integer   | ❌ No     | `0`       | Score between **0–100** representing lead quality |
| `lead_value`      | Number    | ❌ No     | `0`       | Estimated revenue from this lead |
| `last_activity_at`| Date      | ❌ No     | `null`    | Timestamp of the last activity with this lead |
| `is_qualified`    | Boolean   | ❌ No     | `false`   | Whether the lead has been qualified |
| `created_at`      | Date      | Auto      | -         | Automatically set when the lead is created |
| `updated_at`      | Date      | Auto      | -         | Automatically updated when the lead is modified |

---

## 📦 API Endpoints

### Authentication
| Method | Endpoint                          | Description                           |
| ------ | -------------------------------- | ------------------------------------- |
| POST   | `/api/auth/register`              | Register a new user                   |
| POST   | `/api/auth/login`                 | User login                           |
| POST   | `/api/auth/logout`                | Logout user (clears auth token)     |
| GET    | `/api/auth/me`                   | Get current logged-in user profile   |

### Leads
| Method | Endpoint                    | Description                          |
| ------ | --------------------------- | ------------------------------------ |
| GET    | `/api/leads`                | Get list of leads (filterable)      |
| GET    | `/api/leads/:id`            | Get lead details by ID               |
| POST   | `/api/leads`                | Create a new lead                   |
| PUT    | `/api/leads/:id`            | Update lead by ID                   |
| DELETE | `/api/leads/:id`            | Delete lead by ID                   |

### Dashboard
| Method | Endpoint                  | Description                          |
| ------ | ------------------------- | ------------------------------------ |
| GET    | `/api/dashboard/stats`    | Get lead statistics for dashboard    |

---

## 🧩 Screenshots

*Note: The data shown in the screenshots below is pre-inserted for demonstrating features and ensuring a clear visual representation.*

### 🔐 Login

User authentication with JWT tokens.  

![Login](./screenshots/login.png)

---

### 📝 Register

Register new users with role assignment.  

![Register](./screenshots/register.png)

---

### 📊 Dashboard

Overview of leads with stats and recent activity.  

![Dashboard](./screenshots/dashboard.png)

---

### 🔒 Sidebar

Sidebar which toggles on clicking the hamburger menu and navigate to different option easily.

![Reset Password](./screenshots/sidebar.png)

---

### 🗂 Leads Management

View, add, update, or delete leads with status indicators. 

![Leads List](./screenshots/leadsList.png)

Create Leads

![Leads List](./screenshots/create.png)

Update Leads

![Leads List](./screenshots/update.png)

Delete Leads

![Leads List](./screenshots/delete.png)

---

### ⚙️ Settings/Profile

View and update user profile and preferences.  

![Profile](./screenshots/profile.png)

---

## 🧪 Testing

Use [Postman](https://www.postman.com/) or a similar API client to test the backend API routes.

- ✅ Make sure to **enable cookies** when testing **protected routes** like product CRUD operations.
- 🔐 Authenticated routes rely on `HTTP-only` cookies for session management.

---

## 👨‍💻 Developer

**Atharva Nile**
CSE Undergrad @ IIIT Nagpur
📧 nileatharva20@gmail.com
🔗 [LinkedIn](https://www.linkedin.com/in/atharva-nile-a50120294) • [GitHub](https://github.com/atharva5924)

---

## License

[MIT](LICENSE)

---

## Notes

- Ensure backend server is running and API base URL is correctly configured.
- For frontend UI, toggle sidebar via hamburger menu and navigate using sidebar links.
- Authentication tokens are securely stored and managed on the client side.
- Use API testing tools like Postman with JWT tokens to test endpoints.
- Use Postman or similar tools to test API endpoints; include JWT tokens in the header.

---

Let me know if you want:

- A Hindi/Marathi short version.
- Custom badges or GIF recording.

I'll tailor the README further based on your preferences or interviewer expectations.

Feel free to reach out if you need setup help or additional instructions!

---
