---
layout: layout.pug
navigationTitle: Setup RBAC with Konvoy
title: Setup RBAC with Konvoy based Kubernetes clusters
menuWeight: 50
excerpt: Use RBAC to configure your Konvoy clusters
beta: false
enterprise: false
---

<!-- markdownlint-disable MD004 MD007 MD025 MD030 -->

You can use Role Based Access Controls (RBAC) to assign functionality roles to users accessing your cluster. This procedure shows how to setup a service account for a user on your Kubernetes based Konvoy clusters.

<p class="message--note"><strong>NOTE: </strong>This procedure assigns a default role. Refer to this <a href="https://kubernetes.io/docs/reference/access-authn-authz/rbac/">link</a> to set up other custom roles</p>

## Before you begin

You need certain software configurations and settings before you start this procedure. This procedure requires the following items and configurations:

- Konvoy 1.4 or [higher](../../install).

- Install and configure `kubectl` and [`kubectx`](https://github.com/ahmetb/kubectx).

- Access to a Kubernetes cluster with Authorization mode as `RBAC`. Refer to this [link](https://docs.d2iq.com/mesosphere/dcos/services/kubernetes/2.7.0-1.18.6/operations/authn-and-authz/#rbac) for information. (Also see the [Kubernetes](https://kubernetes.io/docs/reference/access-authn-authz/authorization/#authorization-modules) site)

- Vim or some other text editor.

1. Ensure you have admin access to a Kubernetes api-server, using the following commands:

    ```bash
    # Validate you can run kubectl against the api-server.
    kubectl get pods -n kube-system

    # Ensure you have admin access to the k8s cluster.
    kubectl config view
    ```

    The output from the commands should look like the following:

    ```bash
    [centos@ip-10-0-1-198 demo-cluster]$ kubectl config view
    apiVersion: v1
    clusters:
    - cluster:
        certificate-authority-data: DATA+OMITTED
        server: https://demo-cluster-9b1f-lb-control-46693284.us-west-2.elb.amazonaws.com:6443
      name: demo-cluster
    contexts:
    - context:
        cluster: demo-cluster
        user: demo-cluster-admin
      name: demo-cluster-admin@demo-cluster
    current-context: demo-cluster-admin@demo-cluster
    kind: Config
    preferences: {}
    users:
    - name: demo-cluster-admin
      user:
        client-certificate-data: REDACTED
        client-key-data: REDACTED
    ```

1. Provision a service account for an individual user. The following command uses John Smith as an example.

    ```bash
    kubectl create serviceaccount john-sa
    ```

    The output from the commands should look like the following:

    ```bash
    centos@ip-10-0-1-198 demo-cluster]$ kubectl create serviceaccount john-sa
    serviceaccount/john-sa created
    ```

1. Bind the service account to the roles, having the actions or permissions you want to assign. In this case we are binding user **John Smith** to an existing cluster role with edit permissions.

    ```bash
    kubectl create clusterrolebinding john-sa-binding --clusterrole=edit --serviceaccount=default:john-sa
    ```

    The output from the commands should look like the following:

    ```bash
    [centos@ip-10-0-1-198 demo-cluster]$ kubectl create clusterrolebinding john-sa-binding --clusterrole=edit --serviceaccount=default:john-sa
    clusterrolebinding.rbac.authorization.k8s.io/john-sa-binding created
    ```

    <p class="message--note"><strong>NOTE: </strong>When you create a Service Account, the Kubernetes api-server creates a token for the Service Account. You use this token to authenticate the Service Account to the api-server. You extract this token to access the cluster for external access.</p>

1. Verify secrets exist and retrieve the token, using the following command:

    ```bash
    kubectl get secrets
    ```

    The output from the command should look like the following:

    ```bash
    [centos@ip-10-0-1-198 demo-cluster]$ kubectl get secrets
    NAME                  TYPE                                  DATA   AGE
    default-token-x5nqv   kubernetes.io/service-account-token   3      38m
    john-sa-token-xbtpv   kubernetes.io/service-account-token   3      4m11s
    ```

1. Verify the token authenticates for the Service Account. Describe the secret, using your own secret name, using the following command:

    ```bash
    kubectl describe secret <secret-name>
    ```

    The output from the commands should look like the following:

    ```bash
    [centos@ip-10-0-1-198 demo-cluster]$ kubectl describe secret john-sa-token-xbtpv
    Name:         john-sa-token-xbtpv
    Namespace:    default
    Labels:       <none>
    Annotations:  kubernetes.io/service-account.name: john-sa
                  kubernetes.io/service-account.uid: 6a7a78bf-d347-485f-b715-d24b692f4fd1

    Type:  kubernetes.io/service-account-token

    Data
    ====
    ca.crt:     1025 bytes
    namespace:  7 bytes
    token:      eyJhbGciOiJSdY2NvdW50L3NlcnZpY2UtYWNjb3VudC5uYW1lIjoiam9obi1zYSIsImt1YmVybmV0ZXMuaW8vc2VydmljZWFjY291bnQvc2VydmljZS1hY2NvdW50LnVpZCI6IjZhN2E3OGJmLWQzNDctNDg1Zi1iNzE1LWQyNGI2OTJmNGZkMSIsInN1YiI6InN5c3RlbTpzZXJ2aWNlYW . . . [output snipped]
    ```

1. Add the token as an environment variable. Having it as an environment variable reduces copying and pasting token operations. Use the following command:

    ```bash
    export TOKEN=$(kubectl get secret <secret name> -o=jsonpath="{.data.token}" | base64 -d -i -)
    ```

1. Review your kubeconfig file. Notice the file defines 1 user and 1 cluster. Use the following command:

    ```bash
    cat ~/.kube/config
    ```

    The output from the command should look like the following:

    ```bash
    [centos@ip-10-0-1-198 demo-cluster]$ cat ~/.kube/config
    apiVersion: v1
    clusters:
    - cluster:
        certificate-authority-data: LS0tLS1CRUdJTiBbVFhZ2ovZU1XYz0KLS0tLS1FTkQgQ0VSVElGSUNBVEUtLS0tLQo= . . . [output snipped]
        server: https://demo-cluster-9b1f-lb-control-46693284.us-west-2.elb.amazonaws.com:6443
      name: demo-cluster
    contexts:
    - context:
        cluster: demo-cluster
        user: demo-cluster-admin
      name: demo-cluster-admin@demo-cluster
    current-context: demo-cluster-admin@demo-cluster
    kind: Config
    preferences: {}
    users:
    - name: demo-cluster-admin
      user:
        client-certificate-data: LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSUM4akNDBVEUtLS0tLQo= . . . [output snipped]
    ```

1. Back up your `config` file. The `config` file accesses and configures your Kubernetes clusters. Use the following command:

    ```bash
    cp ~/.kube/config ~/.kube/config.old
    ```

1. Edit your kubeconfig file and add the service accounts you included. Like the sample below, confirm the token section has your generated token. Add the new user **John Smith** and his context link to this same cluster. Use the following command:

    ```bash
    vim  ~/.kube/config
    ```

    The contents of the `config` file should look like the following:

    ```yaml
    apiVersion: v1
    clusters:
    - cluster:
        certificate-authority-data: LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSUN5RENDQWJDZ0F3SUJBZ0lCQURBTkJna3Foa2lHOXcwQkFRc0ZBREFWTVJNd0VRWURWUVFERXdwcmRXSmwKY201bGRHVnpNQjRYRFRJd01EY3dPVEl6TWpjd01Wb1hEVE13TURjd056SXpNamN3TVZvd0ZURVRNQkVHQTFVRQpBeE1LYTNWaVpYSnVaWFJsY3pDQ0FTSXdEUVlKS29aSWh2Y05BUUVCQlFBRGdnRVBBRENDQVFvQ2dnRUJBTFNUCm1Xdm0wQ2NhbEMyaEw1RGhUVkJvVjZPaGR3d3B6c1BxaUJVcWNmV0UvRzlqTWMzcFVZc1JSMWlNbU0ycWF2VWIKaHZ0VnUxcW1WMXFpK1dLMGRQeEhPOXRwOU5XTm5pYm41Q3MrNVAvN3U2cUhxemlNckNIbFZwYjkrekZhdnRQSgpzWlFINUFUK0YrSzdUYkNpaHNpcG1BczMwclpINFNMYUJXSDF6VzJnMkszaXBNbHMzM2hPS043dkJWNEdoYXNlCnlPbU9xMW1NVHFZak5aSE01Yk5IbXNjdjlIcVQ5YkF4cU9PdEhPVzYrZWtlNkhteU9VdHpVa3UvV3VkaC9XdUIKbTh4RWl2UVBSUHVNak5xR3Z5RlZQTkl0aVFnb0U4QUFXaE1JZENLUC9kT05PVzNZRXgzb1RrN3JkNXhqZy91VQpoRVRuSUVMMWY5cVhIT2pmZ1JjQ0F3RUFBYU1qTUNFd0RnWURWUjBQQVFIL0JBUURBZ0trTUE4R0ExVWRFd0VCCi93UUZNQU1CQWY4d0RRWUpLb1pJaHZjTkFRRUxCUUFEZ2dFQkFFV1ZKYnEzMkVVc1U2M0lTWUJUQndqd1NyakEKYnYzOFp0dHlpenZYei82SHA2L0picXVFRCtkd1FneEpmYkZVY2FHT1U4eUtEYnM3emtSTlAvV0c0Z0tRb2hCTApOam1IZVVFc1ZXZnFoNEZOOUs5Z1F4WG5NbXo2cTd2TUVOVzhuMGRIU1FHY2wxanJGTGdNN1Z1Q2RPL0dEVTNxCmVEYm5xb2g5NkNMWDZCNUhCRTRBMUw5TDE4RTBYMTl4aTR0bXZiTm5uUFE2UXY2OU4zVGVLRzRrVUx3Zis1M3QKMzFFc0xxMlI2Y3QzRFhBcTRJdSs4R1cxUTdDSVJjVUpZSmtja3Y2YlFkWVVnNUlrVVk3NzVjeEFZbVdMRlRXagpyTHNZa3BEbzVhYXFOQ1dpMG9jNlZFUlFvUmxuOVcwMDZaMk14Zi9TMnhMZnUyMzZ5bVFhZ2ovZU1XYz0KLS0tLS1FTkQgQ0VSVElGSUNBVEUtLS0tLQo=
        server: https://demo-cluster-9b1f-lb-control-46693284.us-west-2.elb.amazonaws.com:6443
      name: demo-cluster
    contexts:
    - context:
        cluster: demo-cluster
        user: demo-cluster-admin
      name: demo-cluster-admin@demo-cluster
    - context:
        cluster: demo-cluster
        user: john-sa
      name: john-sa@demo-cluster
    current-context: john-sa@demo-cluster
    kind: Config
    preferences: {}
    users:
    - name: demo-cluster-admin
      user:
        client-certificate-data: LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk. . . [output snipped]
        client-key-data: LS0tLS1CRUdJTiBSU0EgUFJJVkFURSBLRVktLS0tLQpNSUlFcFFJQkFBS0NBUUVBdUtzMl. . . [output snipped]
    - name: john-sa
      user:
        token: eyJhbGciOiJSUzI1NiIsImtpZCI6ImFvOXlMTUJvSUEzSjRCeG5BLTNvZk15anB. . . [output snipped]
    ```

    Another method to add the new user and his context links to the same cluster uses the following commands:

    ```bash
    kubectl config set-credentials john-sa --token=<token>
    ```

    then:

    ```bash
    kubectl config set-context john-sa@demo-cluster --cluster=demo-cluster --user=john-sa
    kubectl config use-context john-sa@demo-cluster
    ```

    This sample shows a different kubeconfig file that uses different kinds of authentication methods.

    ```yaml
    apiVersion: v1
    clusters:
    - cluster:
        certificate-authority: fake-ca-file
        server: https://1.2.3.4
      name: development
    - cluster:
        insecure-skip-tls-verify: true
        server: https://5.6.7.8
      name: scratch
    contexts:
    - context:
        cluster: development
        namespace: frontend
        user: developer
      name: dev-frontend
    - context:
        cluster: development
        namespace: storage
        user: developer
      name: dev-storage
    - context:
        cluster: scratch
        namespace: default
        user: experimenter
      name: exp-scratch
    current-context: ""
    kind: Config
    preferences: {}
    users:
    - name: developer
      user:
        client-certificate: fake-cert-file
        client-key: fake-key-file
    - name: experimenter
      user:
        password: some-password
        username: exp
    ```

1. After updating the kubeconfig file, confirm the list of contexts available. Use the following command:

    ```bash
    kubectx
    ```

    The output from the command should look like the following:

    ```bash
    [centos@ip-10-0-1-198 demo-cluster]$ kubectx
    demo-cluster-admin@demo-cluster
    john-sa@demo-cluster
    ```

1. Switch the context using `kubectx`. Use the following command:

    ```bash
    kubectx john-sa@demo-cluster
    ```

    Run the `kubectx` command again to confirm the use of **John Smith's** context.

    ```bash
    kubectx
    ```

    The output from the command should look like the following:

    ```bash
    [centos@ip-10-0-1-198 demo-cluster]$ kubectx
    demo-cluster-admin@demo-cluster
    john-sa@demo-cluster
    ```

1. Confirm you can query the resources. Use the following command:

    ```bash
    kubectl auth can-i get deployments

    kubectl get pods
    ```

1. Confirm you can use the token to make HTTP calls to the Kubernetes API. Use the following command:

    ```bash
    curl -H "Authorization: Bearer $TOKEN" https://api.cluster-address/api/v1/pods -k
    ```

## Related information

For information on related topics or procedures, refer to the following:

- [Kubernetes RBAC](https://kubernetes.io/docs/reference/access-authn-authz/rbac/)
