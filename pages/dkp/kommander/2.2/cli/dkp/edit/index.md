---
layout: layout.pug
navigationTitle:  dkp edit
title:  dkp edit
menuWeight: 10
excerpt: Edit a resource on the server
notes: Automatically generated, DO NOT EDIT
enterprise: false
beta: false
---
<!-- vale off -->
<!-- markdownlint-disable -->

## dkp edit

Edit a resource on the server

### Synopsis

Edit a resource from the default editor.

 The edit command allows you to directly edit any API resource you can retrieve via the command-line tools. It will open
the editor defined by your KUBE_EDITOR, or EDITOR environment variables, or fall back to 'vi' for Linux or 'notepad' for
Windows. You can edit multiple objects, although changes are applied one at a time. The command accepts file names as
well as command-line arguments, although the files you point to must be previously saved versions of resources.


```
dkp edit (RESOURCE/NAME | -f FILENAME)
```

### Options

```
      --allow-missing-template-keys   If true, ignore any errors in templates when a field or map key is missing in the template. Only applies to golang and jsonpath output formats. (default true)
      --config string                 Config file to use (default "/root/.kommander/config")
      --context string                The name of the kubeconfig context to use
      --field-manager string          Name of the manager used to track field ownership. (default "kommander-cli")
  -f, --filename strings              Filename, directory, or URL to files to use to edit the resource (default [])
  -h, --help                          help for edit
      --kubeconfig string             Path to the kubeconfig file to use for CLI requests.
  -k, --kustomize string              Process the kustomization directory. This flag can't be used together with -f or -R.
  -n, --namespace string              namespace of the resource (default "default")
  -o, --output string                 Output format. One of: (json, yaml, name, go-template, go-template-file, template, templatefile, jsonpath, jsonpath-as-json, jsonpath-file).
      --output-patch                  Output the patch if the resource is edited.
  -R, --recursive                     Process the directory used in -f, --filename recursively. Useful when you want to manage related manifests organized within the same directory.
      --request-timeout string        The length of time to wait before giving up on a single server request. Non-zero values should contain a corresponding time unit (e.g. 1s, 2m, 3h). A value of zero means don't timeout requests.
      --save-config                   If true, the configuration of current object will be saved in its annotation. Otherwise, the annotation will be unchanged. This flag is useful when you want to perform kubectl apply on this object in the future.
      --show-managed-fields           If true, keep the managedFields when printing objects in JSON or YAML format.
      --subresource string            If specified, edit will operate on the subresource of the requested object. Must be one of [status]. This flag is alpha and may change in the future.
      --template string               Template string or path to template file to use when -o=go-template, -o=go-template-file. The template format is golang templates [http://golang.org/pkg/text/template/#pkg-overview].
      --validate string[="strict"]    Must be one of: strict (or true), warn, ignore (or false).
                                      		"true" or "strict" will use a schema to validate the input and fail the request if invalid. It will perform server side validation if ServerSideFieldValidation is enabled on the api-server, but will fall back to less reliable client-side validation if not.
                                      		"warn" will warn about unknown or duplicate fields without blocking the request if server-side field validation is enabled on the API server, and behave as "ignore" otherwise.
                                      		"false" or "ignore" will not perform any schema validation, silently dropping any unknown or duplicate fields. (default "strict")
      --windows-line-endings          Defaults to the line ending native to your platform.
```

### Options inherited from parent commands

```
  -v, --verbose int   Output verbosity
```

### SEE ALSO

* [dkp](/dkp/kommander/2.2/cli/dkp/)	 - 

