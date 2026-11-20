
## Measured Docker Image Sizes

| Image | Size |
|---|---:|
| Node.js backend | 59.27 MiB |
| React + Nginx frontend | 24.91 MiB |

Measurements were obtained using `docker image inspect`
on the AWS EC2 Ubuntu instance.

These are final runtime image measurements, not
percentage reductions against single-stage baselines.

## Project Screenshots

### Application Dashboard
![Application Dashboard](screenshots/01-application-dashboard.png)

### Docker Containers
![Docker Containers](screenshots/02-docker-containers.png)

### Docker Image Optimization
![Image Optimization](screenshots/03-image-optimization.png)

### API Health and Database Connectivity
![API Health](screenshots/04-api-health.png)
