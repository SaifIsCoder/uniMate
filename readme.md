# 🎓 Campus Companion

<p align="center">
  <img src="https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React Native"/>
  <img src="https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white" alt="Expo"/>
  <img src="https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" alt="Firebase"/>
</p>

**Campus Companion** is a comprehensive mobile application designed to help students manage their academic and campus life efficiently. Built with React Native and Expo, it provides a centralized platform for class schedules, assignments, events, notifications, and more.

---

## ✨ Features

### 🔐 Authentication
- **Secure Login** - Email/password authentication via Firebase
- **User Registration** - Sign up with student details (name, department, email)
- **Persistent Sessions** - Stay logged in across app restarts
- **User Context** - Global user state management

### 🏠 Home Dashboard
- **Welcome Screen** - Personalized greeting with user info
- **Quick Stats Cards** - At-a-glance view of:
  - Today's classes count
  - Attendance percentage
  - Pending assignments
  - Upcoming quizzes
  - Next campus event
- **Today's Classes List** - Shows all classes with status (completed, upcoming, missed)
- **Latest Notification Preview** - Quick view of recent announcements
- **Next Event Card** - Upcoming campus event highlight
- **User Drawer** - Slide-out panel for profile access

### 📅 Schedule Management
- **Weekly Timetable** - Full week view (Monday to Friday)
- **Dynamic Dates** - Auto-calculates current week dates
- **Today Highlight** - Current day marked with special styling
- **Class Details** - For each class shows:
  - Subject name
  - Time slot
  - Room/Lab location
  - Teacher name
- **Visual Indicators** - Icons for time, location, and instructor

### 📝 Assignments Tracker
- **Multi-Course Support** - Assignments organized by 4 courses:
  - CS-101 Database Systems
  - CS-201 Mobile Development
  - MATH-301 Linear Algebra
  - ENG-101 English Composition
- **Status Tracking** - Three states: Pending, Submitted, Overdue
- **Smart Filtering**:
  - Filter by course (dropdown selector)
  - Filter by status (chip buttons)
- **Progress Dashboard** - Shows:
  - Total assignments count
  - Pending count
  - Overdue count
  - Completion percentage with progress bar
- **Assignment Cards** - Each card displays:
  - Assignment title
  - Course name
  - Due date
  - Status badge (color-coded)
  - Submission timestamp (if submitted)
  - Attachment indicator
- **Upload Modal** - Submit assignments with:
  - File picker option
  - Camera/photo option
  - Selected file preview
  - Submit button
- **Re-upload Support** - Resubmit previously submitted assignments

### 🎉 Events
- **Campus Events List** - Browse all upcoming events
- **Category Filtering** - Filter by:
  - All
  - Workshop
  - Sports
  - Cultural
  - Tech
- **Event Cards** - Rich cards with:
  - Event image
  - Event name
  - Category badge
  - Date & time
  - Location/venue
  - Organizer info
  - Description preview
  - "View Details" button

### 🔔 Notifications
- **Important Alerts** - Campus-wide announcements
- **Notification Types**:
  - New assignments
  - Exam alerts
  - Holiday notices
  - General announcements
- **Clean UI** - Card-based notification list
- **Quick Access** - Bell icon in header for instant access

### 👤 Profile Management
- **Student Info Display**:
  - Profile photo
  - Full name
  - Email
  - Roll number
  - Department
  - Semester
  - Section
  - Batch year
- **Quick Stats**:
  - Current CGPA
  - Semester attendance percentage
- **Contact Information**:
  - Phone number
  - Address
- **Account Section** - Student email display
- **Logout** - Secure sign-out functionality

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | React Native |
| **Development** | Expo SDK 54 |
| **Navigation** | React Navigation (Stack + Bottom Tabs) |
| **Authentication** | Firebase Auth |
| **Database** | Firebase Firestore |
| **Icons** | @expo/vector-icons (Ionicons) |
| **Safe Areas** | react-native-safe-area-context |
| **State Management** | React Context API |

---

## 📁 Project Structure

```
campus-companion/
├── assets/                    # Images, fonts, and static assets
├── src/
│   ├── components/
│   │   ├── Header.jsx         # Reusable header component
│   │   └── UserDrawer.jsx     # Slide-out user panel
│   ├── config/
│   │   └── firebase.js        # Firebase configuration
│   ├── context/
│   │   └── UserContext.js     # Global user state
│   ├── data/
│   │   ├── index.js           # Classes data
│   │   └── events.js          # Events data
│   ├── screens/
│   │   ├── SplashScreen.jsx   # App launch screen
│   │   ├── LoginScreen.jsx    # User login
│   │   ├── SignupScreen.jsx   # User registration
│   │   ├── HomeScreen.jsx     # Main dashboard
│   │   ├── ScheduleScreen.jsx # Weekly timetable
│   │   ├── AssignmentsScreen.jsx # Assignment tracker
│   │   ├── EventsScreen.jsx   # Campus events
│   │   ├── NotificationsScreen.jsx # Alerts & notices
│   │   └── ProfileScreen.jsx  # User profile
│   └── AppNavigator.jsx       # Navigation configuration
├── App.js                     # Entry point
├── app.json                   # Expo configuration
├── package.json               # Dependencies
└── README.md                  # Documentation
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS version recommended)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- [Expo Go](https://expo.dev/client) app on your device (for testing)

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd campus-companion
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Firebase:**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Email/Password authentication
   - Create a Firestore database
   - Add your Firebase config to `src/config/firebase.js`

### Running the App

1. **Start the development server:**
   ```bash
   npx expo start
   ```

2. **Run on your device:**
   - **Android:** Press `a` or scan QR code with Expo Go
   - **iOS:** Press `i` or scan QR code with Camera app
   - **Web:** Press `w` to open in browser

---

## 📱 Screenshots

| Home | Schedule | Assignments |
|:----:|:--------:|:-----------:|
| Dashboard with quick stats | Weekly timetable view | Track all assignments |

| Events | Profile | Notifications |
|:------:|:-------:|:-------------:|
| Browse campus events | Student information | Important alerts |

---

## 🎨 UI/UX Features

- **Modern Design** - Clean, card-based UI with soft shadows
- **Color-Coded Status** - Visual indicators for different states
- **Responsive Layout** - Works on various screen sizes
- **Smooth Navigation** - Bottom tabs + stack navigation
- **Interactive Elements** - Touch feedback on all buttons
- **Progress Indicators** - Visual progress bars and percentages
- **Filter Chips** - Easy filtering with toggle buttons
- **Modal Dialogs** - Clean upload and selection interfaces

---

## 🔜 Upcoming Features

- [ ] Push notifications
- [ ] Offline mode support
- [ ] Dark mode theme
- [ ] Assignment file upload to cloud storage
- [ ] Grade tracking
- [ ] Course materials download
- [ ] Chat with classmates
- [ ] Calendar integration

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)

---

<p align="center">Made with ❤️ for students</p>
