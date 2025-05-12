# Theatre Booking Application

A React web application that allows users to book function theatres for events like birthdays, meetings, and photoshoots. The app supports multiple branches, each with its own features, location, and available time slots.

## 🌟 Key Features

### 🏢 Multi-Branch Selection
- Display a list of available branches with:
  - Name, address, features, and images
  - "View on Map" button that redirects to Google Maps

### 📅 Real-Time Slot Booking
- Show date and time slot selection per branch
- Disable time slots if already booked
- Real-time availability using Firebase Firestore

### ➕ Add-ons & Customization
- Optional add-ons like:
  - Decor
  - Photography
  - Catering
  - Stage/Lighting
- Dynamic price updates based on selected add-ons

### 💳 Razorpay Payment Gateway
- Use Razorpay Checkout for payment
- Show booking summary before payment
- On success:
  - Store booking in Firebase
  - Disable booked slot
  - Send confirmation and receipt

### 🔐 Firebase Authentication
- Sign up / Login for users
- Admin login to manage branches, slots, and view bookings

### 📊 User & Admin Dashboards
- User:
  - View upcoming/past bookings
  - Cancel (if within allowed time)
- Admin:
  - Manage branches and slots
  - View payments and bookings
  - Add or remove available time slots

### 📱 Mobile-Responsive Design
- Built using TailwindCSS
- Smooth user experience on all devices

## 🛠 Tech Stack
- Frontend: React.js, TailwindCSS
- Database: Firebase Firestore
- Auth: Firebase Authentication
- Payment: Razorpay
- Storage: Firebase Storage (for images)

## 📋 Prerequisites
- Node.js (v14.0.0 or higher)
- npm (v6.0.0 or higher)
- Firebase account
- Razorpay account

## 🚀 Getting Started

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/theatre-booking.git
cd theatre-booking
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following environment variables:
```
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_RAZORPAY_KEY_ID=your_razorpay_key_id
```

### Running the Application
```bash
npm start
```

This will start the application in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Building for Production
```bash
npm run build
```

This will create a production-ready build in the `build` folder.

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgements
- [React](https://reactjs.org/)
- [Firebase](https://firebase.google.com/)
- [TailwindCSS](https://tailwindcss.com/)
- [Razorpay](https://razorpay.com/)
- [Date-fns](https://date-fns.org/)

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Initialize Database

You have two options to initialize your Firebase database:

#### Option 1: Run the setup script (Recommended for first-time setup)

This script will create an admin user and initialize all necessary collections with sample data:

```bash
# Install ESM for module support
npm install esm

# Run the database setup script
node -r esm src/firebase/setupDatabase.js
```

**Important**: The script creates an admin user with the following credentials:
- Email: admin@theatre.com
- Password: admin123

Make sure to change these in the script before running it if you want different credentials.

#### Option 2: Start the application

The application automatically initializes all required collections on startup:

```bash
npm start
```

After starting the app, you'll need to:
1. Sign up for a new account through the application interface
2. Manually update that user to be an admin by using Option 1 or directly in Firebase Console

### 3. Accessing the Admin Dashboard

1. Log in with the admin credentials
2. Click on the "Admin" link in the navigation bar

### 4. Database Details

The application uses the following Firestore collections:

- `users` - User accounts and roles
- `menuItems` - Food and beverage menu items
- `menuCategories` - Categories for menu items
- `addOns` - Additional services like decorations
- `bookings` - Customer bookings
- `branches` - Theatre locations
- `galleryImages` - Gallery images

## File Structure and Functions

### Core Files
- `src/App.js` - Main application component that sets up routing and application structure
- `src/index.js` - Entry point for the React application
- `src/mockData.js` - Contains mock data used for development and testing

### Pages
- `src/pages/Home.js` - Landing page with featured branches and promotional content
- `src/pages/Branches.js` - Lists all available theatre branches with filtering options
- `src/pages/BranchDetail.js` - Detailed view of a specific branch with booking functionality
- `src/pages/Menu.js` - Displays food and beverage menu with categories and items
- `src/pages/Gallery.js` - Photo gallery showcasing venues and past events
- `src/pages/Events.js` - Information about special events and functions
- `src/pages/BookingConfirmation.js` - Confirmation page after successful booking
- `src/pages/Login.js` - User authentication page for login
- `src/pages/Signup.js` - New user registration page
- `src/pages/UserDashboard.js` - Dashboard for regular users to manage their bookings
- `src/pages/AdminDashboard.js` - Comprehensive dashboard for administrators with multiple management tabs

### Components
- `src/components/Navbar.js` - Navigation bar with responsive design and user authentication state
- `src/components/Footer.js` - Site footer with links and information
- `src/components/BranchCard.js` - Card component for displaying branch information in listings
- `src/components/TimeSlotSelector.js` - Interactive component for selecting available booking time slots
- `src/components/AddOnsSelector.js` - Component for selecting and configuring booking add-ons
- `src/components/BookingSummary.js` - Displays booking details and pricing before confirmation

### Admin Components
- `src/components/admin/AnalyticsDashboard.js` - Data visualization and booking statistics
- `src/components/admin/BookingsManagement.js` - Manage, view, and update booking statuses
- `src/components/admin/BranchManagement.js` - Add, edit, and manage theatre branches
- `src/components/admin/MenuManagement.js` - Manage food and beverage menu items and categories
- `src/components/admin/AddOnManagement.js` - Configure and price additional services
- `src/components/admin/GalleryManagement.js` - Upload and manage gallery images

### Context Providers
- `src/contexts/AuthContext.js` - Authentication context for user management
- `src/contexts/RazorpayContext.js` - Payment processing context for Razorpay integration

### Firebase Integration
- `src/firebase/client.js` - Firebase client configuration and initialization
- `src/firebase/admin.js` - Firebase admin SDK setup
- `src/firebase/auth.js` - Authentication utility functions
- `src/firebase/phoneauth.js` - Phone number authentication utilities
- `src/firebase/initCollections.js` - Database collection initialization with default data
- `src/firebase/setupDatabase.js` - Script for setting up the Firebase database

## Troubleshooting

If you experience issues with admin access:

1. Verify the user document in Firestore:
   - Go to Firebase Console > Firestore Database > users collection
   - Check that your user document has `role: "admin"`

2. Clear browser cache and cookies, then log in again

3. Run the setup script again to ensure proper initialization

## Technologies Used

- React
- Firebase Authentication
- Firestore Database
- Firebase Storage
- Tailwind CSS
