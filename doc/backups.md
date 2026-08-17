# Backups

PVC data (and Postgres dumps) are pushed to **Backblaze B2** with restic.
Kubernetes manifests are **not** backed up here — they live in this git repo,
so recovery is `git clone` → `just deploy`.

## Components

| Path | Role |
|---|---|
| `infra/k8up/` | K8up operator + `Schedule` CRs (restic → B2 `b2:` backend) |
| `apps/postgres-backup/` | CronJob: `pg_dumpall` → restic → B2 |
| `infra/external-secrets/values.yaml` | Syncs `backblaze-b2` + `backup-repo` Secrets from Bitwarden |

## What gets backed up

- **paperless-ngx PVC** (`data-paperless-ngx-0`) via K8up. This is the bulk of
  restorable data (media/docs). The PVC is annotated `k8up.io/backup: "true"`.
- **Postgres** via a `pg_dumpall` CronJob → restic repo `b2:<bucket>:postgres`.
  We deliberately do **not** restic the live Postgres PVC — a filesystem
  snapshot of a running Postgres data dir is not crash-consistent.

## What is NOT backed up

- Redis (ephemeral cache), homepage, registry, wg-easy, noip, external-dns —
  stateless or config-in-git.
- The Postgres PVC and any other PVC — K8up runs with
  `skipWithoutAnnotation: true` (opt-in), so only annotated PVCs are touched.

## Secrets (Bitwarden Secrets Manager)

Add these to the homelab project (same one ESO already reads):

| Bitwarden secret | Used by |
|---|---|
| `B2_KEY_ID` | B2 keyID → `backblaze-b2` Secret |
| `B2_APPLICATION_KEY` | B2 application key → `backblaze-b2` Secret |
| `RESTIC_REPO_PASSWORD` | restic repo password → `backup-repo` Secret (`password` key) |

## Backblaze B2 setup (one-time, in the B2 UI)

1. Create a bucket, e.g. `homelab-backup-a1` (private, no file lock needed).
2. Create a **restricted App Key** scoped to that bucket (capabilities:
   read + write + list buckets). Note the keyID and appKey.
3. Put keyID → `B2_KEY_ID`, appKey → `B2_APPLICATION_KEY` in Bitwarden.
4. Generate a strong restic password → `RESTIC_REPO_PASSWORD` in Bitwarden.
5. Set `schedules.b2.bucket` in `infra/k8up/values.yaml` if your bucket name
   differs from `homelab-backup-a1` (also update `RESTIC_REPOSITORY` in
   `apps/postgres-backup/values.yaml` to match).

## First-time install

The k8up subchart ships its CRDs as templates, so the first install is
two-pass (CRDs before `Schedule` resources) — handled by `just bootstrap`:

```bash
just bootstrap     # installs everything, two-pass for ESO + k8up
```

After that, `just deploy-infra` / `just deploy-apps` are single-pass.

## Verify

```bash
# Secrets synced from Bitwarden?
kubectl get secret backblaze-b2 backup-repo

# K8up schedules
kubectl get schedule

# Backup jobs (after the schedule fires)
kubectl get jobs -l k8up.io/schedule-name
kubectl logs job/<backup-job-name> -c backup   # restic output
```

## Restore

Paperless PVC (restic → B2, into the existing PVC):
```bash
# Scale paperless down first, then create a Restore object in its namespace:
cat <<EOF | kubectl apply -f -
apiVersion: k8up.io/v1
kind: Restore
metadata:
  name: paperless-restore
spec:
  backend:
    b2:
      bucket: homelab-backup-a1
      path: paperless
      accountIDSecretRef:   { name: backblaze-b2, key: B2_KEY_ID }
      accountKeySecretRef:  { name: backblaze-b2, key: B2_APPLICATION_KEY }
    repoPasswordSecretRef:  { name: backup-repo, key: password }
  restoreMethod:
    folder:
      volumeMount:
        mountPath: /restore
EOF
```

Postgres (restic → B2, then load the dump):
```bash
# Fetch the latest dump back into a pod:
kubectl run pg-restore --rm -i --restart=Never --image=restic/restic \
  --env RESTIC_REPOSITORY=b2:homelab-backup-a1:postgres \
  --env B2_ACCOUNT_ID=$B2_KEY_ID --env B2_ACCOUNT_KEY=$B2_APPLICATION_KEY \
  --env RESTIC_PASSWORD=$RESTIC_REPO_PASSWORD \
  -- restic restore latest --target /tmp
# Then `psql -f /tmp/dump.sql` against the postgres service.
```
