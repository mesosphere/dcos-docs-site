---
layout: layout.pug
navigationTitle:  Input Formats
title: Input Formats
menuWeight: 45
excerpt: Pool configuration file format information

enterprise: false
---


Edge-LB configuration files should preferably be written in JSON format. YAML is historically supported, but it will be deprecated in the future. We recommend users to migrate their YAML files to JSON

# Convert YAML to JSON

Convert a YAML configuration file to JSON and output the results to `stdout` with the following command.

`dcos edgelb show --convert-to-json=/path/to/yaml`
