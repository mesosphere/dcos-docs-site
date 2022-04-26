---
layout: layout.pug
navigationTitle: DKP 2.2.0 Release Notes
title: DKP 2.2 Release Notes
menuWeight: 10
excerpt: View release-specific information for DKP 2.2.0
enterprise: false
beta: false
---

**D2iQ&reg; Kommander&reg; (DKP&reg;) version 2.2 was released on April 8, 2022.**

[button color="purple" href="https://support.d2iq.com/hc/en-us/articles/4409215222932-Product-Downloads"]Download DKP[/button]

**Note:** In DKP 2.2 the Konvoy and Kommander binaries have been merged into a single binary, which you can find by selecting the DKP button above.

[Download](../../download/) and [install](../../install/) the latest version to get started.

<p class="message--note"><strong>NOTE: </strong>You must be a registered user and logged on to the support portal to download Kommander. New customers must contact their sales representative or <a href="mailto:sales@d2iq.com">sales@d2iq.com</a> before attempting to download or install this product.</p>

## Release summary

Welcome to D2iQ Kubernetes Platform (DKP) 2.2! This release provides new features and enhancements to improve the user experience, fix reported issues, integrate changes from previous releases, and maintain compatibility and support for other packages used in Konvoy. In this release, we are beginning the process of combining our two flagship products, Konvoy and Kommander, into a single DKP product with two service level options: DKP Enterprise for multi-cluster environments, and DKP Essential for single-cluster environments.

For this release, we are maintaining the documentation sets for individual platform components Konvoy and Kommander, while publishing some combined DKP documentation for processes, such as Upgrading DKP version.

DKP 2.2 supports Kubernetes versions between 1.21.0 and 1.22.x. Any cluster you want to attach using DKP 2.2 must be running a Kubernetes version in this range.

### Supported versions

| Kubernetes Support | Version |
| ------------------ | ------- |
|**Minimum** | 1.21.0 |
|**Maximum** | 1.22.x |
|**Default** | 1.22.0|

## New features and capabilities

The following features and capabilities are new for Version 2.2.

### Integrated DKP Upgrade

You can now upgrade Konvoy and Kommander as a single fluid process using a combination of the [DKP CLI](../../cli/dkp) and the UI to upgrade your environment.

For more information, see [DKP Upgrade](../../dkp-upgrade).

### Integration with VMware vSphere

You can use CAPI vSphere Provider while provisioning a [DKP cluster on vSphere](/dkp/konvoy/2.2/choose-infrastructure/vsphere/), which allows you to manage bootstrapping of VMs on a DKP cluster. This gives you improved productivity and speed of deploying VMs on DKP in a VMWare environment, including FIPS builds and air-gapped deployments.

### Zero downtime upgrades for air-gapped deployments

You can now use your laptop or USB drive to transfer pre-created air-gapped bundles, including OS dependencies and DKP binaries into your air-gapped environment with no external connectivity. This improves the availability of the DKP air-gapped deployment and productivity of your IT operations team.

For more information, see the [air-gapped bundle](../../install/air-gapped) documentation.

### Unified DKP user interfaces

The unified DKP user interface provides a smooth experience independent of where you start your journey. Both DKP Essential and DKP Enterprise customers will have similar experiences in the User Interface, with DKP Enterprise customers gaining access to additional features and benefits simply by entering their DKP Enterprise [license key](../../licensing/).

### DKP Insights

This new predictive analytics tool provides greater support productivity, speed, and reduced costs. The [DKP Insights](../../insights) Engine collects events and metrics on the Attached cluster, and uses rule-based heuristics on potential problems of varying criticality, so they can be quickly identified and resolved. These Insights are then forwarded and displayed in the DKP Insights Dashboard, where it assists you with routine tasks such as:

- Resolving common issues
- Monitoring resource usage
- Checking security issues
- Verifying workloads and clusters follow best practices

## Component updates

When upgrading to this release, the following services and service components are upgraded to the listed version:

