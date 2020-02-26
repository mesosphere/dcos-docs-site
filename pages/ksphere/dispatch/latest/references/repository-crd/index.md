---
layout: layout.pug
navigationTitle:  Repository CRD
title: Repository CRD
menuWeight: 90
beta: false
excerpt: Reference Guide for Configuring a Repository
---


<p>Packages:</p>
<ul>
<li>
<a href="#dispatch.d2iq.io%2fv1alpha1">dispatch.d2iq.io/v1alpha1</a>
</li>
</ul>
<h2 id="dispatch.d2iq.io/v1alpha1">dispatch.d2iq.io/v1alpha1</h2>
<p>
<p>Package v1alpha1 contains API Schema definitions for the dispatch v1alpha1 API group</p>
</p>
Resource Types:
<ul></ul>
<h3 id="dispatch.d2iq.io/v1alpha1.FileRef">FileRef
</h3>
<p>
(<em>Appears on:</em>
<a href="#dispatch.d2iq.io/v1alpha1.RepositorySpec">RepositorySpec</a>)
</p>
<p>
</p>
<table>
<thead>
<tr>
<th>Field</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>
<code>path</code></br>
<em>
string
</em>
</td>
<td>
<p>The path to the file to fetch.</p>
</td>
</tr>
<tr>
<td>
<code>repository</code></br>
<em>
<a href="#dispatch.d2iq.io/v1alpha1.RepositoryRef">
RepositoryRef
</a>
</em>
</td>
<td>
<em>(Optional)</em>
<p>Override the repository if it is different than the Repository’s RepositoryRef.</p>
</td>
</tr>
<tr>
<td>
<code>revision</code></br>
<em>
string
</em>
</td>
<td>
<em>(Optional)</em>
<p>Override the revision instead of using the revision from the event.</p>
</td>
</tr>
</tbody>
</table>
<h3 id="dispatch.d2iq.io/v1alpha1.Repository">Repository
</h3>
<p>
<p>Repository represents an SCM repository webhook and indicates where to fetch a Dispatchfile from on events.</p>
</p>
<table>
<thead>
<tr>
<th>Field</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>
<code>metadata</code></br>
<em>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.13/#objectmeta-v1-meta">
Kubernetes meta/v1.ObjectMeta
</a>
</em>
</td>
<td>
<em>(Optional)</em>
Refer to the Kubernetes API documentation for the fields of the
<code>metadata</code> field.
</td>
</tr>
<tr>
<td>
<code>spec</code></br>
<em>
<a href="#dispatch.d2iq.io/v1alpha1.RepositorySpec">
RepositorySpec
</a>
</em>
</td>
<td>
<em>(Optional)</em>
<br/>
<br/>
<table>
<tr>
<td>
<code>RepositoryRef</code></br>
<em>
<a href="#dispatch.d2iq.io/v1alpha1.RepositoryRef">
RepositoryRef
</a>
</em>
</td>
<td>
<p>
(Members of <code>RepositoryRef</code> are embedded into this type.)
</p>
<p>The repository to configure the webhook for.</p>
</td>
</tr>
<tr>
<td>
<code>dispatchfile</code></br>
<em>
<a href="#dispatch.d2iq.io/v1alpha1.FileRef">
FileRef
</a>
</em>
</td>
<td>
<em>(Optional)</em>
<p>Override the default location to fetch the Dispatchfile from.</p>
</td>
</tr>
<tr>
<td>
<code>serviceAccount</code></br>
<em>
string
</em>
</td>
<td>
<p>The service account to use when creating pipelines.</p>
</td>
</tr>
<tr>
<td>
<code>baseUrl</code></br>
<em>
string
</em>
</td>
<td>
<em>(Optional)</em>
<p>The base URL to use when creating endpoint addresses.</p>
</td>
</tr>
<tr>
<td>
<code>endpoint</code></br>
<em>
string
</em>
</td>
<td>
<em>(Optional)</em>
<p>Set a fixed endpoint URL instead of letting the controller generate one.</p>
</td>
</tr>
<tr>
<td>
<code>webhookSecret</code></br>
<em>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.13/#secretkeyselector-v1-core">
Kubernetes core/v1.SecretKeySelector
</a>
</em>
</td>
<td>
<em>(Optional)</em>
<p>Set a fixed webhook secret token to use when creating webhooks. If the secret or key do not exist, then the controller will initialize the secret.</p>
</td>
</tr>
</table>
</td>
</tr>
<tr>
<td>
<code>status</code></br>
<em>
<a href="#dispatch.d2iq.io/v1alpha1.RepositoryStatus">
RepositoryStatus
</a>
</em>
</td>
<td>
<em>(Optional)</em>
</td>
</tr>
</tbody>
</table>
<h3 id="dispatch.d2iq.io/v1alpha1.RepositoryRef">RepositoryRef
</h3>
<p>
(<em>Appears on:</em>
<a href="#dispatch.d2iq.io/v1alpha1.FileRef">FileRef</a>, 
<a href="#dispatch.d2iq.io/v1alpha1.RepositorySpec">RepositorySpec</a>)
</p>
<p>
</p>
<table>
<thead>
<tr>
<th>Field</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>
<code>repository</code></br>
<em>
string
</em>
</td>
<td>
<p>Repository name, e.g., mesosphere/dispatch.</p>
</td>
</tr>
<tr>
<td>
<code>secret</code></br>
<em>
string
</em>
</td>
<td>
<em>(Optional)</em>
<p>Reference to the secret to use when interacting with the Git provider API.
The secret should contain the following fields:
username: the username (if password is not a token).
password: the password or token (required).
scm.provider.name: the name of the SCM provider (github, bitbucket, gitlab, gitea, gogs, stash, default: github)
scm.provider.url: the URL of the SCM provider (defaults to the default for the SCM provider)
The secret can be created with the <code>dispatch login git command</code>.</p>
</td>
</tr>
</tbody>
</table>
<h3 id="dispatch.d2iq.io/v1alpha1.RepositorySpec">RepositorySpec
</h3>
<p>
(<em>Appears on:</em>
<a href="#dispatch.d2iq.io/v1alpha1.Repository">Repository</a>)
</p>
<p>
<p>RepositorySpec defines the desired state of Repository</p>
</p>
<table>
<thead>
<tr>
<th>Field</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>
<code>RepositoryRef</code></br>
<em>
<a href="#dispatch.d2iq.io/v1alpha1.RepositoryRef">
RepositoryRef
</a>
</em>
</td>
<td>
<p>
(Members of <code>RepositoryRef</code> are embedded into this type.)
</p>
<p>The repository to configure the webhook for.</p>
</td>
</tr>
<tr>
<td>
<code>dispatchfile</code></br>
<em>
<a href="#dispatch.d2iq.io/v1alpha1.FileRef">
FileRef
</a>
</em>
</td>
<td>
<em>(Optional)</em>
<p>Override the default location from which to fetch the Dispatchfile.</p>
</td>
</tr>
<tr>
<td>
<code>serviceAccount</code></br>
<em>
string
</em>
</td>
<td>
<p>The service account to use when creating pipelines.</p>
</td>
</tr>
<tr>
<td>
<code>baseUrl</code></br>
<em>
string
</em>
</td>
<td>
<em>(Optional)</em>
<p>The base URL to use when creating endpoint addresses.</p>
</td>
</tr>
<tr>
<td>
<code>endpoint</code></br>
<em>
string
</em>
</td>
<td>
<em>(Optional)</em>
<p>Set a fixed endpoint URL instead of letting the controller generate one.</p>
</td>
</tr>
<tr>
<td>
<code>webhookSecret</code></br>
<em>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.13/#secretkeyselector-v1-core">
Kubernetes core/v1.SecretKeySelector
</a>
</em>
</td>
<td>
<em>(Optional)</em>
<p>Set a fixed webhook secret token to use when creating webhooks. If the secret or key do not exist, then the controller will initialize the secret.</p>
</td>
</tr>
</tbody>
</table>
<h3 id="dispatch.d2iq.io/v1alpha1.RepositoryStatus">RepositoryStatus
</h3>
<p>
(<em>Appears on:</em>
<a href="#dispatch.d2iq.io/v1alpha1.Repository">Repository</a>)
</p>
<p>
<p>RepositoryStatus defines the observed state of Repository</p>
</p>
<table>
<thead>
<tr>
<th>Field</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>
<code>webhookEndpointPath</code></br>
<em>
string
</em>
</td>
<td>
<em>(Optional)</em>
<p>The endpoint that was generated for the webhook (just the path portion of the URL).</p>
</td>
</tr>
<tr>
<td>
<code>webhookId</code></br>
<em>
string
</em>
</td>
<td>
<em>(Optional)</em>
<p>The webhook’s id as returned by the provider API (to detect if the webhook has changed since the secret was last set).</p>
</td>
</tr>
</tbody>
</table>
<hr/>
