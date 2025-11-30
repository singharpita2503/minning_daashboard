# Mining Dashboard - Frontend

This is the frontend application for the Mining Dashboard, built with React, Vite, and Tailwind CSS.

## Features

- Real-time worker health monitoring
- Analytics dashboard with live data
- Worker detail views with charts
- Dark/Light mode toggle
- Responsive design

## Technology Stack

- **React** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Lucide React** - Icon library
- **Recharts** - Charting library

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install
```

### Development

```bash
# Start development server (http://localhost:3000)
npm run dev
```

### Build for Production

```bash
# Build static files to static/dist
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
frontend/
├── src/
│   ├── components/     # Reusable components
│   │   ├── Layout.jsx
│   │   ├── Navbar.jsx
│   │   └── Sidebar.jsx
│   ├── pages/          # Page components
│   │   ├── Analytics.jsx
│   │   ├── Workers.jsx
│   │   └── WorkerDetail.jsx
│   ├── App.jsx         # Main app component
│   ├── main.jsx        # Entry point
│   └── index.css       # Global styles
├── public/             # Static assets
├── index.html          # HTML template
└── package.json        # Dependencies
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Configuration

- **Vite config**: `vite.config.js`
- **Tailwind config**: `tailwind.config.js`
- **PostCSS config**: `postcss.config.js`

## API Integration

The frontend connects to the backend API at `http://localhost:5000` via proxy configuration in `vite.config.js`.