| Platform Application | Version | Component Versions |
|--------------------- |---------|--------------------|
| cert-manager | 1.7.1 | - chart: 1.7.1<br>- cert-manager: 1.7.1 |
| dex | 2.9.14  | - chart: 2.9.14<br>- dex: 2.22.0 |
| external-dns | 6.1.8  | - chart: 6.1.8<br>- external-dns: 0.10.2 |
| fluent-bit | 0.19.20 | - chart: 0.19.20<br>- fluent-bit: 1.8.13 |
| gatekeeper | 3.7.0 | - chart: 3.7.0<br>- gatekeeper: 3.7.0 |
| grafana-logging | 6.22.0 | - chart: 6.22.0<br>- grafana: 8.3.6 |
| grafana-loki | 0.33.2 | - chart: 0.33.1<br>- loki: 2.2.1  |
| istio | 1.11.6 | - chart: 1.11.6<br>- istio: 1.11.5 |
| jaeger | 2.29.0  | - chart: 2.29.0<br>- jaeger: 1.31.0 |
| karma | 2.0.1 | - chart: 2.0.1<br>- karma: 0.88 |
| kiali | 1.47.0 | - chart: 1.47.0<br>- kiali: 1.47.0 |
| knative | 0.3.9 | - chart: 0.3.9<br>- knative: 0.22.3 |
| kube-oidc-proxy | 0.3.1 | - chart: 0.3.1<br>- kube-oidc-proxy: 0.3.0 |
| [kube-prometheus-stack][kube-prometheus-stack] | 33.1.5  | - chart: 33.1.5 <br>- prometheus-operator: 0.54.1<br>- prometheus: 2.33.4<br>- prometheus alertmanager: 0.23.0<br>- grafana: 8.3.6 |
| kubecost | 0.23.3 | - chart: 0.23.3<br>- cost-analyzer: 1.91.2 |
| kubefed | 0.9.1 | - chart: 0.9.1<br>- kubefed: 0.9.1 |
| kubernetes-dashboard | 5.1.1 | - chart: 5.1.1<br>- kubernetes-dashboard: 2.4.0 |
| kubetunnel | 0.0.11 | - chart: 0.0.11<br>- kubetunnel: 0.0.11 |
| logging-operator | 3.17.2 | - chart: 3.17.2<br>- logging-operator: 3.17.2 |
| minio-operator | 4.4.10 | - chart: 4.4.10<br>- minio: 4.4.10 |
| nfs-server-provisioner | 0.6.0 | - chart: 0.6.0<br>- nfs-provisioner: 2.3.0 |
| nvidia | 0.4.4 | - chart: 0.4.4<br>- nvidia-device-plugin: 0.9.0 |
| project-grafana-logging| 6.20.6 | - chart: 6.20.6<br>- grafana: 8.3.6 |
| project-grafana-loki | 0.33.2 | - chart: 0.33.1<br>- loki: 2.2.1 |
| project-logging | 1.0.0 |  |
| prometheus-adapter | 2.17.1 | - chart: 2.17.1<br>- prometheus-adapter: 0.9.1 |
| reloader | 0.0.104 | - chart: 0.0.104<br>- reloader: 0.0.104 |
| thanos | 0.4.6 | - chart: 0.4.6<br>- thanos: 0.9.0 |
| traefik | 10.9.1 | - chart: 10.9.1<br>- traefik: 2.5.6 |
| traefik-forward-auth | 0.3.6 | - chart: 0.3.6<br>- traefik-forward-auth: 3.1.0 |
| velero | 3.2.0 | - chart: 3.2.0<br>- velero: 1.5.2 |

## Known issues

### Overriding configuration for kube-oidc-proxy and traefik-forward-auth

Configuration overrides for kube-oidc-proxy and traefik-forward-auth platform applications must be manually applied for each cluster that requires custom configuration on top of the default configuration. Passing in the configuration via the CLI installer *will not work*. Instead, you must edit the cluster's custom configuration in the appropriate `FederatedConfigMap`'s `spec.overrides` list. For kube-oidc-proxy, the `FederatedConfigMap` is called `kube-oidc-proxy-overrides`, and for traefik-forward-auth, it is called `traefik-forward-auth-kommander-overrides`. See below for an example to override the kube-oidc-proxy configuration to use a custom domain `mycluster.domain.dom`:

```bash
kubectl edit federatedconfigmap kube-oidc-proxy-overrides -n kommander
```

Modify `oidc.issuerUrl` under the `values.yaml` key to override it for the `host-cluster` cluster:

