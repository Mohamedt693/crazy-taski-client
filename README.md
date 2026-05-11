# Crazy Taski - Project Management Client

Crazy Taski is a high-performance, modern project management application designed for technical and architectural teams. The application is built with a focus on speed, scalability, and a professional user experience.

## Key Features

- Workspace Management: Manage personal projects and collaborate on shared workspaces efficiently.
- Real-time Invitation System: A specialized notification system to handle project invitations with immediate UI feedback.
- Dynamic Sidebar Navigation: An adaptive navigation system providing project-specific views and a space-saving collapse mode.
- Performance Optimization: Extensive implementation of React.lazy and Suspense for aggressive code-splitting and reduced initial page load times.
- Secure Routing: Robust authentication guards to manage access between protected dashboard routes and public authentication pages.
- Professional UI/UX: Developed using Tailwind CSS, featuring smooth transitions and custom-themed components.

## Technical Stack

- Core: React 18 and TypeScript for enhanced type safety and code maintainability.
- Build Tool: Vite for a fast development and bundling experience.
- Routing: React Router Dom v6 utilizing the latest Data APIs.
- State Management: Zustand for lightweight and reactive global state management.
- Styling: Tailwind CSS with CSS Variables for consistent and dynamic styling.
- Icons: Lucide React.
- Notifications: React Toastify for reliable user feedback.

## Project Structure

src/
├── components/       # Reusable UI components, Layouts, and Shared forms
├── pages/            # Main application views (Home, Tasks, Notes, Notifications, etc.)
├── store/            # Global state management via Zustand stores
├── types/            # TypeScript interfaces and type definitions
├── utils/            # Helper functions, Routing logic, and Suspense wrappers
└── api/         # API integration and Axios configurations

## Getting Started

1. Clone the repository:
  git clone https://github.com/Mohamedt693/crazy-taski-client.git

2. Install dependencies:
  npm install

3. Environment Setup:
  Create a .env file in the root directory and add the API base URL:
  VITE_API_URL=https://crazy-taski-client-production.up.railway.app/

4. Run the development server:
  npm run dev

## Technical Highlights

-Code Splitting & Lazy Loading: Implemented at the route level using React.lazy and Suspense to ensure the browser only loads the necessary JavaScript chunks for each view, significantly improving initial load performance.

-Fast Refresh Compliance: The Router is architected as a functional component to ensure full compatibility with Vite's Hot Module Replacement (HMR) for a seamless development experience.

-Advanced State & Logic: Utilized Custom Hooks to encapsulate complex business logic and stateful behavior, promoting code reusability and clean component architecture.

-Axios Integration & Interceptors: Centralized API management using Axios interceptors to handle authentication tokens, global error catching, and request/response logging.

-Preloader System: Integrated a global preloading mechanism to enhance perceived performance and provide visual feedback during initial data fetching or route transitions.

-Role-Based Access Control (RBAC): Implemented a robust permission handling system to protect sensitive routes and UI elements based on user roles and project-level permissions.

-Standardized Date Handling: Utilized specialized functions for processing and formatting dates using ISO 8601 standards to ensure consistency across different time zones and backend synchronization.

-Theme Management: Support for Dark and Light modes using CSS variables and state persistence, providing a comfortable viewing experience in various lighting conditions.

-Custom Scrollbars: Enhanced user experience for long lists and sidebars with custom-styled, non-intrusive scrollbars that maintain the application's premium aesthetic.

## Developer
Developed by Mohamed Tharwat