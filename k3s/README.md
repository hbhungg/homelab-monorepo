# Apps
```bash
kubectl apply -k .
```

# Ray compute
```bash
kubectl kustomize compute/ray-cluster --enable-helm | kubectl apply -f -
```