```yaml
apiVersion: types.kubefed.io/v1beta1
kind: FederatedConfigMap
metadata:
  name: kube-oidc-proxy-overrides
  namespace: kommander
[...]
spec:
  overrides:
  - clusterName: host-cluster
    clusterOverrides:
    - op: add
      path: /data
      value:
        values.yaml: |
          initContainers: []
          oidc:
            caPEM: |
              <redacted>
            caSecretName: ""
            clientId: kube-apiserver
            clientSecret:
              value: <redacted>
            groupsClaim: groups
            groupsPrefix: 'oidc:'
            issuerUrl: mycluster.domain.dom/dex
            usernameClaim: email
[...]
```

### Spark operator failure workaround

Upgrading catalog applications using Spark Operator can fail when running `dkp upgrade catalogapp` due to the operator not starting. If this occurs, use the following workaround:

1.  Run the `dkp upgrade catalogapp` command.
1.  Monitor the failure of `spark-operator`.
1.  Get the workspace namespace name and export it.

    ```bash
    export WORKSPACE_NAMESPACE=<SPARK_OPERATOR_WS_NS>
    ```

1.  Export the spark-operator AppDeployment name.

    ```bash
    # e.g., this value can be spark-operator-1
    # if your spark-operator AppDeployment name doesn't contain "spark", you must adjust the grep command accordingly
    export SPARK_APPD_NAME=$(kubectl get appdeployment -n $WORKSPACE_NAMESPACE -o jsonpath='{range .items[*]} {.metadata.name}{"\n"}{end}' | grep spark)
    ```

1.  Export the service account name of your `spark-operator`.

    ```bash
    # if your provided values override, please look it up in that ConfigMap
    # this is the default value defined in spark-operator-1.1.6-d2iq-defaults ConfigMap
    export SPARK_OPERATOR_SERVICE_ACCOUNT=spark-operator-service-account
    ```

1.  Run the following command.

    ```yaml
    kubectl apply -f - <<EOF
    ---
    apiVersion: rbac.authorization.k8s.io/v1
    kind: ClusterRole
    metadata:
      name: spark-operator
      annotations:
        "helm.sh/hook": pre-install, pre-upgrade
        "helm.sh/hook-delete-policy": hook-failed, before-hook-creation
      labels:
        app.kubernetes.io/instance: spark-operator
        app.kubernetes.io/managed-by: Helm
        app.kubernetes.io/name: spark-operator
        app.kubernetes.io/version: v1beta2-1.3.3-3.1.1
        helm.sh/chart: spark-operator-1.1.17
        helm.toolkit.fluxcd.io/name: $SPARK_APPD_NAME
        helm.toolkit.fluxcd.io/namespace: $WORKSPACE_NAMESPACE
    rules:
    - apiGroups:
      - ""
      resources:
      - pods
      verbs:
      - "*"
    - apiGroups:
      - ""
      resources:
      - services
      - configmaps
      - secrets
      verbs:
      - create
      - get
      - delete
      - update
    - apiGroups:
      - extensions
      - networking.k8s.io
      resources:
      - ingresses
      verbs:
      - create
      - get
      - delete
    - apiGroups:
      - ""
      resources:
      - nodes
      verbs:
      - get
    - apiGroups:
      - ""
      resources:
      - events
      verbs:
      - create
      - update
      - patch
    - apiGroups:
      - ""
      resources:
      - resourcequotas
      verbs:
      - get
      - list
      - watch
    - apiGroups:
      - apiextensions.k8s.io
      resources:
      - customresourcedefinitions
      verbs:
      - create
      - get
      - update
      - delete
    - apiGroups:
      - admissionregistration.k8s.io
      resources:
      - mutatingwebhookconfigurations
      - validatingwebhookconfigurations
      verbs:
      - create
      - get
      - update
      - delete
    - apiGroups:
      - sparkoperator.k8s.io
      resources:
      - sparkapplications
      - sparkapplications/status
      - scheduledsparkapplications
      - scheduledsparkapplications/status
      verbs:
      - "*"
    - apiGroups:
      - batch
      resources:
      - jobs
      verbs:
      - delete
    ---
    apiVersion: rbac.authorization.k8s.io/v1
    kind: ClusterRoleBinding
    metadata:
      name: spark-operator
      annotations:
        "helm.sh/hook": pre-install, pre-upgrade
        "helm.sh/hook-delete-policy": hook-failed, before-hook-creation
      labels:
        app.kubernetes.io/instance: spark-operator
        app.kubernetes.io/managed-by: Helm
        app.kubernetes.io/name: spark-operator
        app.kubernetes.io/version: v1beta2-1.3.3-3.1.1
        helm.sh/chart: spark-operator-1.1.17
        helm.toolkit.fluxcd.io/name: $SPARK_APPD_NAME
        helm.toolkit.fluxcd.io/namespace: $WORKSPACE_NAMESPACE
    subjects:
    - kind: ServiceAccount
      name: $SPARK_OPERATOR_SERVICE_ACCOUNT
      namespace: $WORKSPACE_NAMESPACE
    roleRef:
      kind: ClusterRole
      name: spark-operator
      apiGroup: rbac.authorization.k8s.io
    ---
    apiVersion: v1
    kind: ServiceAccount
    metadata:
      annotations:
        helm.sh/hook: pre-install, pre-upgrade
        helm.sh/hook-delete-policy: hook-failed
      labels:
        app.kubernetes.io/instance: spark-operator
        app.kubernetes.io/managed-by: Helm
        app.kubernetes.io/name: spark-operator
        app.kubernetes.io/version: v1beta2-1.3.3-3.1.1
        helm.sh/chart: spark-operator-1.1.17
        helm.toolkit.fluxcd.io/name: $SPARK_APPD_NAME
        helm.toolkit.fluxcd.io/namespace: $WORKSPACE_NAMESPACE
      name: $SPARK_OPERATOR_SERVICE_ACCOUNT
      namespace: $WORKSPACE_NAMESPACE
    EOF
    ```

