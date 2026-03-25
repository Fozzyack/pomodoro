# Pomodoro Timer

![Pomodoro Timer screenshot](./screenshot.png)

A small web-based Pomodoro timer built with Go, Chi, vanilla JavaScript, and Tailwind CSS. It serves a single focused timer page with editable durations, pause/reset controls, and an automatic cooldown period after each work session.

## Features

- 25-minute default Pomodoro session
- Start, pause, and reset controls
- Click-to-edit minutes, seconds, and centiseconds
- Automatic 5-minute cooldown after a completed work session
- Live progress bar tied to the active session
- Health check endpoint at `/health`

## Stack

- Go
- Chi router
- Zerolog
- Vanilla JavaScript
- Tailwind CSS v4
- Bun for frontend package management

## Getting Started

### Prerequisites

- Go 1.26+
- Bun

### Install dependencies

```bash
bun install
```

### Build the CSS

```bash
bunx @tailwindcss/cli -i ./assets/css/style.css -o ./assets/css/output.css
```

### Run the app

```bash
go run .
```

Open `http://localhost:8080` in your browser.

To use a different port:

```bash
go run . -port 3000
```

## Routes

- `/` - timer page
- `/health` - JSON health check
- `/assets/*` - static CSS and JavaScript

## Project Structure

```text
.
├── assets/
│   ├── css/
│   │   ├── style.css
│   │   └── output.css
│   └── js/
│       └── timer.js
├── internal/
│   ├── api/
│   ├── app/
│   └── routes/
├── templates/
│   ├── index.html
│   └── pages/
│       └── timer.html
├── main.go
├── go.mod
└── package.json
```

## Notes

- The timer runs fully in the browser once the page has loaded.
- Editing is disabled while the timer is actively running.
- Reset returns the timer to the original page duration.
