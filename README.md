## Overview
 
StudyDesk is a full-stack study planner, currently in active development, built with vanilla JavaScript and a Node.js REST API. It brings together the assignments, deadlines, and priorities that are usually spread across course portals, email, and calendar tools. The frontend talks to the backend through fetch and async/await, and data is stored as JSON on the server. The UI has a skeuomorphic design: binders on a wooden shelf, ruled notebook paper, and a cork board for urgent reminders.
 
> **Status:** Core features complete. Styling polish and database migration in progress.
 
[View the GitHub Repository](https://github.com/matontim/studydesk)
 
---
 
## Tech Stack
 
| Layer | Technology | Purpose |
|-------|------------|---------|
| Frontend | HTML, CSS, JavaScript | UI, interactivity, DOM manipulation |
| Styling | Handwritten CSS | Skeuomorphic design, gradients, animations |
| Backend | Node.js, Express | REST API, user authentication |
| Data | JSON file storage | Per-user persistent data |
| Version Control | Git, GitHub | Source control and hosting |
 
---
 
## Features
 
- **Skeuomorphic design**: wood shelf, coloured binders, ruled notebook paper with hole punches, and cork board sticky notes
- **User authentication**: registration and login with per-user data stored on the server
- **Dynamic subject binders**: auto-generated from assignment data, clickable to filter the assignment list in real time
- **Assignment management**: add, complete with strikethrough, and delete assignments
- **Due Soon board**: automatically surfaces assignments due within 3 days
- **Calendar view**: weekly and monthly views with assignment dots on due dates, toggle between views
- **Active state filtering**: binder click highlights selection and filters the table instantly
---
 
## What I Learned
 
This project was built incrementally from a static HTML file into a full-stack application. Currently learning DOM manipulation, localStorage, REST APIs, fetch, async/await, and Node.js along the way. Every feature was written without copying boilerplate, which gave me a deep understanding of how the frontend and backend communicate.
 
---
 
## Next Steps
 
- Migrate data storage from JSON to a real database (SQLite or PostgreSQL)
- Style the login screen to match the skeuomorphic theme
- Deploy with a production Node.js host (Railway or Render)
- Add a React rebuild as a separate branch to compare approaches
- Implement TypeScript for added type safety on top of JavaScript
- Replace login with a production auth system (NextAuth.js)
---
 
## Tools
HTML, CSS, JavaScript, Node.js, Express, Git, GitHub, VS Code

