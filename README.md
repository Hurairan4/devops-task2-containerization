
## Project Screenshots

### 1. Deployed Application Dashboard

![Application Dashboard](screenshots/application-dashboard.png)

React-based Task Manager deployed on AWS EC2, accessible through Nginx on port 8080.

### 2. Docker Compose Services

![Docker Containers](screenshots/docker-containers.png)

Three running containers: React/Nginx frontend, Node.js backend, and PostgreSQL database. Backend and database health checks are passing.

### 3. Docker Image Optimization

![Image Optimization](screenshots/image-optimization.png)

Measured production runtime image sizes:
- **Backend:** 59.27 MiB
- **Frontend:** 24.91 MiB

Multi-stage Dockerfiles separate build dependencies from production runtime components.

### 4. API and Database Connectivity

![API Health](screenshots/api-health.png)

REST API verification demonstrating successful Nginx routing, backend health, PostgreSQL connectivity, and task retrieval.
## Project Screenshots

### Application Dashboard
![Application Dashboard](screenshots/application-dashboard.png)

### Docker Containers
![Docker Containers](screenshots/docker-containers.png)

### Docker Image Optimization
![Image Optimization](screenshots/image-optimization.png)

### API Health and Database Connectivity
![API Health](screenshots/api-health.png)
