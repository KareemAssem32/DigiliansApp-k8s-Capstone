# K8s Project - DigiliansApp Deployments

This repository contains two different approaches to deploy the Digilians application on Kubernetes: using raw Kubernetes manifests and using Helm charts.

## Project Overview

The Digilians application is a full-stack web application consisting of:
- **Frontend**: Web interface built with modern web technologies
- **Backend**: API server handling business logic
- **Database**: PostgreSQL database for data persistence

The application demonstrates best practices for containerized application deployment on Kubernetes, including proper service architecture, ingress configuration, and stateful data management.

## Deployment Approaches

### 1. DigiliansApp-byKubernetes/
**Location**: `DigiliansApp-byKubernetes/`

This directory contains raw Kubernetes manifests for deploying the Digilians application. It includes:
- Ingress resources for external access
- Deployments for frontend and backend services
- Services for internal communication
- Secrets for database credentials
- StatefulSet for PostgreSQL database
- Documentation and deployment scripts

**Use Case**: Ideal for learning Kubernetes fundamentals, manual deployments, or when you need full control over individual resources.

**Deployment**: Uses `kubectl apply` commands in sequence.

### 2. DigiliansApp-byHelm/
**Location**: `DigiliansApp-byHelm/`

This directory contains a Helm chart that packages the same Digilians application for easier deployment and management. It includes:
- `Chart.yaml`: Chart metadata and version information
- `values.yaml`: Configurable deployment parameters
- `templates/`: Helm-templated Kubernetes manifests
- `README.md`: Helm-specific deployment instructions

**Use Case**: Suitable for production deployments, CI/CD pipelines, or when you need parameterized and reusable deployments.

**Deployment**: Uses `helm install` command with optional value overrides.

## Architecture

Both deployment approaches create the same Kubernetes resources:

```
Internet
    ↓
[Ingress Controller]
    ↓
[Frontend Service] ←→ [Frontend Deployment (Pods)]
    ↓
[Backend Service] ←→ [Backend Deployment (Pods)]
    ↓
[Database Service] ←→ [PostgreSQL StatefulSet (Pod)]
                     ↓
               [Persistent Volume]
```

## Prerequisites

- **Minikube** or Kubernetes cluster
- **kubectl** for cluster interaction
- **Helm** (required only for Helm deployment)

## Quick Start

### Using Kubernetes Manifests:
```bash
cd DigiliansApp-byKubernetes
minikube start --memory=4096 --cpus=2
minikube addons enable ingress
kubectl apply -f C0-db_secret.yaml
kubectl apply -f C1-db_svc.yaml
kubectl apply -f C2-statfulset.yaml
kubectl apply -f B0-backend-svc.yaml
kubectl apply -f B1-backend-deploy.yaml
kubectl apply -f A1-frontend-deploy.yaml
kubectl apply -f A2-frontend-svc.yaml
kubectl apply -f A0-ingress.yaml
```

### Using Helm Chart:
```bash
cd DigiliansApp-byHelm
minikube start --memory=4096 --cpus=2
minikube addons enable ingress
helm install digilians-app .
```

## Key Features

- **Scalable Architecture**: Separate deployments for frontend and backend with configurable replicas
- **Database Persistence**: PostgreSQL with persistent volume claims
- **Ingress Support**: External access through ingress controller
- **Security**: Database credentials stored in Kubernetes secrets
- **Monitoring Ready**: Proper labeling and annotations for monitoring tools

## Development and Testing

Both approaches support:
- Local development with Minikube
- Resource customization for different environments
- Debugging with kubectl logs and describe commands
- Rolling updates and rollbacks

## Contributing

When contributing to this project:
1. Test changes in both deployment approaches
2. Update documentation in both README files
3. Ensure backward compatibility
4. Follow Kubernetes and Helm best practices

## License

This project is for educational and demonstration purposes.