# DevOps Task 2 — Application Containerization & Asset Optimization

### Multi-Stage Docker Builds | AWS EC2 | Docker Compose | React | Node.js | PostgreSQL | Nginx

A full-stack, containerized Task Management application deployed on an AWS EC2 Ubuntu instance. This project demonstrates practical DevOps concepts including multi-stage Docker image construction, application dependency management, image footprint optimization, container networking, environment-based configuration, persistent database storage, and container orchestration using Docker Compose.

---

## 1. Project Overview

The primary objective of this project is to design and implement a modular, reliable, and resource-efficient containerized environment for a multi-dependency web application.

The application consists of three independently managed services:

- **Frontend:** A React-based Task Manager interface served through Nginx.
- **Backend:** A Node.js and Express REST API responsible for processing requests and communicating with the database.
- **Database:** PostgreSQL for persistent task storage.

All three components run in separate Docker containers and communicate over a dedicated Docker Compose bridge network.

The application was built and deployed on an AWS EC2 Ubuntu 24.04 LTS instance, managed remotely through Windows 10 Command Prompt using SSH.

## 2. Project Objectives

This project addresses the following DevOps requirements:

1. **Application Containerization:** Package a multi-dependency application into independently managed Docker containers.
2. **Multi-Stage Docker Builds:** Separate dependency installation and application compilation from production runtime environments.
3. **Image Footprint Optimization:** Reduce unnecessary build tools and dependencies in final runtime images.
4. **Environment Configuration:** Manage database credentials and runtime settings through environment variables.
5. **Container Networking:** Establish reliable communication between frontend, backend, and database services.
6. **Port Routing:** Configure Nginx as a reverse proxy and expose the application through a designated host port.
7. **Reliability:** Implement health checks, restart policies, and persistent database storage.

## 3. Technology Stack

| Technology | Purpose |
|---|---|
| AWS EC2 | Cloud hosting infrastructure |
| Ubuntu 24.04 LTS | Linux operating system |
| Docker | Application containerization |
| Docker Compose | Multi-container orchestration |
| React 18 | Frontend user interface |
| Vite | Frontend build tooling |
| Node.js 22 | Backend JavaScript runtime |
| Express.js | REST API framework |
| PostgreSQL 16 | Relational database |
| Nginx | Web server and reverse proxy |
| Git and GitHub | Version control and source hosting |

## 4. System Architecture

The application follows a three-tier architecture.

```text
                  Windows 10 Browser
                          |
                          |
                  HTTP Request :8080
                          |
                          v
               AWS EC2 Ubuntu Server
                          |
            +-------------+-------------+
            |                           |
            |   Docker Compose Network  |
            |                           |
            |  +---------------------+  |
            |  | Frontend Container  |  |
            |  | React + Nginx       |  |
            |  | Internal Port 80    |  |
            |  +----------+----------+  |
            |             |             |
            |       /api/* Proxy        |
            |             v             |
            |  +---------------------+  |
            |  | Backend Container   |  |
            |  | Node.js + Express   |  |
            |  | Internal Port 3000  |  |
            |  +----------+----------+  |
            |             |             |
            |       SQL Queries         |
            |             v             |
            |  +---------------------+  |
            |  | Database Container  |  |
            |  | PostgreSQL 16       |  |
            |  | Internal Port 5432  |  |
            |  +----------+----------+  |
            |             |             |
            |    Persistent Volume      |
            +-------------+-------------+
```

### Request Flow

When a user opens the application, the request reaches the EC2 instance through port 8080.

Docker forwards the request to Nginx on port 80 inside the frontend container. Nginx serves the compiled React application.

When the frontend requests task data, Nginx forwards `/api/` requests to the Node.js backend on port 3000.

The backend communicates with PostgreSQL over the private Docker network, executes SQL queries, and returns JSON responses to the frontend.

The database and backend ports are not published directly to the EC2 host.

## 5. Multi-Stage Docker Implementation

### Frontend Dockerfile

The frontend uses two build stages.

**Stage 1 — Build Environment**

- Uses Node.js 22 Alpine.
- Installs frontend dependencies using `npm ci`.
- Compiles React and Vite source files into optimized production assets.
- Generates the `dist` directory containing HTML, JavaScript, and CSS.

