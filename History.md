# Project History

This file tracks daily changes, fixes, and best practices implemented for the ColisApp project.

## 2025-07-28

- **UI/UX Overhaul**: Major updates to the user profile section and overall UI/UX improvements.
- **Responsive Design**: Made several pages responsive for mobile, tablet, and desktop views.
- **Motion Library Update**: Replaced `framer-motion` with `tailwindcss-motion` for animations.
- **Loading Skeletons**: Implemented loading skeletons for a better user experience on pages like Login, Recap, and Simulation.
- **Component Refactoring**: Refactored various components including Contact Form, Add Receiver Form, and the Simulation Wizard.

## 2025-07-21

- **Profile Layout**: Updated the client profile layout and related pages.
- **UI/UX Improvements**: Added `.container` class to children of `/client/profile` for better UI consistency.
- **Authentication Fix**: Resolved a login issue that was blocking the Vercel build.

## 2025-07-04

- **Initial Setup**:
  - Created `History.md` to track project progress.
  - Set up the daily work context for the Gemini CLI.
- **Database**: Implemented soft delete functionality in `schema.prisma`.
- **Build Fix**: Fixed an HTML build error by modifying `package.json` to include environment variable settings.
