# DigiliansApp-byHelm

This repository contains a Helm chart to deploy the Digilians application (frontend, backend, and database) locally using Minikube.

## Project overview
This is the Helm version of the DigiliansApp deployment, equivalent to the Kubernetes manifests in the `DigiliansApp-byKubernetes` directory. The Helm chart packages the same application components into a reusable and configurable chart.

### Chart components
- **Chart.yaml**: Chart metadata and dependencies
- **values.yaml**: Default configuration values
- **templates/**: Kubernetes manifests templated with Helm values
  - `A0-ingress.yaml` - Ingress configuration for external access
  - `A1-frontend-deploy.yaml` - Frontend Deployment
  - `A2-frontend-svc.yaml` - Frontend Service
  - `B0-backend-svc.yaml` - Backend Service
  - `B1-backend-deploy.yaml` - Backend Deployment
  - `C0-db_secret.yaml` - Database credentials secret
  - `C1-db_svc.yaml` - Database Service
  - `C2-statfulset.yaml` - StatefulSet for the database

## Prerequisites
- `minikube` installed (https://minikube.sigs.k8s.io/docs/start/)
- `kubectl` installed and configured (or use `minikube kubectl --`)
- `helm` installed (https://helm.sh/docs/intro/install/)

## Run on Minikube (quick steps)

1. Start Minikube:
   ```bash
   minikube start --memory=4096 --cpus=2
   ```

2. Enable the ingress addon (if you plan to use the ingress):
   ```bash
   minikube addons enable ingress
   ```

3. Install the Helm chart:
   ```bash
   helm install digilians-app .
   ```

4. Verify resources:
   ```bash
   kubectl get pods
   kubectl get svc
   kubectl get ingress
   ```

5. Access the application:
   - If using a Service of type `NodePort`/`ClusterIP`, you can expose it via `minikube service`:
     ```bash
     minikube service list
     minikube service frontend --url
     ```

   - If using the Ingress resource with hosts (`digilians-app.com`, `api.digilians-app.com`), map the hosts to your Minikube IP in `/etc/hosts`:
     ```bash
     # Get minikube ip
     minikube ip
     # Then add lines in /etc/hosts, e.g.:
     # 192.168.49.2 digilians-app.com
     # 192.168.49.2 api.digilians-app.com
     ```

## Customization

You can customize the deployment by modifying `values.yaml` or overriding values during installation:

```bash
# Install with custom values
helm install digilians-app . --set frontend.replicas=3 --set backend.image=my-custom-backend:latest

# Or use a custom values file
helm install digilians-app . -f my-values.yaml
```

Key configurable values:
- **ingress**: Hostnames and paths for frontend and backend
- **frontend**: Image, replicas, port, environment variables
- **backend**: Image, replicas, port, database configuration
- **postgres**: Database image, storage size, credentials

## Useful debug commands

```bash
# Check Helm release status
helm status digilians-app

# View generated manifests
helm template digilians-app .

# Upgrade the release
helm upgrade digilians-app .

# Uninstall the release
helm uninstall digilians-app

# View pod logs
kubectl logs deploy/frontend
kubectl logs deploy/backend

# Describe resources
kubectl describe pod <pod-name>
kubectl describe statefulset postgres
```

## Notes and tips
- Adjust resource requests/limits in `values.yaml` if Minikube has limited resources
- Ensure database credentials in `values.yaml` match what the backend expects
- The default database password is base64 encoded (`ZXdlc3Q=` = "ewest")
- If pods fail to start, check events with `kubectl describe` and inspect container logs
- The chart uses PostgreSQL 15 by default with 1Gi persistent storage