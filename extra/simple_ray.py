import ray

# Connect to your cluster
ray.init(address="ray://192.168.0.201:30001")


# Simple function
@ray.remote
def hello(name):
    return f"Hello {name} from Ray!"


# Run it
result = ray.get(hello.remote("homelab"))
print(result)

# Check cluster resources
print(f"Available CPUs: {ray.available_resources()['CPU']}")
print(f"Nodes in cluster: {len(ray.nodes())}")
