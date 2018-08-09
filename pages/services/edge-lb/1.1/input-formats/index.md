---
layout: layout.pug
navigationTitle:  Input Formats
title: Input Formats
menuWeight: 45
excerpt: Pool configuration file format information

enterprise: false
---


Edge-LB accepts configuration files in either YAML or JSON format.

# Convert YAML to JSON

Convert a YAML configuration file to JSON and output the results to `stdout` with the following command.

`dcos edgelb show --convert-to-json=/path/to/yaml`

# Convert JSON to YAML

There currently is no automated way to do this. We suggest that you hand convert it, and then use the YAML-to-JSON conversion on your YAML. Then find the differences between your YAML and the JSON using the `diff` command.

1. Hand convert JSON to YAML.
2. Compare to original json with the `diff` shell command.
3. "Convert" even the JSON file to get consistently formatted JSON.

```
diff <(dcos edgelb show --convert-to-json=myconfig.yaml) <(dcos edgelb show --convert-to-json=myconfig.json)
```
