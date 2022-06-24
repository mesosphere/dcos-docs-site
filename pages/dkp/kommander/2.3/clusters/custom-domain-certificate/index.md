---
layout: layout.pug
navigationTitle: Custom domain and certificate
title: Configure a custom domain and certificate
menuWeight: 30
excerpt: Configure a custom domain and certificate for your Management or any Managed/Attached cluster
beta: false
enterprise: false
---

DKP supports configuring a custom domain name per cluster, so users can access the DKP UI and other platform services via that domain. Additionally, you can provide a custom certificate for the domain, or one can be issued automatically by Let's Encrypt, or other certificate authorities supporting the ACME protocol.

The configuration path is the same regardless of whether you are configuring a custom domain and certificate on the management, or a managed/attached cluster. However, you can choose to set up a customized domain and certificate for the management cluster during the installation of DKP.

[Customize a domain or certificate in the **Management Cluster**][management] (during installation).

[Customize a domain or certificate in the [**Management or a Managed/Attached Cluster**][managed] (after installation).

## Why to customize domains

DKP supports the customization of domains to allow you to use your own domain or hostname for your services.

For example, you can set up your DKP UI to be accessible with your custom domain name instead of the domain provided by default. You can also use your domain to enable your company to access back-end services, or your customers to access front-end services with a specific domain. Or you can configure a cluster to be accessible with a specific domain.

## Why to customize certificates

DKP’s default CA identity supports the encryption of data exchange and traffic (between your client and your environment’s server). To configure an additional security layer that validates your environment’s server authenticity, DKP supports configuring a custom certificate issued by a trusted Certificate Authority either directly in a Secret or managed automatically using the ACME protocol (for example, Let’s Encrypt).

Changing the default certificate for any of your clusters can be helpful, for example, you can adapt it to classify your DKP UI or any other type of service as trusted (when accessing a service via a browser).

<p class="message--note"><strong>NOTE: </strong>Let’s Encrypt and ACME do not work in air-gapped scenarios, as they require connection to the Internet for their setup. For air-gapped environments, you are able to use the certificates issued by the cluster (selfSigned, which is the default configuration), or a certificate created specifically for this purpose (which you can use so no browser warnings appear when calling up your URL).</p>

[management]: ../../install/configuration/custom-domain/
[managed]: ../custom-domain-certificate/managed/