1.  If you want to force a pod recreation, you can delete the old pod in `CrashLoopBackoff` by running:

    ```bash
    # spark-operator is the default value
    # if you override the HelmRelease name in your override configmap, use that value in the following command 
    export SPARK_OPERATOR_RELEASE_NAME=spark-operator
    # only one instance of spark operator should be deployed per cluster
    kubectl delete pod -n $WORKSPACE_NAMESPACE $(kubectl get pod -l app.kubernetes.io/name=$SPARK_OPERATOR_RELEASE_NAME -n $WORKSPACE_NAMESPACE -o jsonpath='{range .items[0]}{.metadata.name}')
    ```

#### Default update strategy changed to "delete first" for Preprovisioned clusters

A "create first" update strategy first creates a new machine, then deletes the old one. While this strategy works when machine inventory can grow on demand, it does not work if there is a fixed number of machines. Most Preprovisioned clusters have a fixed number of machines. To enable updates for Preprovisioned clusters, DKP uses the "delete first" update strategy, which first deletes an old machine, then creates a new one.

New clusters use the "delete first" strategy by default. Existing clusters are switched to the "delete first" strategy whenever their machines are updated with `update controlplane` and `update nodepool`.

### Cert-manager expiration workaround

`cert-manager` renews all certificates 60 days after Kommander has been installed on your cluster. Unfortunately, some applications or pods fail to receive the renewed certificate information, causing them to break upon expiration (90 days after creation). As a result, your cluster stops running, and in some cases, you are unable to access the UI.

Proceed with the following instructions if you have configured an [ACME issuer type][acme], a [SelfSigned issuer type][selfsigned] (for example, in air-gapped environments), or are using a certificate you configured separately for your own institution.

To **prevent your applications from breaking**, or to **get them up and running again**, restart the corresponding pods and have the cert-manager create a new certificate. This forces the applications to reconcile and recognize the renewed certificate.

#### Extend CA duration

If you are relying on a self-signed kommander-ca, extend the lifespan of your Certification Authority (CA) before you restart your pods. By default, the validity period is set at 90d. Since cert-manager does not rotate CA bundles inside certificates, this can lead to broken chains of trust for newly issued certificates.

First, download the cert-manager client:

```bash
OS=linux; ARCH=amd64; curl -sSL -o cmctl.tar.gz https://github.com/cert-manager/cert-manager/releases/download/v1.7.2/cmctl-$OS-$ARCH.tar.gz
tar xzf cmctl.tar.gz
```

