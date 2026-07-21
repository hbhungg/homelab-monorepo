{{/*
Shared pod spec for Deployments and StatefulSets.
Usage: {{ include "homelab.podSpec" (dict "key" $key "app" $app) | nindent 6 }}

Structured fields (affinity, tolerations, resources, env, envFrom, volumes,
volumeMounts, securityContext, probes) are passed through verbatim from
values.yaml, so anything valid in a Kubernetes pod spec is valid there.
*/}}
{{- define "homelab.podSpec" -}}
{{- $key := .key }}
{{- $app := .app }}
{{- if $app.hostNetwork }}
hostNetwork: true
dnsPolicy: ClusterFirstWithHostNet
{{- end }}
{{- with $app.serviceAccountName }}
serviceAccountName: {{ . }}
{{- end }}
{{- with $app.podSecurityContext }}
securityContext:
  {{- toYaml . | nindent 2 }}
{{- end }}
{{- with $app.affinity }}
affinity:
  {{- toYaml . | nindent 2 }}
{{- end }}
{{- with $app.tolerations }}
tolerations:
  {{- toYaml . | nindent 2 }}
{{- end }}
{{- with $app.initContainers }}
initContainers:
  {{- toYaml . | nindent 2 }}
{{- end }}
containers:
  - name: {{ $key }}
    image: "{{ $app.image.repository }}:{{ $app.image.tag }}"
    {{- with $app.image.imagePullPolicy }}
    imagePullPolicy: {{ . }}
    {{- end }}
    {{- with $app.command }}
    command:
      {{- toYaml . | nindent 6 }}
    {{- end }}
    {{- with $app.args }}
    args:
      {{- toYaml . | nindent 6 }}
    {{- end }}
    {{- with $app.ports }}
    ports:
      {{- range . }}
      - name: {{ .name }}
        containerPort: {{ .containerPort }}
        protocol: {{ .protocol | default "TCP" }}
        {{- with .hostPort }}
        hostPort: {{ . }}
        {{- end }}
      {{- end }}
    {{- end }}
    {{- with $app.env }}
    env:
      {{- range . }}
      - name: {{ .name }}
        {{- if .valueFrom }}
        valueFrom:
          {{- toYaml .valueFrom | nindent 10 }}
        {{- else }}
        value: {{ .value | quote }}
        {{- end }}
      {{- end }}
    {{- end }}
    {{- with $app.envFrom }}
    envFrom:
      {{- toYaml . | nindent 6 }}
    {{- end }}
    {{- with $app.resources }}
    resources:
      {{- toYaml . | nindent 6 }}
    {{- end }}
    {{- with $app.securityContext }}
    securityContext:
      {{- toYaml . | nindent 6 }}
    {{- end }}
    {{- with $app.livenessProbe }}
    livenessProbe:
      {{- toYaml . | nindent 6 }}
    {{- end }}
    {{- with $app.readinessProbe }}
    readinessProbe:
      {{- toYaml . | nindent 6 }}
    {{- end }}
    {{- if or $app.volumeMounts (and $app.persistence $app.persistence.enabled) }}
    volumeMounts:
      {{- with $app.volumeMounts }}
      {{- toYaml . | nindent 6 }}
      {{- end }}
      {{- if and $app.persistence $app.persistence.enabled }}
      - name: data
        mountPath: {{ $app.persistence.mountPath }}
      {{- end }}
    {{- end }}
{{- /* Stateful apps get their "data" volume from volumeClaimTemplates instead */}}
{{- $pvcVolume := and $app.persistence $app.persistence.enabled (not $app.stateful) }}
{{- if or $app.volumes $pvcVolume }}
volumes:
  {{- with $app.volumes }}
  {{- toYaml . | nindent 2 }}
  {{- end }}
  {{- if $pvcVolume }}
  - name: data
    persistentVolumeClaim:
      claimName: {{ $key }}-data
  {{- end }}
{{- end }}
{{- end }}

{{/*
Pod template annotations: roll pods when their chart-managed ConfigMap changes.
*/}}
{{- define "homelab.podAnnotations" -}}
{{- with .app.configMap }}
annotations:
  checksum/config: {{ . | toYaml | sha256sum }}
{{- end }}
{{- end }}
