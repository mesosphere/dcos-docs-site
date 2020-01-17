---
layout: layout.pug
navigationTitle: Edge-LB pool configuration
title: Pool configuration
menuWeight: 84
excerpt: Provides reference information for Edge-LB pool configuration settings
enterprise: true
---

The tables in this section describe the possible configuration options. Most configuration options have default values that are applicable and appropriate for most organizations. You can modify the default configuration values to suit your requirements, if needed. However, you should review and test any configuration changes carefully before deploying them to a production environment.

# Before you modify configuration settings
If you plan to modify the Edge-LB pool configuration options, you should keep the following guidelines in mind:
* If a configuration option does not have a default value and you do not explicitly set a value, the configuration is left as empty (unconfigured), even for objects.
* You should set default values in the object that is furthest from the root object.
* You should always set a default for arrays.
* The purpose of a "nullable" configuration option is to allow the output JSON field to be set to the Go language "zero value". Without "nullable" support, the configuration option will be removed from the resulting JSON.
* Actual validation is done in the code, not expressed in swagger.
* If the data type for a configuration option is a boolean, an empty value is interpreted as "false". For boolean configuration options, you should not set a default value.
* Use CamelCase to set configuration values.
* Swagger only validates enumerated (enum) data values if the configuration option is a top level definition.

# API version compatibility
There are two versions of the Edge-LB API specification and DC/OS&trade; supports both to enable backward compatibility. The top-level configuration field `apiVersion` is used to distinguish between the two versions of the API specification. The two models are almost identical, with one important difference: `pool.haproxy.backends.servers` (in `apiVersion` V1) was replaced with `pool.haproxy.backend.service` -  a more intuitive way to select services and backends for HAProxy&reg; load balancers.

<p class="message--note"><strong>NOTE: </strong> The <tt>apiVersion</tt> field in the pool definition defaults to <tt>V2</tt> if it was not explicitly provided. To use the <tt>V1</tt> config, you must explicitly set the <tt>pool.apiVersion</tt> to `"V1"`.</p>

Because the specifications are nearly identical, the reference information in this section provides details for the both versions of the Edge-LB API specification. If you need pool configuration information for working with the older specification, see [Edge-LB pool configuration (REST API V1)](/mesosphere/dcos/services/edge-lb/1.5/reference/pool-configuraiton-reference/v1-reference).

# Configuration file input format
Edge-LB accepts configuration files in either YAML or JSON format. In most cases, however, you should use JSON and migrate any previous configuration settings from YAML format to JSON.

Because the YAML file format is intended for deprecation in favor or JSON format, the Edge-LB command-line inteface includes a command to convert YAML files to their equivalent JSON format.

To convert a YAML configuration file to JSON and output the results to standard output (`stdout`), run the following command:

`dcos edgelb show --convert-to-json=/path/to/yaml`

For more information about using Edge-LB commands, see the [Edge-LB command-line interface](/mesosphere/dcos/services/edge-lb/1.5/reference/cli-reference/) reference information.