**Stage 2 — Production Runtime**

- Uses Nginx Alpine.
- Copies only the compiled production assets from the build stage.
- Configures Nginx to serve the application and forward API requests.
- Exposes container port 80.

This approach prevents Node.js development dependencies and frontend build tools from being included in the final Nginx runtime image.

### Backend Dockerfile

The backend also uses a two-stage Dockerfile.

**Stage 1 — Dependency Installation**

- Uses Node.js 22 Alpine.
- Installs production-only Node.js dependencies.
- Uses a separate dependency installation stage.

**Stage 2 — Runtime Environment**

- Copies the required dependencies and backend application code.
- Sets `NODE_ENV=production`.
- Runs the application as a non-root Node.js user.
- Exposes internal port 3000.

This design keeps the production runtime separate from the dependency installation stage.

## 6. Docker Image Optimization

Image optimization was an important objective of this project.

The following techniques were implemented:

- Multi-stage Docker builds.
- Alpine-based container images.
- Production-only backend dependencies.
- Optimized React production compilation.
- `.dockerignore` files to exclude unnecessary build context files.
- Separation of frontend compilation from Nginx runtime.
- Reproducible dependency installation using npm lockfiles.

### Measured Image Sizes

The final application images were inspected on AWS EC2 using Docker CLI commands.

| Docker Image | Measured Size |
|---|---:|
| Node.js Backend | 59.27 MiB |
| React + Nginx Frontend | 24.91 MiB |

These measurements represent the final runtime image sizes. They are not percentage reductions compared with unoptimized baseline images.

## 7. Docker Compose Orchestration

Docker Compose manages the application as a unified multi-container environment.

The configuration defines three services:

| Service | Container Technology | Internal Port |
|---|---|---|
| frontend | React + Nginx | 80 |
| backend | Node.js + Express | 3000 |
| db | PostgreSQL | 5432 |

Docker Compose provides:

- A dedicated bridge network.
- Service discovery using container service names.
- Environment variable injection.
- Persistent database volume configuration.
- Container restart policies.
- Health checks and service dependencies.

The backend waits for the database health check to succeed before starting.

## 8. Container Networking and Port Mapping

The application uses the following routing configuration:

| Source | Destination | Purpose |
|---|---|---|
| EC2 Host :8080 | Frontend :80 | Public-facing application access |
| Nginx | Backend :3000 | REST API routing |
| Backend | PostgreSQL :5432 | Database communication |

Only the frontend port is published on the host.

The backend and PostgreSQL communicate through Docker's internal network, reducing unnecessary exposure.

For the development deployment, the EC2 Security Group allows SSH on port 22 and application access on port 8080, restricted to the administrator's IP address.

## 9. Environment Variable Management

Application configuration is separated from the source code using environment variables.

The `.env` file provides values such as:

```dotenv
DB_NAME=taskmanager
DB_USER=taskadmin
DB_PASSWORD=your_secure_password
```

The actual `.env` file is excluded from version control through `.gitignore`.

A `.env.example` file provides placeholder values for users deploying the project.

The backend receives database connection settings through Docker Compose, allowing configuration changes without modifying application source code.

**Security note:** Environment variables protect credentials from being hardcoded into the repository, but they are not a dedicated secret-management system. Production deployments should use a managed secrets solution and HTTPS.

## 10. PostgreSQL Persistent Storage

PostgreSQL uses a named Docker volume to store application data independently of the container lifecycle.

The database initialization script creates the `tasks` table and inserts an initial sample task when a new database volume is initialized.

The application supports:

- Creating tasks.
- Retrieving stored tasks.
- Storing task records in PostgreSQL.

The persistent volume is designed to preserve database records across container restarts and recreation, provided the volume is not removed.

## 11. REST API Implementation

The backend exposes the following endpoints:

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Check backend and database connectivity |
| GET | `/api/tasks` | Retrieve stored tasks |
| POST | `/api/tasks` | Create a new task |

### Health Check Example

```bash
curl http://localhost:8080/api/health
```

Verified response:

```json
{
  "status": "healthy",
  "database": "connected"
}
```

### Retrieve Tasks

```bash
curl http://localhost:8080/api/tasks
```

Returns stored task records in JSON format.

### Create a Task

