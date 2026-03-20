# SnapStudy

SnapStudy is an AI-powered lecture note generator that converts images of handwritten or printed lecture slides into structured, searchable notes using OCR and intelligent text processing.

Built with a Go backend, SnapStudy helps students quickly transform photos of class material into organized study notes.

## Overview

SnapStudy is designed to simplify note-taking by extracting text from lecture images and converting it into clean, study-ready content.

## Key Capabilities

- Convert handwritten and printed lecture images into text-based notes.
- Organize extracted content into structured, searchable study material.
- Store uploaded lecture images in AWS S3.
- Support a scalable backend architecture for future AI and study features.

## Tech Stack

- **Backend:** Go, Gin
- **Frontend:** React, Vite
- **Database:** PostgreSQL
- **Image Storage:** AWS S3
- **Infrastructure:** Docker, Docker Compose
- **Text Processing:** OCR + intelligent text processing pipeline

## Setup

### 1. Clone and install dependencies

```bash
git clone https://github.com/<your-username>/snapstudy.git
cd snapstudy
cd web && npm install && cd ..
cd server && go mod download && cd ..
```

### 2. Configure environment variables

Create a `server/.env` file and add the required backend, database, and AWS S3 configuration values.

### 3. Run the application

```bash
# Backend
make run-server

# Frontend (new terminal)
make run-dev
```

Backend: `http://localhost:8080`  
Frontend: `http://localhost:5173`

## Run with Docker (Optional)

```bash
make run
```