Then, modify the default value for the kommander-ca certification authority. The authority is responsible to sign all the kommander related certificates and should remain valid for an extended time to sign kommander certificates:

```bash
kubectl patch certificate -n cert-manager kommander-ca --type json --patch '[{ "op": "replace", "path": "/spec/duration", "value": "87600h0m0s" }]'
./cmctl renew -n cert-manager kommander-ca
```

The new lifespan will be 87600h0m0s corresponding to a 10 years validity.

Now, renew all the certificates to be signed by the new Certification Authority:

```bash
cat << EOF > renew-certs.sh
#!/bin/bash
kubectl patch certificate -n cert-manager kommander-ca --type json --patch '[{ "op": "replace", "path": "/spec/duration", "value": "87600h0m0s" }]'
./cmctl renew -n cert-manager kommander-ca
namespaces=\$(kubectl get ns -o custom-columns=NAME:.metadata.name --no-headers)
while IFS= read -r namespace; do
    certificates=\$(kubectl get certificates -n \$namespace -o custom-columns=NAME:.metadata.name --no-headers)
    while IFS= read -r cert; do
        signer=\$(kubectl get certificate -n \$namespace \$cert -o go-template='{{.spec.issuerRef.name}}')
        secret_name=\$(kubectl get certificate -n \$namespace \$cert -o go-template='{{.spec.secretName}}')
        # Workaround for the dex secret collisions

        if [[ \$signer =  "kommander-ca" ]]; then
            kubectl patch secret \$secret_name -n \$namespace --type json --patch '[{ "op": "replace", "path": "/data/ca.crt", "value": "'\$(kubectl get secret -n cert-manager kommander-ca -o go-template='{{index .data "ca.crt"}}')'" }]'
            ./cmctl renew -n \$namespace \$cert
        fi

    done <<< "\$certificates"
done <<< "\$namespaces"
EOF

chmod +x renew-certs.sh
./renew-certs.sh
```

Your cert-manager will renew your certificates successfully after 60 days, but the pods will use the previous certificates until day 90, so **you will have to restart your cluster anytime between days 60 and 90** after Kommander has been installed on your cluster (which usually coincides with the date you created your cluster), or after the last time you restarted your cluster.

#### Restart your pods

1.  Ensure that your DKP configuration references the correct cluster. You can do this by setting the KUBECONFIG environment variable, or using the `--kubeconfig` flag, [in accordance with Kubernetes conventions][config_kub].

1.  Ensure the certificate issuance is working properly:

    ```bash
    kubectl get certificates.cert-manager.io -A -o wide
    ```

    The output should look similar to this:

    ```sh
    NAMESPACE                     NAME                                        READY   SECRET                                   ISSUER                                 STATUS                                          AGE
    cert-manager                  kommander-ca                                True    kommander-ca                             selfsigned-issuer                      Certificate is up to date and has not expired   3h9m
    kommander-default-workspace   kommander-karma-server-tls-cert             True    kommander-karma-server-tls               kommander-ca                           Certificate is up to date and has not expired   161m
    kommander-default-workspace   kommander-kubecost-thanos-server-tls-cert   True    kommander-kubecost-thanos-server-tls     kommander-ca                           Certificate is up to date and has not expired   161m
    kommander-default-workspace   kommander-thanos-server-tls-cert            True    kommander-thanos-server-tls              kommander-ca                           Certificate is up to date and has not expired   161m
    kommander                     dex                                         True    dex                                      kommander-ca                           Certificate is up to date and has not expired   165m
    kommander                     dex-dex-controller-webhook-serving-cert     True    webhook-server-cert                      dex-dex-controller-selfsigned-issuer   Certificate is up to date and has not expired   165m
    kommander                     git-tls                                     True    git-tls                                  kommander-ca                           Certificate is up to date and has not expired   172m
    kommander                     kommander-authorizedlister-tls              True    kommander-authorizedlister-tls           kommander-ca                           Certificate is up to date and has not expired   163m
    kommander                     kommander-gatekeeper-ca                     True    kommander-gatekeeper-ca                  kommander-gatekeeper-selfsign          Certificate is up to date and has not expired   167m
    kommander                     kommander-gatekeeper-webhook-tls            True    gatekeeper-webhook-server-cert           kommander-gatekeeper-ca                Certificate is up to date and has not expired   167m
    kommander                     kommander-karma-server-tls-cert             True    kommander-karma-server-tls               kommander-ca                           Certificate is up to date and has not expired   161m
    kommander                     kommander-kubecost-thanos-server-tls-cert   True    kommander-kubecost-thanos-server-tls     kommander-ca                           Certificate is up to date and has not expired   161m
    kommander                     kommander-licensing-webhook-tls             True    kommander-licensing-webhook-tls          kommander-ca                           Certificate is up to date and has not expired   163m
    kommander                     kommander-thanos-server-tls-cert            True    kommander-thanos-server-tls              kommander-ca                           Certificate is up to date and has not expired   161m
    kommander                     kommander-traefik                           True    kommander-traefik-certificate            kommander-ca                           Certificate is up to date and has not expired   172m
    kommander                     kommander-webhook-tls                       True    kommander-webhook-tls                    kommander-ca                           Certificate is up to date and has not expired   163m
    kommander                     kubetunnel-webhook-tls                      True    kubetunnel-webhook-tls                   tunnel                                 Certificate is up to date and has not expired   165m
    kube-federation-system        kubefed-certificate                         True    kubefed-admission-webhook-serving-cert   kubefed-issuer                         Certificate is up to date and has not expired   165m
    kube-federation-system        kubefed-root-certificate                    True    kubefed-root-ca                          kubefed-ca-issuer                      Certificate is up to date and has not expired   165m
    ```

