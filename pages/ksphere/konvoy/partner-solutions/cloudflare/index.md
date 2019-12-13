---
layout: layout.pug
navigationTitle: Cloudflare
title: Cloudflare
excerpt: Cloudflare Argo Tunnel
menuWeight: 20
category: Networking and Security
image: img/cloudflare.png
---

Argo Tunnel offers an easy way to expose your services securely to the internet, without opening up firewall ports and configuring ACLs. Argo Tunnel also ensures requests route through Cloudflare before reaching your service so you can be sure attack traffic is stopped with Cloudflare’s WAF and Unmetered DDoS mitigation and authenticated with Access if you’ve enabled those features for your account.


## quick start

The following shows two patterns on how to make your services available through the Cloudflare network using argo tunnel, sidecar and proxy. For each pattern we show how you can get started using `try Cloudflare` and how you use it with a `Cloudflare account`.

A Cloudflare account requires [signup](https://dash.cloudflare.com/sign-up) and you also need to `get argo smart traffic routing enabled`.


### using argo tunnel sidecar with tryCloudflare

The following is a pod with two containers, `nginx` the service, `argo-sidecar` the argo tunnel sidecar. Apply the pod using the following script.

```sh
cat <<EOF | kubectl apply -f -
apiVersion: v1
kind: Pod
metadata:
  name: nginx
spec:
  containers:
    - name: nginx
      image: nginx
      ports:
        - containerPort: 80
          name: web
    - name: argo-sidecar
      image: centos:7
      command: ["sh", "-c"]
      args:
        - curl -O https://bin.equinox.io/c/VdrWdbjqyF/cloudflared-stable-linux-amd64.tgz;
          tar -xzf cloudflared-stable-linux-amd64.tgz;
          ./cloudflared tunnel --url=http://localhost:80 --no-autoupdate;
EOF
```

Once the pod is running check its logs for the url that can be used to reach the service via the Cloudflare network.

```
kubectl logs nginx -c argo-sidecar

...
time="2019-07-02T01:39:47Z" level=info msg=+--------------------------------------------------+
time="2019-07-02T01:39:47Z" level=info msg="|  Your free tunnel has started! Visit it:         |"
time="2019-07-02T01:39:47Z" level=info msg="|    https://showed-fx-pal-tell.trycloudflare.com  |"
time="2019-07-02T01:39:47Z" level=info msg=+--------------------------------------------------+
...
```

### using argo tunnel sidecar with a Cloudflare account

In the following a secret is required. Install `cloudflared` and use it to log into your account to get an access certificate, details [here](https://developers.cloudflare.com/argo-tunnel/quickstart/) see `step 2 & 3`.

Next create a secret containing the certificate.
```
kubectl create secret generic example.com --from-file="$HOME/.cloudflared/cert.pem"
```

The following is a pod with two containers, `nginx` the service, `argo-sidecar` the argo tunnel sidecar.

Once you applied the pod you can reach the service at `https://hellp.example.com`.

```sh
cat <<EOF | kubectl apply -f -
apiVersion: v1
kind: Pod
metadata:
  name: nginx
spec:
  containers:
    - name: nginx
      image: nginx
      ports:
        - containerPort: 80
          name: web
    - name: argo-sidecar
      image: centos:7
      command: ["sh", "-c"]
      args:
        - curl -O https://bin.equinox.io/c/VdrWdbjqyF/cloudflared-stable-linux-amd64.tgz;
          tar -xzf cloudflared-stable-linux-amd64.tgz;
          ./cloudflared tunnel --url=http://localhost:80 --hostname=hello.example.com --origincert=/etc/cloudflared/cert.pem --no-autoupdate;
      volumeMounts:
        - mountPath: /etc/cloudflared
          name: tunnel-secret
          readOnly: true
  volumes:
    - name: tunnel-secret
      secret:
        secretName: example.com
EOF
```

## information

#### documentation

* [tryCloudflare](https://developers.cloudflare.com/argo-tunnel/trycloudflare/)
* [cloudflare argo tunnel](https://developers.cloudflare.com/argo-tunnel/quickstart/)
* [cloudflare argo tunnel sidecar](https://developers.cloudflare.com/argo-tunnel/reference/sidecar/)

#### release notes

* [cloudflare argo tunnel release notes](https://developers.cloudflare.com/argo-tunnel/release-notes/)

#### license

* [cloudflare argo tunne licensel](https://developers.cloudflare.com/argo-tunnel/license/)

#### maintenance & support

* [cloudflare support](https://support.cloudflare.com/hc/en-us)
