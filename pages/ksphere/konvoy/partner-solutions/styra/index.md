---
layout: layout.pug
navigationTitle: Styra
title: Styra
excerpt: Declarative Authorization Service for Kubernetes, built on Open Policy Agent.
menuWeight: 130
category: Networking and Security
image: img/styra.png
---
# Styra

Styra is the fastest and easiest way to put guardrails around your Kubernetes clusters--whether you’re a developer, an admin, or a bit of both.

* Need to limit which folks can access data, based on who is currently on call? Simple.
* Want to define which microservices can access particular streaming data? We got you.
* Have to prove compliance with regulations on your customer data? No sweat.

Built on open-source ([Open Policy Agent (OPA)](https://www.openpolicyagent.org/)), and declarative by design, Styra’s simple graphical library of customizable policies lets you easily mitigate risks, reduce human error, and accelerate development.


## Quick Start

### Access The Styra Control Plane

Contact Styra (<support@styra.com>) to get an account on the Styra SaaS Service. A dedicated tenant URL e.g., `https://<tenantID>.styra.com` along with credentials to login will be provided.

### Install The Open Policy Agent

In the following section, we will download some `yaml manifests` for installing `OPA`. Let's create a separate folder for those manifests.
```sh
mkdir opa-styra
cd opa-styra
```

Next create a new `System` in the `Styra control plane`. Systems are displayed on the left-hand side. To add a new one, click the `+` next to the word Systems on the left-hand side and fill in the following

* `System name`: a human-friendly name so you remember which cluster is which
* `Description`: more details about this cluster
* `Read-only`: set to true only if you want to stop people from editing policy in the GUI

You will then see the following 4 commands in the Styra control plane. The commands are generated specifically for the Styra system (representing your kubernetes cluster) you just created.

Add a label to `kube-system` that stops all admission control policies from being applied to that namespace.
```
kubectl label ns kube-system openpolicyagent.org/webhook=ignore
```

Download the `helm chart` that installs `OPA with kube-mgmt sidecar` and the `Styra datasource agent`.
```
curl -H 'Authorization: Bearer ...' -o styra-k8s-system.tgz -L 'http://.../assets/helm-chart'
```

Download the `helm values` for the chart.
```
curl -H 'Authorization: Bearer ...' -o values.json -L 'http://.../assets/helm-values'
```

Install the `OPA with kube-mgmt sidecar` and the `Styra datasource agent`.

```
helm install -n styra-system -f values.json styra-k8s-system.tgz
```

Once they both are installed you can check the `dashboard` for that new System in the `Styra control plane`.

### Create Your First Rule And See It In Action

The Styra control plane comes with a canned library with `best practices rules`. Go to the getting started document, `https://<tenantID>.styra.com/v1/docs/getting-started-k8s.html`, and learn how to add your first rule, see `section 3 - 6`.

### Delete The Open Policy Agent

Delete the `OPA with kube-mgmt sidecar` and the `Styra datasource agent`.

```sh
helm delete --purge styra-system
```


## Information

### Documentation

* Product documentation is available from within the control plane, at `https://<tenantID>.styra.com/v1/docs/`. Replace the `tenantID` with what you have received from Styra.

### Release Notes

* Release notes are available in the `Release Notes` section of the documentation.

### Licensing

* Contact <support@styra.com> to get an account and license.

### Maintenance & Support

* Contact <support@styra.com> for any issues or questions.