1.  Create the following CronJob to monthly restart pods, letting them reload their new certificate:

    ```bash
kubectl apply -f - <<EOF
---
apiVersion: v1
kind: ServiceAccount
metadata:
  name: rotate-certificates
  namespace: kommander
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: rotate-certificates 
  namespace: kommander
rules:
  - apiGroups:
    - cert-manager.io
    resources:
    - certificates
    verbs:
    - get
    - list
    - watch
    - update
  - apiGroups:
    - apps
    resources:
    - deployments
    verbs:
    - patch
    - get 
    - list
    - watch
  - apiGroups:
    - ""
    resources:
    - pods
    verbs:
    - create
    - update
    - get 
    - list
    - watch   
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: rotate-certificates
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: rotate-certificates
subjects:
- kind: ServiceAccount
  name: rotate-certificates
  namespace: kommander
---
apiVersion: batch/v1
kind: CronJob
metadata:
  name: rotate-certificates
  namespace: kommander
spec:
  schedule: "0 0 1 * *"
  jobTemplate:
    spec:
      activeDeadlineSeconds: 300
      backoffLimit: 6
      completions: 1
      parallelism: 1
      template:
        spec:
          restartPolicy: "OnFailure"
          containers:
          - command:
            - /bin/bash
            - -exc
            - |
              deploymentsKommander="kommander-cm kommander-traefik dex dex-dex-controller kommander-licensing-cm kube-oidc-proxy traefik-forward-auth-mgmt kommander-webhook dex-k8s-authenticator kubetunnel-webhook traefik-forward-auth"
              for deployment in $deploymentsKommander; do
                  kubectl rollout restart deployment -n kommander $deployment
              done
              kubectl rollout restart statefulset -n kommander gitea
              kubectl rollout restart deployment -n kube-federation-system kubefed-admission-webhook
            image: bitnami/kubectl:1.21.3
            imagePullPolicy: IfNotPresent
            name: main
          securityContext:
            fsGroup: 65534
            runAsUser: 65534
          serviceAccount: rotate-certificates 
EOF
```

    Now you must fix the certificate issues with the Gitrepository by committing the updated secret to Git.

1.  Clone the management repository:

    ```bash
    kubectl -n kommander get secret kommander-traefik-certificate -o go-template='{{index .data "ca.crt"|base64decode}}' > ca.crt && git clone -c http.sslCAInfo=$(pwd)/ca.crt https://$(kubectl -n kommander get secret admin-git-crede
    ntials -o go-template='{{.data.username|base64decode}}:{{.data.password|base64decode}}')@$((kubectl -n kommander get cm konvoyconfig-kubeaddons -o go-template='{{if ne .data.clusterHostname ""}}{{.data.clusterHostname}}{{"\n"}}{{end}}' &&
    kubectl -n kommander get ingress gitea -o jsonpath="{.status.loadBalancer.ingress[0]['ip','hostname']}") | head -1)/dkp/kommander/git/kommander/kommander
    ```

