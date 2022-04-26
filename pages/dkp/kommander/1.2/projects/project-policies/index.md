---
layout: layout.pug
beta: false
navigationTitle: Project Policies
title: Project Policies
menuWeight: 1
excerpt: Project Policies grant access to a specified Project Role for a specified group of people.
---

Project Policies grant access to a specified Project Role for a specified group of people.

Before you can create a Project Policy, ensure you have created a Group. A Kommander Group can contain one or several Identity Provider users and/or groups.

Then, you can assign a role to this Kommander Group:

![Project Policy Form](/dkp/kommander/1.2/img/project-edit-policy.png)
Project Policy Form

A Project Policy can also be created using kubectl:

```bash
cat << EOF | kubectl create -f -
apiVersion: workspaces.kommander.mesosphere.io/v1alpha1
kind: VirtualGroupProjectRoleBinding
metadata:
  generateName: projectpolicy-
  namespace: ${projectns}
spec:
  projectRoleRef:
    name: ${projectrole}
  virtualGroupRef:
    name: ${virtualgroup}
EOF
```

Ensure the projectns, projectrole and the virtualgroup variables are set before executing the command.

You can set them using the following commands (for a Kommander Group called user1 and a Project Role called admin, and after setting the projectns as explained in the previous section):

```bash
virtualgroup=$(kubectl -n kommander get virtualgroup.kommander.mesosphere.io -o jsonpath='{.items[?(@.metadata.generateName=="user1-")].metadata.name}')

projectrole=$(kubectl -n ${projectns} get projectroles.workspaces.kommander.mesosphere.io -o jsonpath='{.items[?(@.metadata.generateName=="admin-")].metadata.name}')
```

When a Project Policy is created, Kommander creates a Kubernetes FederatedRoleBinding on the Kubernetes cluster where Kommander is running:

```bash
$ kubectl -n ${projectns} get federatedrolebindings.types.kubefed.io projectpolicy-gtct4-rdkwq -o yaml
apiVersion: types.kubefed.io/v1beta1
kind: FederatedRoleBinding
metadata:
  creationTimestamp: "2020-06-04T16:19:27Z"
  finalizers:
  - kubefed.io/sync-controller
  generation: 1
  name: projectpolicy-gtct4-rdkwq
  namespace: project1-5ljs9-lhvjl
  ownerReferences:
  - apiVersion: workspaces.kommander.mesosphere.io/v1alpha1
    blockOwnerDeletion: true
    controller: true
    kind: VirtualGroupProjectRoleBinding
    name: projectpolicy-gtct4
    uid: 19614de2-4593-433e-82fa-96dc9470e07a
  resourceVersion: "196270"
  selfLink: /apis/types.kubefed.io/v1beta1/namespaces/project1-5ljs9-lhvjl/federatedrolebindings/projectpolicy-gtct4-rdkwq
  uid: beaffc29-edec-4258-9813-3a17ba27a2a6
spec:
  placement:
    clusterSelector: {}
  template:
    roleRef:
      apiGroup: rbac.authorization.k8s.io
      kind: Role
      name: admin-dbfpj-l6s9g
    subjects:
    - apiGroup: rbac.authorization.k8s.io
      kind: User
      name: user1@d2iq.lab
status:
  clusters:
  - name: konvoy-5nr5h
  conditions:
  - lastTransitionTime: "2020-06-04T16:19:27Z"
    lastUpdateTime: "2020-06-04T16:19:27Z"
    status: "True"
    type: Propagation
  observedGeneration: 1
Then, if you run the following command on a Kubernetes cluster associated with the Project, you’ll see a Kubernetes RoleBinding Object, in the corresponding namespace:
$ kubectl -n ${projectns} get rolebinding projectpolicy-gtct4-rdkwq -o yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  creationTimestamp: "2020-06-04T16:19:27Z"
  labels:
    kubefed.io/managed: "true"
  name: projectpolicy-gtct4-rdkwq
  namespace: project1-5ljs9-lhvjl
  resourceVersion: "125392"
  selfLink: /apis/rbac.authorization.k8s.io/v1/namespaces/project1-5ljs9-lhvjl/rolebindings/projectpolicy-gtct4-rdkwq
  uid: 2938398d-437b-4f3a-9cb9-c92e50139196
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: Role
  name: admin-dbfpj-l6s9g
subjects:
- apiGroup: rbac.authorization.k8s.io
  kind: User
  name: user1@d2iq.lab
```
