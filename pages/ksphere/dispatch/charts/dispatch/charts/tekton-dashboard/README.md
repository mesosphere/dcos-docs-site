# Tekton Dashboard

Source repo for Tekton dashboard is https://github.com/tektoncd/dashboard (Refer https://github.com/tektoncd/dashboard/releases for yaml releases)

Refer the ingress yaml on how the endpoint is configured. Ensure a `/` is appended to the path. The tekton dashboard should be accessible at `<host>/tekton/` and its health endpoint is `<host>/tekton/health`