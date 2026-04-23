# DigiliansApp-byKubernetes

This repository contains Kubernetes manifests to deploy the Digilians application (frontend, backend, and database) locally using Minikube.

## Project overview
- Manifests:
  - `A0-ingress.yaml` - Ingress configuration for external access
  - `A1-frontend-deploy.yaml` - Frontend Deployment
  - `A2-frontend-svc.yaml` - Frontend Service
  - `B1-backend-deploy.yaml` - Backend Deployment
  - `B0-backend-svc.yaml` - Backend Service
  - `C0-db_secret.yaml` - Database credentials secret
  - `C1-db_svc.yaml` - Database Service
  - `C2-statfulset.yaml` - StatefulSet for the database
  - `App-Photos/` - Images documenting the project's work

## Prerequisites
- `minikube` installed (https://minikube.sigs.k8s.io/docs/start/)
- `kubectl` installed and configured (or use `minikube kubectl --`)

## Run on Minikube (quick steps)
1. Start Minikube:

   ```bash
   minikube start --memory=4096 --cpus=2
   ```

2. Enable the ingress addon (if you plan to use the ingress manifest):

   ```bash
   minikube addons enable ingress
   ```

3. Apply manifests in this order:

   ```bash
   kubectl apply -f C0-db_secret.yaml
   kubectl apply -f C1-db_svc.yaml
   kubectl apply -f C2-statfulset.yaml
   kubectl apply -f B0-backend-svc.yaml
   kubectl apply -f B1-backend-deploy.yaml
   kubectl apply -f A1-frontend-deploy.yaml
   kubectl apply -f A2-frontend-svc.yaml
   kubectl apply -f A0-ingress.yaml
   ```

4. Verify resources:

   ```bash
   kubectl get pods -A
   kubectl get svc -A
   kubectl get ingress -A
   ```

5. Access the application:
- If using a Service of type `NodePort`/`ClusterIP`, you can expose it via `minikube service`:

   ```bash
   minikube service list
   minikube service <frontend-service-name> --url
   ```

- If using the Ingress resource with a host (for example `digilians-app.com, api.digilians-app.com`), map the host to your Minikube IP in `/etc/hosts`:

   ```bash
   # get minikube ip
   minikube ip
   # then add a line in /etc/hosts, e.g. 192.168.49.2 digilians.local
   ```

6. Useful debug commands:

   ```bash
   kubectl logs deploy/<frontend-deployment-name>
   kubectl logs deploy/<backend-deployment-name>
   kubectl describe pod <pod-name>
   ```

## Notes and tips
- Adjust resource requests/limits in the manifests if Minikube has limited resources.
- Ensure the DB secret matches what the backend expects (check `C0-db_secret.yaml`).
- If pods fail to start, check events with `kubectl describe` and inspect container logs.
