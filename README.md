# GigFlow - Freelance Marketplace Platform

A full-stack mini-freelance marketplace where clients can post jobs (Gigs) and freelancers can submit bids. Built with React, Node.js, Express, MongoDB, and Redux Toolkit.

##  Features

- **User Authentication**: Secure JWT-based authentication with HttpOnly cookies
- **Fluid Roles**: Users can act as both clients and freelancers
- **Gig Management**: Browse, search, and post job opportunities
- **Bidding System**: Freelancers can submit proposals with custom pricing
- **Hiring Logic**: Atomic hiring process that automatically handles bid status updates
- **Responsive UI**: Modern design with Tailwind CSS

##  Tech Stack

### Frontend
- React.js with Vite
- Redux Toolkit for state management
- React Router for navigation
- Axios for API calls
- Tailwind CSS for styling

### Backend
- Node.js & Express.js
- MongoDB with Mongoose
- JWT authentication
- bcrypt for password hashing
- CORS and cookie-parser middleware

##  Prerequisites

Before running this project, make sure you have:

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

##  Installation & Setup

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd "Service hive"
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:

```env
MONGO_URI=mongodb://localhost:27017/gigflow
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
PORT=5000
NODE_ENV=development
```

**Important**: Update the `MONGO_URI` with your MongoDB connection string.

Start the backend server:

```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Start the frontend development server:

```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

##  API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user (sets HttpOnly cookie)
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user (protected)

### Gigs
- `GET /api/gigs` - Fetch all open gigs (with optional search query)
- `GET /api/gigs/:id` - Get single gig details
- `POST /api/gigs` - Create a new gig (protected)
- `GET /api/gigs/user/my-gigs` - Get user's posted gigs (protected)

### Bids
- `POST /api/bids` - Submit a bid (protected)
- `GET /api/bids/:gigId` - Get all bids for a gig (owner only, protected)
- `PATCH /api/bids/:bidId/hire` - Hire a freelancer (protected)
- `GET /api/bids/user/my-bids` - Get user's submitted bids (protected)

## 💡 How It Works

### Posting a Gig
1. User logs in/registers
2. Navigate to "Post a Gig"
3. Fill in title, description, and budget
4. Gig appears in the public feed with "open" status

### Submitting a Bid
1. Freelancer browses available gigs
2. Clicks on a gig to view details
3. Submits a bid with custom price and proposal message
4. Bid status is set to "pending"

### Hiring Process (The Critical Logic)
1. Client views all bids on their gig
2. Clicks "Hire" on the chosen bid
3. **Atomic Operation**:
   - Selected bid status → `hired`
   - Gig status → `assigned`
   - All other pending bids → `rejected`

##  Project Structure

```
Service hive/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Gig.js
│   │   └── Bid.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── gigs.js
│   │   └── bids.js
│   ├── .env
│   ├── .gitignore
│   ├── index.js
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   └── PrivateRoute.jsx
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── CreateGig.jsx
    │   │   ├── GigDetails.jsx
    │   │   ├── MyGigs.jsx
    │   │   ├── GigBids.jsx
    │   │   └── MyBids.jsx
    │   ├── store/
    │   │   ├── slices/
    │   │   │   ├── authSlice.js
    │   │   │   ├── gigSlice.js
    │   │   │   └── bidSlice.js
    │   │   └── store.js
    │   ├── utils/
    │   │   └── axios.js
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    └── package.json
```

