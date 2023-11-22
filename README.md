# Neon Branching for Kubernetes-based Preview Environments

This repository contains source code for a sample Next.js application that's
used in conjunction with a [set of Kubernetes manifests](https://github.com/neondatabase/kube-previews-manifests).
These work in tandem with Neon's branching feature to create unique preview
environments, each with their own unique serverless Postgres database.

## How Preview Environments Work

1. Each PR opened against the repository will trigger workflow that:
    * Builds the Next.js application into a container image.
    * Creates a Neon branch to use in the preview environment.
1. An Argo CD [Argo CD ApplicationSet](https://github.com/neondatabase/kube-previews-manifests/blob/main/kind-cluster/application-set.yaml) will detect the PR and create a namespace on your Kubernetes cluster to deploy the new container image.
1. Once the workflow associated with a pull request is complete it will:
    * Update the Argo-managed preview environment with the Neon branch Postgres connection string and container image tag.
    * Comment on the pull request with a link to the preview environment.

## Requirements

A Kubernetes cluster is required to run this sample. The [manifests repository](https://github.com/neondatabase/kube-previews-manifests)
contains instructions and a script to configure a local Kubernetes environment
and Argo CD instance.

To run the GitHub Actions workflow, add the following secrets to your fork
of this repository using the **Settings > Secrets and variables > Actions**
screen:

* `DOCKERHUB_TOKEN` - A token with write access to a repository on Docker Hub. Created from the [Account Settings / Security](https://hub.docker.com/settings/security) page on Docker Hub.
* `DOCKERHUB_USERNAME` - The username that owns the `neon-kube-previews` repository that the container image will be written to.
* `NEON_API_KEY` - Found in the [Developer Settings](https://console.neon.tech/app/settings/api-keys) screen on the Neon console.
* `NEON_PROJECT_ID` - Found in *Settings > General* on the Neon project dashboard.
* `ARGOCD_HOSTNAME` - Strictly the hostname, e.g `argocd.foo.bar` without `https`.
* `ARGOCD_USERNAME` - A valid Argo CD username. You can can use `admin` if you're prototyping.
* `ARGOCD_PASSWORD` - The password associated with the given `ARGOCD_USERNAME`.
* `PREVIEW_SUBDOMAIN` - The subdomain that hosts preview environments, e.g `neon.ngrok.app`. This will be used to form a full preview environment URL, i.e `https://pr-1.${PREVIEW_SUBDOMAIN}`

_Note: Feel free to replace Docker Hub with [Quay.io](https://quay.io/) or your preferred container registry in the GitHub Actions workflow._

If you're unfamiliar with how to add secrets to a GitHub repository, you
can learn more in [GitHub's documentation](https://docs.github.com/en/actions/security-guides/encrypted-secrets).
