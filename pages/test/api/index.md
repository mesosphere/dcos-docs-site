---
layout: layout.pug
title: API
navigationTitle: API
menuWeight: 3
enterprise: true
---

## Some Heading

Content

## API

[switch]
[case filter="OSS"]
[swagger api="/test/api/marathon.yaml"]
[/case]
[case filter="Enterprise"]
[ngindox api="/test/api/nginx.master.yaml"]
[/case]
[/switch]

[switch]
[case filter="OSS"]
## Some Content Two OSS
[/case]
[case filter="Enterprise"]
## Some Content Two Enterprise
[/case]
[/switch]
