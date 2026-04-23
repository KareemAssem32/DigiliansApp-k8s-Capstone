# Docker Images

This directory contains the Docker configurations for building container images used in the Digilians application deployment. The application consists of two main services: a React frontend and a FastAPI backend.

## Overview

The Docker setup provides containerized versions of the application components that are deployed in the Kubernetes manifests and Helm charts. Each service has its own optimized Docker image with multi-stage builds for production efficiency.

## Services

### Backend Service (`backend/`)

**Technology Stack:**
- **Framework**: FastAPI (Python web framework)
- **ASGI Server**: Uvicorn
- **Database ORM**: SQLAlchemy
- **Database Driver**: psycopg2-binary (PostgreSQL)
- **Data Validation**: Pydantic

**Key Dependencies:**
- `fastapi==0.104.1` - Modern Python web framework
- `uvicorn==0.24.0` - ASGI server for FastAPI
- `sqlalchemy==2.0.23` - SQL toolkit and ORM
- `psycopg2-binary==2.9.9` - PostgreSQL adapter
- `pydantic==2.5.0` - Data validation and parsing

**Docker Configuration:**
- **Base Image**: `python:3.11-slim` (lightweight Python image)
- **Port**: 8000
- **Command**: `uvicorn main:app --host 0.0.0.0 --port 8000`

**Files:**
- `Dockerfile` - Multi-stage build configuration
- `requirements.txt` - Python dependencies
- `main.py` - FastAPI application entry point
- `.dockerignore` - Excludes Python cache files and virtual environments

### Frontend Service (`frontend/`)

**Technology Stack:**
- **Framework**: React 18
- **Build Tool**: Create React App
- **Web Server**: Nginx (Alpine Linux)
- **Node Version**: 18 (Alpine)

**Key Dependencies:**
- `react: ^18.2.0` - React library
- `react-dom: ^18.2.0` - React DOM rendering
- `react-scripts: 5.0.1` - Create React App scripts

**Docker Configuration:**
- **Build Stage**: `node:18-alpine` for building the application
- **Production Stage**: `nginx:alpine` for serving static files
- **Port**: 80
- **Build Process**: `npm run build` creates optimized production build

**Files:**
- `Dockerfile` - Multi-stage build (build + production)
- `package.json` - Node.js dependencies and scripts
- `nginx.conf` - Nginx configuration with API proxy
- `public/` - Static assets
- `src/` - React application source code
- `.dockerignore` - Excludes node_modules, build artifacts, and .git

## Docker Architecture

### Multi-Stage Builds

Both services use multi-stage Docker builds for optimization:

**Backend:**
```dockerfile
FROM python:3.11-slim
# Single stage - Python runtime only
```

**Frontend:**
```dockerfile
FROM node:18-alpine AS build    # Build stage
FROM nginx:alpine               # Production stage
```

### Networking

The frontend nginx configuration includes API proxying:
- Frontend serves on port 80
- API requests (`/api/*`) are proxied to `backend-svc:8000`
- Supports WebSocket upgrades for real-time features

## Building Images

### Backend Image
```bash
cd backend
docker build -t digilians-backend:latest .
```

### Frontend Image
```bash
cd frontend
docker build -t digilians-frontend:latest .
```

### Build All Images
```bash
# From Docker-Images directory
docker build -t digilians-backend:latest ./backend
docker build -t digilians-frontend:latest ./frontend
```

## Image Registry

The images are published to Docker Hub as:
- **Frontend**: `kareem32/app-test:frontend`
- **Backend**: `kareem32/app-test:backend`

## Development vs Production

### Development
- Use `npm start` for frontend hot-reloading
- Use `uvicorn main:app --reload` for backend auto-reload
- Mount source code as volumes for live development

### Production
- Optimized builds with minification
- Nginx serving static files efficiently
- API proxy configuration for seamless frontend-backend communication

## Security Considerations

- Uses slim/alpine base images for smaller attack surface
- Non-root user execution where possible
- `.dockerignore` files prevent sensitive files from being included
- Dependencies pinned to specific versions

## Performance Optimizations

- **Frontend**: Multi-stage build excludes development dependencies from final image
- **Backend**: Uses `--no-cache-dir` for pip installs to reduce image size
- **Layer Caching**: Dependencies installed before copying source code
- **Alpine Images**: Smaller base images for faster downloads and smaller attack surface

## Integration with Kubernetes

These Docker images are referenced in:
- `DigiliansApp-byKubernetes/` - Direct manifest references
- `DigiliansApp-byHelm/values.yaml` - Helm chart configuration

The container ports (80 for frontend, 8000 for backend) match the Kubernetes service configurations.