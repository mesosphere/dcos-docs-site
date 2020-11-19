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
<p>Package v1alpha1 contains API Schema definitions for the Dispatch v1alpha1 API group</p>
</p>
Resource Types:
<ul></ul>
<h3 id="dispatch.d2iq.io/v1alpha1.ConfigSource">ConfigSource
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
<code>configMapKeyRef</code></br>
<em>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.13/#configmapkeyselector-v1-core">
Kubernetes core/v1.ConfigMapKeySelector
</a>
</em>
</td>
<td>
<p>Set the ConfigMap key reference.</p>
</td>
</tr>
</tbody>
</table>
<h3 id="dispatch.d2iq.io/v1alpha1.CronAction">CronAction
</h3>
<p>
(<em>Appears on:</em>
<a href="#dispatch.d2iq.io/v1alpha1.PipelineRunResult">PipelineRunResult</a>)
</p>
<p>
<p>Cron action metadata as parsed from Dispatchfile</p>
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
<code>name</code></br>
<em>
string
</em>
</td>
<td>
<p>Name of the cron action</p>
</td>
</tr>
<tr>
<td>
<code>schedule</code></br>
<em>
string
</em>
</td>
<td>
<p>Schedule specified in the action</p>
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
<p>Revision specified in the action</p>
</td>
</tr>
</tbody>
</table>
<h3 id="dispatch.d2iq.io/v1alpha1.CronPhase">CronPhase
(<code>string</code> alias)</p></h3>
<p>
(<em>Appears on:</em>
<a href="#dispatch.d2iq.io/v1alpha1.CronStatus">CronStatus</a>)
</p>
<p>
<p>Possible states for cron reconciliation.
- Pending indicates work needs to be scheduled
- Syncing indicates active work being done
- Ready is the standby state</p>
</p>
<h3 id="dispatch.d2iq.io/v1alpha1.CronStatus">CronStatus
</h3>
<p>
(<em>Appears on:</em>
<a href="#dispatch.d2iq.io/v1alpha1.RepositoryStatus">RepositoryStatus</a>)
</p>
<p>
<p>Cron actions related metadata to be updated by various actors Repository CRD</p>
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
<code>phase</code></br>
<em>
<a href="#dispatch.d2iq.io/v1alpha1.CronPhase">
CronPhase
</a>
</em>
</td>
<td>
<em>(Optional)</em>
<p>Current state of cron reconciliation</p>
</td>
</tr>
<tr>
<td>
<code>pipelineRunRef</code></br>
<em>
string
</em>
</td>
<td>
<em>(Optional)</em>
<p>Reference to most recently launched pipelinerun which should be used to update cron triggers</p>
</td>
</tr>
<tr>
<td>
<code>pipelineRunResults</code></br>
<em>
<a href="#dispatch.d2iq.io/v1alpha1.PipelineRunResult">
[]PipelineRunResult
</a>
</em>
</td>
<td>
<em>(Optional)</em>
<p>Status array to be used by pipelineruns to reflect the parsed cron actions</p>
</td>
</tr>
<tr>
<td>
<code>dispatchfileChecksum</code></br>
<em>
string
</em>
</td>
<td>
<em>(Optional)</em>
<p>checksum of the Dispatchfile contents</p>
</td>
</tr>
<tr>
<td>
<code>dispatchfileRepoRevision</code></br>
<em>
string
</em>
</td>
<td>
<em>(Optional)</em>
<p>commit SHA of the HEAD of dispatchfile repo branch/tag</p>
</td>
</tr>
</tbody>
</table>
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
<h3 id="dispatch.d2iq.io/v1alpha1.GitopsRepository">GitopsRepository
</h3>
<p>
<p>GitopsRepository represents an SCM repository webhook on a gitops repository that backs an ArgoCD Application resource.</p>
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
<a href="#dispatch.d2iq.io/v1alpha1.GitopsRepositorySpec">
GitopsRepositorySpec
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
<h3 id="dispatch.d2iq.io/v1alpha1.GitopsRepositorySpec">GitopsRepositorySpec
</h3>
<p>
(<em>Appears on:</em>
<a href="#dispatch.d2iq.io/v1alpha1.GitopsRepository">GitopsRepository</a>)
</p>
<p>
<p>GitopsRepositorySpec defines the desired state of GitopsRepository</p>
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
<h3 id="dispatch.d2iq.io/v1alpha1.LogStorageRule">LogStorageRule
</h3>
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
<code>maxBuildAge</code></br>
<em>
uint
</em>
</td>
<td>
<p>Maximum number of days to retain a build</p>
</td>
</tr>
<tr>
<td>
<code>maxBuildRuns</code></br>
<em>
uint
</em>
</td>
<td>
<p>Maximum number of runs to retain of a build</p>
</td>
</tr>
<tr>
<td>
<code>tasks</code></br>
<em>
string
</em>
</td>
<td>
<p>A csv of globs indicating tasks. * implicates all tasks in a pipeline</p>
</td>
</tr>
</tbody>
</table>
<h3 id="dispatch.d2iq.io/v1alpha1.LogStorageRules">LogStorageRules
(<code>[]./pkg/apis/v1alpha1/.LogStorageRule</code> alias)</p></h3>
<p>
(<em>Appears on:</em>
<a href="#dispatch.d2iq.io/v1alpha1.RepositorySpec">RepositorySpec</a>)
</p>
<p>
</p>
<h3 id="dispatch.d2iq.io/v1alpha1.PipelineRunResult">PipelineRunResult
</h3>
<p>
(<em>Appears on:</em>
<a href="#dispatch.d2iq.io/v1alpha1.CronStatus">CronStatus</a>)
</p>
<p>
<p>Pipeleneruns update the status of repository CRD using this object</p>
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
<code>name</code></br>
<em>
string
</em>
</td>
<td>
<p>Name of the pipelinerun</p>
</td>
</tr>
<tr>
<td>
<code>cronActions</code></br>
<em>
<a href="#dispatch.d2iq.io/v1alpha1.CronAction">
[]CronAction
</a>
</em>
</td>
<td>
<em>(Optional)</em>
<p>Cron actions parsed by the pipelinerun</p>
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
<tr>
<td>
<code>logStorageRules</code></br>
<em>
<a href="#dispatch.d2iq.io/v1alpha1.LogStorageRules">
LogStorageRules
</a>
</em>
</td>
<td>
<p>Rules pertaining to log storage garbage collection</p>
</td>
</tr>
<tr>
<td>
<code>timeout</code></br>
<em>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.13/#duration-v1-meta">
Kubernetes meta/v1.Duration
</a>
</em>
</td>
<td>
<p>Set the duration after which a PipelineRun is considered failed due to timeout.
If the value is empty, the global timeout is used. If the value is set to 0, then
the PipelineRun fails immediately upon encountering an error, this is equivalent to &ldquo;no timeout&rdquo;.
See:
- <a href="https://github.com/tektoncd/pipeline/issues/978">https://github.com/tektoncd/pipeline/issues/978</a>
- <a href="https://github.com/tektoncd/pipeline/pull/1040">https://github.com/tektoncd/pipeline/pull/1040</a></p>
</td>
</tr>
<tr>
<td>
<code>podTemplateFrom</code></br>
<em>
<a href="#dispatch.d2iq.io/v1alpha1.ConfigSource">
ConfigSource
</a>
</em>
</td>
<td>
<em>(Optional)</em>
<p>Set the reference of the ConfigMap to load the pod template for the PipelineRuns triggered for this repository</p>
</td>
</tr>
<tr>
<td>
<code>disableAutoCancel</code></br>
<em>
bool
</em>
</td>
<td>
<em>(Optional)</em>
<p>Set to true to disable auto canceling of running and pending builds when new builds
are created.</p>
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
<a href="#dispatch.d2iq.io/v1alpha1.GitopsRepositorySpec">GitopsRepositorySpec</a>, 
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
<tr>
<td>
<code>logStorageRules</code></br>
<em>
<a href="#dispatch.d2iq.io/v1alpha1.LogStorageRules">
LogStorageRules
</a>
</em>
</td>
<td>
<p>Rules pertaining to log storage garbage collection</p>
</td>
</tr>
<tr>
<td>
<code>timeout</code></br>
<em>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.13/#duration-v1-meta">
Kubernetes meta/v1.Duration
</a>
</em>
</td>
<td>
<p>Set the duration after which a PipelineRun is considered failed due to timeout.
If the value is empty, the global timeout is used. If the value is set to 0, then
the PipelineRun fails immediately upon encountering an error, this is equivalent to &ldquo;no timeout&rdquo;.
See:
- <a href="https://github.com/tektoncd/pipeline/issues/978">https://github.com/tektoncd/pipeline/issues/978</a>
- <a href="https://github.com/tektoncd/pipeline/pull/1040">https://github.com/tektoncd/pipeline/pull/1040</a></p>
</td>
</tr>
<tr>
<td>
<code>podTemplateFrom</code></br>
<em>
<a href="#dispatch.d2iq.io/v1alpha1.ConfigSource">
ConfigSource
</a>
</em>
</td>
<td>
<em>(Optional)</em>
<p>Set the reference of the ConfigMap to load the pod template for the PipelineRuns triggered for this repository</p>
</td>
</tr>
<tr>
<td>
<code>disableAutoCancel</code></br>
<em>
bool
</em>
</td>
<td>
<em>(Optional)</em>
<p>Set to true to disable auto canceling of running and pending builds when new builds
are created.</p>
</td>
</tr>
</tbody>
</table>
<h3 id="dispatch.d2iq.io/v1alpha1.RepositoryStatus">RepositoryStatus
</h3>
<p>
(<em>Appears on:</em>
<a href="#dispatch.d2iq.io/v1alpha1.GitopsRepository">GitopsRepository</a>, 
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
<p>The webhook&rsquo;s id as returned by the provider API (to detect if the webhook has changed since the secret was last set).</p>
</td>
</tr>
<tr>
<td>
<code>cronStatus</code></br>
<em>
<a href="#dispatch.d2iq.io/v1alpha1.CronStatus">
CronStatus
</a>
</em>
</td>
<td>
<em>(Optional)</em>
<p>Cron metadata reflects any currently active pipeline(s) that are working to parse the Dispatchfile and load the cron actions.
Can also be updated by event-sink to force reconciliation</p>
</td>
</tr>
<tr>
<td>
<code>buildCounter</code></br>
<em>
uint32
</em>
</td>
<td>
<em>(Optional)</em>
<p>Build counter that specifies the current build number in the repository object. Starts from 0 and can be reset to 0 anytime.</p>
</td>
</tr>
</tbody>
</table>
<hr/>
