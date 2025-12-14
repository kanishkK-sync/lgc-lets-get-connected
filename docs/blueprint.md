# **App Name**: LGC – Let's Get Connected

## Core Features:

- Public Landing Page: Displays a hero section, core members (with photo, name, designation), an about section, and a public search bar for members.
- Authentication: Implements Google (Gmail) Auth for login/signup, redirecting users to their dashboard upon successful login.
- User Dashboard: Provides a user dashboard with a left sidebar menu (Home, My Projects, Experience, Connections, Logout), top right stats (Projects Done, Likes), and main content for project searching and display.
- Project Details Page: Displays detailed information for each project, including title, description, source code, components used, members, and circuit diagram image.
- Likes System: Allows logged-in users to like other users (only once per user), with likes stored in Firestore and visible publicly on profiles.
- Connections: Enables logged-in users to connect with each other, storing connections in Firestore.
- Member Search: Uses generative AI as a tool that, depending on the member entered by the user, determines whether to suggest users with a similar name.

## Style Guidelines:

- Dark navy/black background (#0A192F) for a professional tech vibe.
- Primary color: Electric Blue (#7DF9FF) for a vibrant and modern feel.
- Accent color: Neon Purple (#D09CFA) for highlights and call-to-actions.
- Body and headline font: 'Inter' sans-serif for a clean, modern, and professional look.
- Note: currently only Google Fonts are supported.
- Use simple, outlined icons in cyan and purple to maintain a consistent tech theme.
- Implement smooth scrolling and subtle animations to enhance user experience.
- Subtle transitions and hover effects on buttons and interactive elements to provide feedback.