```bash
curl -X POST http://localhost:8080/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Complete DevOps Project"}'
```

The backend uses parameterized SQL queries when inserting task records.

## 12. Deployment Instructions

### Prerequisites

- Linux host with Docker Engine installed.
- Docker Compose v2.
- Git.
- Available host port 8080.

### Clone the Repository

```bash
git clone https://github.com/Hurairan4/devops-task2-containerization.git
cd devops-task2-containerization
```

### Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env` and configure a strong database password.

### Build and Start Containers

```bash
docker compose up -d --build
```

### Verify Container Status

```bash
docker compose ps
```

### Access the Application

Open:

```text
http://localhost:8080
```

When deployed on EC2, use the instance's public IP address and ensure the security group permits the required traffic.

### Stop the Application

```bash
docker compose down
```

This stops and removes the containers and network without deleting the named database volume.

## 13. Testing and Verification

The deployed application was tested using Docker CLI commands, HTTP requests, and browser interaction.

| Test | Observed Result |
|---|---|
| Frontend HTTP request | HTTP 200 OK |
| Backend health endpoint | Healthy |
| PostgreSQL connectivity | Connected |
| Task creation through browser | Successful |
| Task retrieval through REST API | Successful |
| Backend container health | Healthy |
| Database container health | Healthy |
| Docker image inspection | Completed |

The frontend container was also confirmed running through Docker Compose.

Database persistence across container recreation should be verified separately before recording it as a passed test.

## 14. Project Screenshots

### Application Dashboard

![Application Dashboard](screenshots/application-dashboard.png)

The deployed React Task Manager application running on AWS EC2, displaying the task creation interface and stored task records.

### Docker Compose Containers

![Docker Containers](screenshots/docker-containers.png)

Docker Compose status showing the three application containers running, with healthy backend and database services.

### Docker Image Optimization

![Docker Image Optimization](screenshots/image-optimization.png)

Measured runtime image sizes for the Node.js backend and Nginx frontend.

### API Health and Database Connectivity

![API Health](screenshots/api-health.png)

Successful API health response and retrieval of stored tasks from PostgreSQL.

## 15. Challenges and Troubleshooting

### Docker Socket Permission Error

**Issue:** The Ubuntu user initially received permission denied when accessing the Docker daemon.

**Resolution:** Configured Docker group access and refreshed the user's group membership.

### Dockerfile Not Found

**Issue:** The initial backend image build failed because the Dockerfile was missing.

**Resolution:** Created the correctly named Dockerfile and verified the backend application files.

### Frontend Docker Build Not Completing

**Issue:** The frontend build remained active because the npm build script launched the Vite development server instead of generating production assets.

**Resolution:** Updated the script to use `vite build`, allowing Docker to compile the application and complete the multi-stage build.

### Git Push Errors

**Issue:** The initial GitHub push failed because no commit existed on the main branch and the remote URL was incorrect.

**Resolution:** Corrected the remote URL, staged the source files, created the initial commit, and pushed the repository.

## 16. Skills Demonstrated

This project demonstrates practical experience in:

- Linux server administration.
- AWS EC2 deployment.
- Docker containerization.
- Multi-stage Dockerfile development.
- Docker image optimization.
- Docker Compose orchestration.
- Container networking and port mapping.
- Nginx reverse proxy configuration.
- Environment-based application configuration.
- PostgreSQL integration and persistent storage configuration.
- Application health monitoring.
- REST API testing.
- Git and GitHub version control.
- Troubleshooting container builds and deployment issues.

## 17. Future Improvements

Potential improvements include:

- GitHub Actions CI/CD pipeline for automated Docker builds.
- Automated application and API tests.
- HTTPS termination with a domain name.
- AWS Secrets Manager integration.
- Container vulnerability scanning.
- Centralized monitoring and logging.
- Docker image publishing to Amazon ECR.
- Automated deployment workflows.

---

## Author

**Huraira Riaz**

GitHub: [Hurairan4](https://github.com/Hurairan4)

**Project:** DevOps Task 2 — Application Containerization & Asset Optimization

**Deployment Platform:** AWS EC2 — Ubuntu Linux

**Repository:** [devops-task2-containerization](https://github.com/Hurairan4/devops-task2-containerization)
