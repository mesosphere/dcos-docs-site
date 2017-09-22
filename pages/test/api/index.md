---
layout: layout.pug
title: API
navigationTitle: API
menuWeight: 3
enterprise: true
---

## Some Heading

Content

## Heading

Content

[switch]
[case filter="OSS One"]
[swagger api="/test/api/marathon.yaml"]
[/case]
[case filter="Enterprise One"]
[ngindox api="/test/api/nginx.master.yaml"]
[/case]
[/switch]

[switch]
[case filter="OSS Two"]
## Some Content Two OSS
[/case]
[case filter="Enterprise Two"]
## Some Content Two Enterprise
[/case]
[/switch]
