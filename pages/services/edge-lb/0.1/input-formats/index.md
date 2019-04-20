---
layout: layout.pug
navigationTitle:  Input Formats
title: Input Formats
menuWeight: 45
excerpt:

enterprise: false
---

Pool configuration file format information.

Edge-LB accepts configuration in either YAML or JSON format.

# Convert YAML to JSON

Convert a YAML configuration file to JSON with the command below.

`dcos edgelb config --to-json=/path/to/json`

# Convert JSON to YAML

There currently isn't an automated way to do this, the suggested method is to
hand convert it, and then use the YAML to JSON conversion on your YAML and
then do a diff between your YAML and the JSON.

```
# First hand convert JSON to YAML

# Then compare to original json with the `diff` shell command.
# Here we "convert" even the JSON file to get consistently formatted JSON
diff <(dcos edgelb config --to-json=myconfig.yaml) <(dcos edgelb config --to-json=myconfig.json)
```
