# Neon Branching for Kubernetes-based Preview Environments

## How it Works

This repository contains source code for a sample Next.js application. This
application can be developed locally, and then built into a container image
using GitHub Actions workflows.

Each pull request opened against the repository will trigger a container image
build, and will also result in a preview environment being created on a
development Kubernetes cluster. The preview environment creation is handled by
an [Argo CD ApplicationSet](https://argo-cd.readthedocs.io/en/stable/user-guide/application-set/)
and the manifests defined in [this manifest repository](https://github.com/evanshortiss/neon-kube-previews-manifests).
Once the build associated with a pull request is complete, it will comment on
the pull request with a link to the preview environment.

## Requirements

To run the GitHub Actions workflow, add the following secrets to your fork
of this repository using the **Settings > Secrets and variables > Actions**
screen:

* `DOCKERHUB_TOKEN` - A token with write access to a repository on Docker Hub.
* `DOCKERHUB_USERNAME` - The username that owns the `neon-kube-previews` repository that the container image will be written to.
* `NEON_API_KEY` - Found in the [Developer Settings](https://console.neon.tech/app/settings/api-keys) screen on the Neon console.
* `NEON_PROJECT_ID` - Found in *Settings > General* on the Neon project dashboard.
* `ARGOCD_HOSTNAME` - Strictly the hostname, e.g `argocd.foo.bar` without `https`.
* `ARGOCD_USERNAME` - A valid Argo CD username. You can can use `admin` if you're prototyping.
* `ARGOCD_PASSWORD` - The password associated with the given `ARGOCD_USERNAME`.
* `PREVIEW_SUBDOMAIN` - The subdomain that hosts preview environments, e.g `neon.ngrok.app`. This will be used to form a full preview environment URL, i.e `https://pr-1.${PREVIEW_SUBDOMAIN}`

If you're unfamiliar with how to add secrets to a GitHub repository, you can read more about in [GitHub's documentation](https://docs.github.com/en/actions/security-guides/encrypted-secrets).
