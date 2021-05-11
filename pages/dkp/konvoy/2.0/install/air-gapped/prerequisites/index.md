---
layout: layout.pug
navigationTitle: Prerequisites
title: Prerequisites
menuWeight: 10
excerpt: Air-gapped installation prerequisites
beta: true
enterprise: false
---

## Prerequisites

Before starting an air-gapped Konvoy installation, verify the following:

- You have a Linux machine (bastion) that has access to the existing VPC.
- You have the `konvoy2` binary on the bastion.
- You have [Docker][install_docker] version 18.09.2 or later installed on the bastion.
- You have [clusterawsadm][install_clusterawsadm] to generate base64 encoded AWS credentials on the bastion.
- You have [kubectl][install_kubectl] for interacting with the running cluster on the bastion.
- You have a valid AWS account with [credentials configured][aws_credentials].

### Configure AWS prerequisites

1.  Follow the steps in [IAM Policy Configuration](../../../iam-policies).

1.  Export the AWS region where to deploy the cluster:

   ```sh
   export AWS_REGION=us-west-2
   ```

1.  Export the AWS profile with the credentials that will be used to create the Kubernetes cluster:

    ```sh
    export AWS_PROFILE=<profile>
    ```

1.  Set the required environment variables:

    ```sh
    export AWS_B64ENCODED_CREDENTIALS=$(clusterawsadm bootstrap credentials encode-as-profile)
    ```

1.  If, at any time, you need to refresh the credentials used by the AWS provider, run the following:

    ```sh
    export AWS_B64ENCODED_CREDENTIALS=$(clusterawsadm bootstrap credentials encode-as-profile)
    kubectl -n capa-system patch secret capa-manager-bootstrap-credentials -p "{\"data\": {\"credentials\": \"${AWS_B64ENCODED_CREDENTIALS}\"}}"
    kubectl -n capa-system rollout restart deployment capa-controller-manager
    ```

[install_docker]: https://docs.docker.com/get-docker/
[install_clusterawsadm]: https://github.com/kubernetes-sigs/cluster-api-provider-aws/releases
[install_kubectl]: https://kubernetes.io/docs/tasks/tools/install-kubectl/
[aws_credentials]: https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-profiles.html
[capa]: https://github.com/kubernetes-sigs/cluster-api-provider-aws
