---
layout: layout.pug
navigationTitle:  Input Formats
title: Input Formats
menuWeight: 45
excerpt: Pool configuration file format information

enterprise: false
---


Edge-LB accepts configuration files in either YAML or JSON format. Users are encouraged to use JSON and migrate their configuration from YAML format though, as YAML will be at some point deprecated.

# Convert YAML to JSON

Convert a YAML configuration file to JSON and output the results to `stdout` with the following command.

`dcos edgelb show --convert-to-json=/path/to/yaml`
