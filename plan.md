# QUUB - Detailed Development Plan

Welcome to the development plan for QUUB! This document breaks down exactly how we will build the website step-by-step. Think of this as our roadmap.

## 1. Technology Stack

To build a modern, responsive, and real-time application quickly, we will use the following tools:

- **Frontend:** **React (via Vite)**
  - *Why?* React is perfect for building interactive user interfaces. It allows us to create reusable components (like buttons, job cards, and message bubbles), making our code clean and easy to maintain. Vite provides a super-fast development environment.
- **Backend & Database:** **Firebase**
  - *Why?* Firebase provides a complete, easy-to-use backend solution. We will use:
    - **Firebase Authentication:** For handling user registration, secure login, and managing roles (Worker vs. Customer).
    - **Firestore Database:** A real-time, NoSQL database to store our users, jobs, and messages. It's incredibly fast and syncs instantly.
- **Styling:** **Vanilla CSS**
  - *Why?* We will use standard CSS to create a premium, customized look with smooth animations and responsive designs, giving us total control over the visual aesthetics.

## 2. Pages Required

Our application will need the following main pages to provide a complete experience:

- **Home Page (`/`)**: The landing page introducing QUUB, with clear buttons to register or log in.
- **Authentication Pages (`/login`, `/register`)**: Where users sign up, and importantly, choose their identity (Worker or Customer).
- **Dashboard (`/dashboard`)**: A personalized homepage after logging in. The layout will change based on whether the user is a worker or a customer.
- **Profile Page (`/profile`)**: Where workers can edit their avatar, skills, and portfolio. Customers can view these profiles.
- **Job Board (`/jobs`)**: The main list where workers can browse all available job postings.
- **Post a Job (`/post-job`)**: A form for customers to create new job opportunities.
- **Job Details (`/jobs/:id`)**: A specific page for a single job showing the full description, budget, and deadline.
- **Messages (`/messages`)**: An inbox showing conversations between workers and customers.

## 3. Database Structure (Data to Store)

We will use Firebase Firestore to store our data. Here is how we will organize our data into specific "Collections":

### `Users` Collection
Stores information about everyone registered on the platform.
- `uid` (unique ID from Firebase Auth)
- `role` ("worker" or "customer")
- `name`, `email`, `avatarUrl`
- `skills`, `portfolio` (used specifically for workers)
- `createdAt` (timestamp)

### `Jobs` Collection
Stores all the job postings created by customers.
- `jobId` (unique identifier)
- `customerId` (links to the user who posted it)
- `title`, `description`, `budget`, `deadline`
- `status` ("open", "completed")
- `createdAt` (timestamp)

### `Applications` Collection
Tracks when a worker expresses interest in a job.
- `applicationId`
- `jobId` (which job they applied for)
- `workerId` (who applied)
- `status` ("pending", "accepted", "rejected")
- `createdAt` (timestamp)

### `Messages` Collection
Stores the actual chat messages for the messaging system.
- `messageId`
- `conversationId` (groups messages between the same two people)
- `senderId` (who sent it)
- `receiverId` (who receives it)
- `content` (the actual text message)
- `timestamp` (when it was sent)
- `isRead` (boolean: true/false)

## 4. Development Phases

We will build QUUB in four clear phases. This helps us focus on one core feature at a time without getting overwhelmed.

### Phase 1: Foundation and User System
*Goal: Get the site running and let people register and log in.*
- Set up the React project using Vite.
- Connect the project to Firebase.
- Build the Registration and Login pages.
- Implement the logic to save a user's chosen role ("worker" or "customer") securely in the database upon sign-up.

### Phase 2: Profiles and Job Posting
*Goal: Customers can post jobs, and workers can set up their profiles.*
- Build the Profile page for workers to add their details and portfolio.
- Build the "Post a Job" form for customers.
- Save job postings into the Firebase `Jobs` collection.
- Create a dashboard so customers can manage the jobs they've posted.

### Phase 3: Job Browsing and Applications
*Goal: Workers can find work and express interest.*
- Build the main Job Board page where all open jobs are displayed.
- Create the Job Details page for viewing specific job information.
- Add the "Interested" button so workers can apply.
- Save these applications to the `Applications` collection in Firebase.

### Phase 4: Real-time Messaging & Polish
*Goal: Let users communicate and make the site look amazing.*
- Build the Messages inbox interface.
- Connect the chat to Firebase Firestore so messages appear in real-time.
- Add read/unread status and timestamps to messages.
- Final polish: Add micro-animations, refine the CSS styling for a premium feel, and ensure everything is fully responsive on mobile devices.
