# uniMate - Campus Companion

A React Native mobile application built with Expo for managing campus life, including assignments, events, schedules, and notifications.

## Features

- 🔐 User Authentication (Firebase Auth)
- 📚 Assignments Management
- 📅 Events & Schedule
- 🔔 Notifications
- 👤 User Profile
- 📱 Cross-platform (iOS, Android, Web)

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- Firebase project setup

## Installation

1. Clone the repository
```bash
git clone <repository-url>
cd client
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
   - Copy `.env.example` to `.env`
   - Add your Firebase credentials to `.env`:
     ```
     FIREBASE_API_KEY=your_api_key
     FIREBASE_AUTH_DOMAIN=your_auth_domain
     FIREBASE_PROJECT_ID=your_project_id
     FIREBASE_STORAGE_BUCKET=your_storage_bucket
     FIREBASE_MESSAGING_SENDER_ID=your_sender_id
     FIREBASE_APP_ID=your_app_id
     FIREBASE_MEASUREMENT_ID=your_measurement_id
     ```

## Running the App

```bash
# Start Expo development server
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios

# Run on Web
npm run web
```

## Project Structure

```
src/
├── components/     # Reusable UI components
├── config/        # Firebase and API configuration
├── constants/     # App constants (colors, routes, etc.)
├── context/       # React Context providers
├── screens/       # Screen components
├── services/      # Business logic and API services
└── scripts/       # Utility scripts (Firebase seeding, etc.)
```

## Tech Stack

- **Framework**: React Native (Expo)
- **Navigation**: React Navigation
- **Backend**: Firebase (Auth, Firestore, Storage)
- **State Management**: React Context
- **Notifications**: Expo Notifications

## License

Private