1.  Change into the directory containing the credentials manifest: `kommander/shared/kommander-git-repository`

1.  Update the manifest file with what is stored in the cluster:

    ```bash
    kubectl -n kommander-flux get secret kommander-git-credentials -o yaml > git-credentials.yaml
    ```

1.  Delete the following fields from the `git-credentials.yaml` file:

    - metadata.labels
    - metadata.resourceVersion
    - metadata.uid
    - type

1.  Replace the content of the field "data.ca" file with the output of this command:

    ```bash
    kubectl -n kommander get secret git-tls -o jsonpath='{.data.ca\.crt}'
    # Example Output
LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSUJiekNDQVJXZ0F3SUJBZ0lSQUlwSTRRWUY0QmZSRzNZUUxqUkFNQWt3Q2dZSUtvWkl6ajBFQXdJd0Z6RVYKTUJNR0ExVUVBeE1NYTI5dGJXRnVaR1Z5TFdOaE1CNFhEVEl5TURReU5qRXlORGN5TVZvWERUTXlNRFF5TXpFeQpORGN5TVZvd0Z6RVZNQk1HQTFVRUF4TU1hMjl0YldGdVpHVnlMV05oTUZrd0V3WUhLb1pJemowQ0FRWUlLb1pJCnpqMERBUWNEUWdBRTRWWE9Ka1VJNXlkNm9BVTFDYnQySEEzZ2xnUFlpYkl1OXNmQTgvMTFDckNnandtZFE3Ym8KbzNIQUdEOE9vZlU5VnlvZWIzQzJiZ2UxbWlmeUxXK013S05DTUVBd0RnWURWUjBQQVFIL0JBUURBZ0trTUE4RwpBMVVkRXdFQi93UUZNQU1CQWY4d0hRWURWUjBPQkJZRUZPVFB0NlJzSlhNMEIxTEJZWjA3RXltLzZ2MjVNQW9HCkNDcUdTTTQ5QkFNQ0EwZ0FNRVVDSUZnWjRmYi80VWtNYVNyTWRzY0M5QTVCa2Y4MkdhQm1qMDRYS2ZWM2Zya24KQWlFQTRqNHNtc3psTGZpUHd2NGpSSHkxa010ZTZnY0V2ME81emdhdVljaU96dk09Ci0tLS0tRU5EIENFUlRJRklDQVRFLS0tLS0K 
    ```

<!-- Can we get an example output -->
1.  Encrypt the file again:

    ```bash
    sops --age=$(k -n kommander get secret sops-age -o jsonpath='{.data.age\.agekey}'|base64 -d|age-keygen -y) --encrypt --encrypted-regex '^(data|stringData)$' --in-place git-credentials.yaml
    ```

1.  Commit and push the updated file:

    ```bash
    git add git-credentials.yaml
    git commit -m 'update git credentials'
    git push
    ```

1.  Patch the secret temporarily (since Flux is not able to clone the repository):

    ```bash
    kubectl patch secret -n kommander-flux kommander-git-credentials --type='json' -p="[{\"op\": \"replace\", \"path\": \"/data/caFile\", \"value\": \"$(kubectl -n kommander get secret git-tls -o jsonpath='{.data.ca\.crt}')\"}]"
    ```

1.  Optional: Force reconciliation of the updated Git repository for quicker results:

    ```bash
    flux -n kommander-flux reconcile source git management
    ```

    Flux should be able to connect to the Git server again.

1.  Set yourself a reminder to repeat this process in days 60 to 90 after you have restarted the affected pods.

## Additional resources

For more information about working with native Kubernetes, see the [Kubernetes documentation][kubernetes-doc].

[kube-prometheus-stack]: https://github.com/prometheus-community/helm-charts/tree/main/charts/kube-prometheus-stack
[kubernetes-doc]: https://kubernetes.io/docs/home/
[config_kub]: https://kubernetes.io/docs/tasks/access-application-cluster/configure-access-multiple-clusters/
[acme]: https://cert-manager.io/docs/configuration/acme/

[selfsigned]: https://cert-manager.io/docs/configuration/selfsigned/
