+---
 +layout: layout.pug
 +navigationTitle:  dcos license audit get
 +title: dcos license audit get
 +menuWeight: 0
 +excerpt:
 +
 +enterprise: true
 +---
 +
 +# Description
 +Get the cluster license audit records.
 +
 +# Usage
 +
 +```bash
 +dcos license audit get [<id>|active] [--output <file_path>] [--decrypt]
 +```
 +
 +# Options
 +
 +| Name, shorthand | Default | Description |
 +|---------|-------------|-------------|
 +| `--output`   |             |  Store the audit records in a file. |
 +| `--decrypt`   |             |  Decrypt the license audit records checksum. |
