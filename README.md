
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
![Application Dashboard](screenshots/application-dashboard.png)

### Docker Containers
![Docker Containers](screenshots/docker-containers.png)

### Docker Image Optimization
![Image Optimization](screenshots/image-optimization.png)

### API Health and Database Connectivity
![API Health](screenshots/api-health.png)
