---
layout: layout.pug
navigationTitle: Automatically exposing apps with Auto Pools and labels
title: Automatically exposing apps with Auto Pools and labels
menuWeight: 12
excerpt: Describes how you can automatically expose applications with task labels
enterprise: true
---

Using the Auto Pools feature streamlines deployment by enabling [pools](/mesosphere/dcos/services/edge-lb/1.5/concepts/how-edge-lb-works/#edge-lb-pool) to be automatically configured, started, and stopped using Marathon&trade; app labels or SDK task labels (annotations).

Edge-LB automatically provisions pools using pool templates. A default pool template is created at the time of Edge-LB installation. The template is rendered into a pool configuration based on the values of the app / task [labels](#supported-labels) that follows.  Use the command ```dcos edgelb pool-template show default``` to show the default Auto Pool template, which is always available unless the default Auto Pool is disabled on install of the Edge-LB service. If you have already created a pool, you can get the template through Edge-LB when you install it using ```dcos edgelb template show <pool_name>``` for the pool haproxy template.

# Default Pool

The minimum label configuration to expose a service is:

```json
"labels": {
  "edgelb.expose": "true"
}
```

This sample shows all of the supported [labels](#supported-labels) with a `<group>` of `secure` and `nonsecure`:

```json
"labels": {
  "edgelb.expose": "true",
  "edgelb.template": "default",
  "edgelb.delimiter": ",",
  "edgelb.item_delimiter": "|",
  "edgelb.key_delimiter": ":",
  "edgelb.nonsecure.frontend.redirectToHttps": "",
  "edgelb.secure.frontend.certificates": "$AUTOCERT",
  "edgelb.secure.frontend.port": "443",
  "edgelb.secure.frontend.protocol": "HTTPS",
  "edgelb.secure.frontend.rules": "hostEq:www.test.com|pathBeg:/a",
  "edgelb.secure.backend.balance": "roundrobin",
  "edgelb.secure.backend.portName": "web",
  "edgelb.secure.backend.protocol": "HTTP",
  "edgelb.secure.backend.rewriteHttp.path": "/a:/",
  "edgelb.secure.backend.rewriteHttp.sticky": ""
}
```

An example Marathon&trade; application can be found in the [example apps](/mesosphere/dcos/services/edge-lb/1.5/reference/pool-configuration-reference/v2-examples/#auto-pool-marathon-application). For an in-depth tutorial exposing applications, see the [tutorial](/mesosphere/dcos/services/edge-lb/1.5/tutorials/using-auto-pools).

The default pool template selects tasks with the label `"edgelb.expose" : true`. You can then further customize the template using labels.

Some labels use a `<group>` in their name. The `<group>` value can be any ASCII string value except `expose`, `template`, `delimiter`, `item_delimiter`, `key_delimiter`, and the string cannot contain a `.`.

Groups are used for two tasks:

1. Grouping `frontend` and `backend` options, allowing a single task to be exposed in multiple frontends.
2. Grouping `backend` services, such as multiple instances on a Marathon app.
    All tasks with the same `<group>` will be listed as a separate service entry in a single `backend` named by the group. The default group if no options are provided is `__default__`.

We recommend using the `<group>` field to describe the frontend app, such as `website`, or `broker`.

# Supported Labels

| label | default value | description |
|---|---|---|
| `edgelb.expose` | `false` | Boolean to enable the task for Auto Pool processing. |
| `edgelb.template` | `default` | The template name. Allows templates to filter tasks belonging to other templates. |
| `edgelb.delimiter` | `,` | The delimiter to be used when parsing `list`s. |
| `edgelb.item_delimiter` | `\|` | The delimiter between items (key, value pairs) to be used when parsing `dict`s. |
| `edgelb.key_delimiter` | `:` | The delimiter between keys and values to be used when parsing `dict`s. |
| `edgelb.<group>.frontend.certificates` | | A `list` of secret names (or the value `$AUTOCERT`) to be used as certificates. If set will enable `HTTPS`. |
| `edgelb.<group>.frontend.port` | `80` if protocol is HTTP, `443` if HTTPS, required if protocol is `TCP` | The frontend bind port. |
| `edgelb.<group>.frontend.protocol` | `HTTP` if not specified, `HTTPS` if `certificates` specified | The frontend protocol. |
| `edgelb.<group>.frontend.redirectToHttps` | | If this labels exists then `redirectToHttps` is enabled for the frontend. The value can be empty or a `list` of `dicts` that will be used as the [`except` variable](/mesosphere/dcos/services/edge-lb/1.5/reference/pool-configuration-reference/v2-reference/#poolhaproxyfrontendredirecttohttps). |
| `edgelb.<group>.frontend.rules` | `pathBeg:/` | A `list` of `dict`s corresponding to the Edge-LB [`pool.haproxy.frontend.linkBackend.map`](https://docs.d2iq.com/mesosphere/dcos/services/edge-lb/1.5/reference/pool-configuration-reference/v2-reference/#poolhaproxyfrontendlinkbackend). |
| `edgelb.<group>.backend.balance` | | The balancing [algorithm](https://cbonte.github.io/haproxy-dconv/2.0/configuration.html#4.2-balance). |
| `edgelb.<group>.backend.portName` | The name of the first port exposed from the task | The name of the port to send traffic to. |
| `edgelb.<group>.backend.protocol` | `HTTP` unless frontend protocol is not `HTTP/HTTPS`, then matches frontend | The backend protocol. |
| `edgelb.<group>.backend.rewriteHttp.path` | | A `dict` of 1 item mapping the key path on the frontend to the value path on the backend. For example to map `/a` on the frontend to `/` on the backend, set the value to `/a:/` |
| `edgelb.<group>.backend.rewriteHttp.sticky` | | If the label exists, sticky is enabled with the default options. Any non-whitespace value for the label will be used as the [`customStr`](/mesosphere/dcos/services/edge-lb/1.5/reference/reference/pool-configuration-reference/v2-reference/#poolhaproxybackendrewritehttp) |

# Managing Pool Templates

You can deploy multiple Auto Pools by creating additional `poolTemplate`s using the API or command line. When created, the new `poolTemplate` is a copy of the default template which you can then modify, if needed. In addition, you can get the status of template rendering.

| action | api method | api path | cli command |
|---|---|---|---|
| list | GET | `/v2/poolTemplates` |  `dcos edgelb pool-template list` |
| create | POST | `/v2/poolTemplates` |  `dcos edgelb pool-template create <name>` |
| delete | DELETE | `/v2/poolTemplates/{name}` |  `dcos edgelb pool-template delete <name>` |
| status | GET | `/v2/poolTemplates/{name}/status` |  `dcos edgelb pool-template status <name>` |
| update | PUT | `/v2/poolTemplates/{name}/template` |  `dcos edgelb pool-template update <name> <file>` |
| reset | DELETE | `/v2/poolTemplates/{name}/template` |  `dcos edgelb pool-template reset <name>` |
| show | GET | `/v2/poolTemplates/{name}/template` |  `dcos edgelb pool-template show <name>` |

For more information about the api, such as parameters and payload, refer to the [Edge-LB API reference](/mesosphere/dcos/services/edge-lb/1.5/reference/edgelb-api).

## CLI example usage

To list the templates created (including the default template):

```bash
dcos edgelb pool-template list
  NAME
  default
```

To create a new pool template:

```bash
dcos edgelb pool-template create dobby
Successfully created dobby. Check "dcos edgelb pool-template show dobby" or "dcos edgelb pool-template status dobby" for deployment status

dcos edgelb pool-template list
  NAME
  default
  dobby
```

Each new pool template is a copy of the default template with the magic string `__ELB_POOL_TEMPLATE_NAME__` replaced with the `poolTemplate`'s name.

To see rendering information and status:

```bash
dcos edgelb pool-template status default
  NAME     STATUS  MESSAGE
  default  OK      pool has been successfully
                   deployed

dcos edgelb pool-template status dobby
  NAME   STATUS    MESSAGE
  dobby  NO_TASKS  no matching mesos tasks for
                   the given pool template were
                   found
```

To fetch the current template:

```bash
dcos edgelb pool-template show dobby > dobby.tmpl
```

To update the current template:

```bash
dcos edgelb pool-template update dobby dobby.tmpl
```

To reset the current template back to the default:

```bash
dcos edgelb pool-template reset dobby
Successfully reset Pool Template dobby. Check "dcos edgelb pool-template show dobby" or "dcos edgelb pool-template status dobby" for deployment status
```

To delete the pool template and the pools deployed by it:

```bash
dcos edgelb pool-template delete dobby
Successfully deleted dobby. Check the DC/OS web UI for pool uninstall status.
```

# Template Functions

Templates have access to all [sprig](http://masterminds.github.io/sprig/) functions with the exception of `env` and `expandenv` which have been removed for security reasons. This is the same set of functions used by [Helm](https://helm.sh/).

In addition a function `mesosTasks` returns a list of structs for the template to use:

```go
// TmplMesosTask is a simplified view of the Task for use in the templates
// it is not a sprig `dict` (map[string]interface{}) to allow access to the
// `MesosTask` field in the template without type asserting.
type TmplMesosTask struct {
	TaskID      string                 `json:"-"`
	FrameworkID string                 `json:"-"`
	Labels      map[string]interface{} `json:"-"`
	Ports       []interface{}          `json:"-"`

	// Access to the raw task is given for advanced use
	MesosTask *mesos_v1.Task `json:"-"`

	// Only these fields will be rendered to json
	Message string              `json:"message"`
	Status  models.RenderStatus `json:"status"`
	URIs    []string            `json:"uris"`
}
```

Another function `parseTaskLabels` will parse the labels into a nested `dict` structure (discussed below).

Templates must use the `renderPoolTemplate` function to render a defined template. The defined template should either render a pool configuration, or call the `noTasks` function, to signal that no tasks were selected for the pool and therefore should not be started. (See the default pool [template](https://github.com/mesosphere/dcos-edge-lb/blob/master/container/apiserver/templates/pool.json.ctmpl) for an example).

# Default Template Implementation

The default template transforms the task list into an intermediary representation, and then uses that representation to render the final pool configuration or determine that no tasks met its selection.

For example, suppose the `mesosTasks` function returned the following (shown in JSON for convenience):

```json
[
  {
    "TaskID": "task1",
    "FrameworkID": "framework1_id",
    "Labels": {
      "edgelb.expose" : true
    }
  },
  {
    "TaskID": "task2",
    "FrameworkID": "framework2_id",
    "Labels": {
      "edgelb.expose" : true,
      "edgelb.template": "default",
      "edgelb.web.frontend.certificates": "mycertsecret",
      "edgelb.web.frontend.port": "443",
      "edgelb.web.frontend.protocol": "HTTPS",
      "edgelb.web.frontend.rules": "pathBeg:/web|hostEq:www.test.com",
      "edgelb.web.backend.portName": "web",
      "edgelb.web.backend.protocol": "HTTP",
      "edgelb.web.backend.rewriteHttp.path": "/web:/"
    }
  }
]
```

The default template pool then uses `parseTaskLabels` to transform the labels into a nested dict structure. For example the `Labels` from `task2` will produce:

```json
{
  "expose": "true",
  "template": "default",
  "web": {
    "frontend": {
      "certificates": [
        "mycertsecret"
      ],
      "port": "443",
      "protocol": "HTTPS",
      "rules": [
        {
          "hostEq": "www.test.com",
          "pathBeg": "/web"
        }
      ]
    },
    "backend": {
      "portName": "web",
      "protocol": "HTTP",
      "rewriteHttp": {
        "path": {
          "/web": "/"
        }
      }
    }
  }
}
```

This format is then further transformed within the template into the global intermediary variables `$BACKENDS`, `$FRONTENDS` and `$SECRETS`:

### `$BACKENDS`

```json
{
  "__default__": {
    "service": [
      {
        "task_id": "task1",
        "framework_id": "framework1_id",
        "endpoint": {
          "portName": "name_of_first_port",
        }
      }
    ]
  },
  "web": {
    "service": [
      {
        "task_id": "task2",
        "framework_id": "framework2_id",
        "endpoint": {
          "portName": "web",
        }
      }
    ],
    "rewriteHttp": {
      "path": {
        "fromPath": "/web",
        "toPath": "/"
      }
    }
  }
}
```

### `$FRONTENDS`

```json
{
  "80": {
    "protocol": "HTTP",
    "maps": [
      {
        "pathBeg": "/",
        "backend": "__default__"
      }
    ]
  },
  "443": {
    "protocol": "HTTPS",
    "certificates": ["$SECRETS/mycertsecret"],
    "maps": [
      {
        "hostEq": "www.test.com",
        "pathBeg": "/web",
        "backend": "web"
      }
    ]
  }
}
```

### `$SECRETS`

```json
[
  {
    "secret": "mycertsecret",
    "file": "mycertsecret"
  }
]
```

These intermediary variables are then used to render the final pool configuration. If there are no `$BACKENDS`, `noTasks` will be called.
