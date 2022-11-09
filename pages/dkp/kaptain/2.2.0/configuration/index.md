---
layout: layout.pug
navigationTitle: Configuration
title: Configuration
menuWeight: 10
excerpt: Configuration settings for Kaptain
enterprise: false
---
<!-- vale off -->
<!-- markdownlint-disable -->
[//]: # "WARNING: This page is auto-generated and should not be modified directly."

This page lists Kaptain configuration properties that can be adjusted during the initial installation or by updating the existing instance of Kaptain. These parameters are typically set in `values.yaml`.

### Kaptain Chart Values
| Key | Type | Default | Description |
|-----|------|---------|-------------|
| global.clusterDomainName | string | `"cluster.local"` | Kubernetes cluster domain name |
| global.userIdHeader | string | `"kubeflow-userid"` | Name of the HTTP header containing the information about authenticated user |
| global.userIdPrefix | string | `""` | Prefix for the 'userIdHeader' header value |
| global.workspace | string | `"kommander"` |  |
| ingress.enabled | bool | `true` | Enable ingress |
| ingress.externalDexClientId | string | `""` | Dex client ID to use when authenticating with external cluster |
| ingress.externalDexClientSecret | string | `""` | Dex client secret to use when authenticating with external cluster |
| ingress.oidcGroupsAllowList | string | `"*"` | List of groups that are allowed to pass authorization |
| ingress.oidcProviderEndpoint | string | `""` | External OIDC provider endpoint URL |
| ingress.oidcProviderBase64CaBundle | string | `""` | CA bundle of the OIDC provider endpoint URL encoded in base64 |
| ingress.kubeflowIngressGatewayServiceAnnotations | object | `{}` | Additional annotations for Kaptain's default gateway |
| ingress.customDomainName | string | `""` | Custom domain name used to access Kaptain, for example, kaptain.mycluster.company.com |
| ingress.base64CustomCertificate | string | `""` | base64-encoded contents of a custom certificate file (.crt) to use with the provided custom domain name |
| ingress.base64CustomCertificateKey | string | `""` | base64-encoded contents of a custom certificate private key file (.key) to use with the provided custom domain name |
| ingress.namespace | string | `"kaptain-ingress"` | Namespace to install Kaptain Ingress resources |
| ingress.kommanderTraefikCertificateName | string | `"kommander-traefik-tls"` | The name of the Kommander Traefik certificate |
| core.enabled | bool | `true` |  |
| core.namespace | string | `"kubeflow"` |  |
| core.notebook.defaultImage | string | `"mesosphere/kubeflow:2.1.0-jupyter-spark-3.3.0-tensorflow-2.9.1"` | Default image to use when creating a new notebook server |
| core.notebook.images[0] | string | `"mesosphere/kubeflow:2.1.0-jupyter-spark-3.3.0-tensorflow-2.9.1"` | JupyterLab with Tensorflow and Spark pre-installed |
| core.notebook.images[1] | string | `"mesosphere/kubeflow:2.1.0-jupyter-spark-3.3.0-tensorflow-2.9.1-gpu"` | JupyterLab with Tensorflow, CUDA and Spark pre-installed with GPU support |
| core.notebook.images[2] | string | `"mesosphere/kubeflow:2.1.0-jupyter-spark-3.3.0-pytorch-1.11.0"` | JupyterLab with Pytorch and Spark pre-installed |
| core.notebook.images[3] | string | `"mesosphere/kubeflow:2.1.0-jupyter-spark-3.3.0-pytorch-1.11.0-gpu"` | JupyterLab with Pytorch, CUDA and Spark pre-installed with GPU support |
| core.notebook.images[4] | string | `"mesosphere/kubeflow:2.1.0-jupyter-spark-3.3.0-mxnet-1.9.0"` | JupyterLab with MXNet and Spark pre-installed |
| core.notebook.images[5] | string | `"mesosphere/kubeflow:2.1.0-jupyter-spark-3.3.0-mxnet-1.9.0-gpu"` | JupyterLab with MXNet, CUDA and Spark pre-installed with GPU support |
| core.notebook.tolerationGroups | list | `[]` | Pod toleration group configurations for Notebook servers |
| core.notebook.affinityConfig | list | `[]` | Pod affinity configurations for Notebook servers |
| core.notebook.enableCulling | bool | `false` | Enables scale down idling notebooks to freeing up the allocated resources. |
| core.notebook.idleTimeMinutes | int | `1440` | Period of time a notebook can stay idle before it gets culled (scaled down) |
| core.notebook.cullingCheckPeriodMinutes | int | `1` | Notebook status check period |
| core.disableAntiAffinity | bool | `false` | Enables single-node installation. **DO NOT USE IN PRODUCTION ENVIRONMENTS!** Disabling anti-affinity allows installing Kaptain on a smaller number of nodes (less than 3) or on a single node. This installation mode must be used **for evaluation purposes only**. No data integrity guarantees in case of a hardware failure! |
| core.registrationFlow | bool | `false` | Enables automatic profile creation |
| core.tensorboardImage | string | `"mesosphere/kubeflow:2.1.0-tensorflow-2.9.1"` | Image to use for a Tensorboard in Kubeflow |
| core.dashboard.uriPathPrefix | string | `"/dashboard/"` |  |
| core.dashboard.prometheusPort | int | `9090` |  |
| core.dashboard.refreshIntervalSeconds | int | `10` |  |
| core.dashboard.gunicornWorkers | int | `3` |  |
| core.dashboard.gunicornThreads | int | `3` |  |
| core.dashboard.logLevel | string | `"debug"` |  |
| core.workflows.executorImage | string | `"gcr.io/ml-pipeline/argoexec:v3.3.8-license-compliance"` |  |
| core.workflows.containerRuntimeExecutor | string | `"emissary"` | Argo Workflows Executor |
| core.workflows.artifactRepository.bucket | string | `"mlpipeline"` | Bucket to store artifacts |
| core.workflows.artifactRepository.keyPrefix | string | <code>"artifacts/{{worklow.name}}/yyyy/mm/dd/{{pod.name}}"</code> | Bucket prefix |
| core.workflows.artifactRepository.endpoint | string | `"minio.kubeflow"` | S3-compatible storage endpoint |
| core.workflows.artifactRepository.insecure | bool | `true` | Disable SSL |
| core.workflows.artifactRepository.accessKeySecretName | string | `"minio-creds-secret"` |  |
| core.workflows.artifactRepository.accessKeySecretKey | string | `"accesskey"` |  |
| core.workflows.artifactRepository.secretKeySecretName | string | `"minio-creds-secret"` |  |
| core.workflows.artifactRepository.secretKeySecretKey | string | `"secretkey"` |  |
| core.db.user | string | `"cm9vdA=="` | MySQL Username |
| core.db.password | string | <hidden> | MySQL Password |
| core.db.port | int | `3306` | MySQL Port |
| core.db.host | string | `"kaptain-mysql-store-haproxy"` | MySQL Service name in the cluster |
| core.db.nodes.count | int | `3` | Number of MySQL nodes in the HA MySQL cluster |
| core.db.nodes.diskSize | string | `"30Gi"` | Disk size of a single database node in the MySQL cluster |
| core.db.nodes.memory | string | `"2G"` | Memory per single database node in the MySQL cluster |
| core.db.nodes.cpu | int | `2` | CPU per single database node in the MySQL cluster |
| core.db.proxy.count | int | `2` | Number of proxy instances for the HA MySQL cluster |
| core.db.proxy.memory | string | `"1G"` | Memory per single proxy instance in the MySQL cluster |
| core.db.proxy.cpu | int | `1` | CPU per single proxy instance in the MySQL cluster |
| core.db.backup.enabled | bool | `false` | Enables backup for the MySQL cluster |
| core.db.backup.bucket | string | `""` | Backup bucket name for the MySQL cluster |
| core.db.backup.region | string | `""` | Backup bucket region name for the MySQL cluster |
| core.db.backup.secretName | string | `""` | Name of the secret with access credentials for the MySQL cluster backup bucket |
| core.db.backup.endpointUrl | string | `""` | Custom endpoint URL for the MySQL cluster backup bucket |
| core.minio.serverPools | int | `1` | Number of MinIO server pools |
| core.minio.servers | int | `2` | Number of MinIO server pods to deploy in the pool |
| core.minio.volumesPerServer | int | `2` | Number of Persistent Volume Claims to generate for each MinIO server pod in the pool |
| core.minio.storageCapacity | string | `"40Gi"` | Total capacity of a single MinIO server pool |
| core.minio.volumeStorageClass | string | `""` | StorageClass name to be used for PVCs in MinIO server pool |
| core.pipelines.bucketName | string | `"mlpipeline"` |  |
| core.pipelines.cacheDb | string | `"cachedb"` |  |
| core.pipelines.dbConMaxLifeTimeSec | string | `"300s"` |  |
| core.pipelines.mlmdDB | string | `"metadb"` |  |
| core.pipelines.pipelineDB | string | `"mlpipeline"` |  |
| core.pipelines.defaultPipelineRunnerServiceAccount | string | `"default-editor"` |  |
| core.pipelines.objectStoreHost | string | `"minio"` |  |
| core.pipelines.objectStorePort | int | `80` |  |
| core.pipelines.workflowsTTLSecondsAfterFinish | int | `86400` | The TTL for Argo Workflow (a single run of a pipeline) to persist after completion (default: 24 hours) |
| core.pipelines.enableMultiUserSupport | bool | `true` | Enables multi-user support for Pipelines |
| core.mlflow.bucketName | string | `"mlpipeline"` |  |
| core.mlflow.bucketPrefix | string | `"mlflow"` |  |
| core.mlflow.objectStoreHost | string | `"minio"` |  |
| core.mlflow.objectStorePort | int | `80` |  |
| core.mlflow.objectStoreProtocol | string | `"http"` |  |
| core.mlflow.dbName | string | `"mlflow"` |  |
| kserve.enabled | bool | `true` | Enables KServe |
| kserve.namespace | string | `"kserve"` |  |
| kserve.agent.image | string | `"kserve/agent:v0.9.0"` |  |
| kserve.storage.image | string | `"mesosphere/kubeflow:storage-initializer-0.9.0-bf22216d"` |  |
| kserve.storage.s3.accessKeyIdName | string | `"awsAccessKeyID"` |  |
| kserve.storage.s3.secretAccessKeyName | string | `"awsSecretAccessKey"` |  |
| kserve.controller.deploymentMode | string | `"Serverless"` |  |
| kserve.controller.gateway.domain | string | `"example.com"` |  |
| kserve.controller.gateway.localGateway.gateway | string | `"cluster-local-gateway.knative-serving"` |  |
| kserve.controller.gateway.localGateway.gatewayService | string | `"cluster-local-gateway.istio-system.svc.cluster.local"` |  |
| kserve.controller.gateway.ingressGateway.gateway | string | `"knative-serving/knative-ingress-gateway"` |  |
| kserve.controller.gateway.ingressGateway.gatewayService | string | `"kaptain-ingress.kubeflow.svc.{{.Values.global.clusterDomainName}}"` |  |
| kserve.controller.image | string | `"kserve/kserve-controller:v0.9.0"` |  |
| kserve.controller.resources.limits.cpu | string | `"100m"` |  |
| kserve.controller.resources.limits.memory | string | `"300Mi"` |  |
| kserve.controller.resources.requests.cpu | string | `"100m"` |  |
| kserve.controller.resources.requests.memory | string | `"300Mi"` |  |
| kserve.servingruntime.modelNamePlaceholder | string | `"{{.Name}}"` |  |
| kserve.servingruntime.tensorflow.image | string | `"tensorflow/serving"` |  |
| kserve.servingruntime.tensorflow.tag | string | `"2.6.2"` |  |
| kserve.servingruntime.mlserver.image | string | `"docker.io/seldonio/mlserver"` |  |
| kserve.servingruntime.mlserver.tag | string | `"1.1.0"` |  |
| kserve.servingruntime.mlserver.modelClassPlaceholder | string | `"{{.Labels.modelClass}}"` |  |
| kserve.servingruntime.sklearnserver.image | string | `"kserve/sklearnserver"` |  |
| kserve.servingruntime.sklearnserver.tag | string | `"v0.9.0"` |  |
| kserve.servingruntime.xgbserver.image | string | `"kserve/xgbserver"` |  |
| kserve.servingruntime.xgbserver.tag | string | `"v0.9.0"` |  |
| kserve.servingruntime.tritonserver.image | string | `"nvcr.io/nvidia/tritonserver"` |  |
| kserve.servingruntime.tritonserver.tag | string | `"21.09-py3"` |  |
| kserve.servingruntime.pmmlserver.image | string | `"mesosphere/kubeflow"` |  |
| kserve.servingruntime.pmmlserver.tag | string | `"kserve-pmmlserver-v0.9.0-3994c63-cve-patch"` |  |
| kserve.servingruntime.paddleserver.image | string | `"mesosphere/kubeflow"` |  |
| kserve.servingruntime.paddleserver.tag | string | `"kserve-paddleserver-v0.9.0-3994c63-cve-patch"` |  |
| kserve.servingruntime.lgbserver.image | string | `"kserve/lgbserver"` |  |
| kserve.servingruntime.lgbserver.tag | string | `"v0.9.0"` |  |
| kserve.servingruntime.torchserve.image | string | `"pytorch/torchserve-kfs"` |  |
| kserve.servingruntime.torchserve.tag | string | `"0.6.0"` |  |
| kserve.servingruntime.torchserve.serviceEnvelopePlaceholder | string | `"{{.Labels.serviceEnvelope}}"` |  |
| kserve.servingruntime.alibi.image | string | `"mesosphere/kubeflow"` |  |
| kserve.servingruntime.alibi.defaultVersion | string | `"kserve-alibi-explainer-v0.9.0-5b00d22-cve-patch"` |  |
| kserve.servingruntime.art.image | string | `"mesosphere/kubeflow"` |  |
| kserve.servingruntime.art.defaultVersion | string | `"kserve-art-explainer-v0.9.0-5b00d22-cve-patch"` |  |

For a full list of attributed 3rd party software, see d2iq.com/legal/3rd
