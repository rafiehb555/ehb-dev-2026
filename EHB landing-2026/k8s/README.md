# EHB Kubernetes baseline (current repo runtime)

kubectl apply -f k8s/

kubectl get pods
kubectl get services
kubectl get hpa

This set deploys current runnable units: web, dmo-realtime, worker, redis, postgres, mongo, prometheus, grafana.
