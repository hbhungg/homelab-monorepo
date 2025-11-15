import ray

ray.init(address="ray://192.168.0.201:30001")

@ray.remote
def compute_pi_chunk(n):
    import random
    inside = sum(1 for _ in range(n) if random.random()**2 + random.random()**2 <= 1)
    return inside

@ray.remote
def gather_and_compute(futures):
    results = ray.get(futures)
    return 4 * sum(results) / (50 * 1_000_000)

# Spread: 50 tasks across cluster
futures = [compute_pi_chunk.remote(1_000_000) for _ in range(50)]

# Gather: combine results remotely on cluster
pi = ray.get(gather_and_compute.remote(futures))
print(f"Estimated π from 50M samples (all remote): {pi}")