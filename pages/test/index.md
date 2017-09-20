---
layout: layout.pug
title: Home
navigationTitle: Home
menuWeight: -1
overviewGrid: true
enterprise: true
---

[enterprise]

## Introduction

DC/OS is a distributed operating system based on the Apache Mesos distributed systems kernel. It enables the management of multiple machines as if they were a single computer. It automates resource management, schedules process placement, facilitates inter-process communication, and simplifies the installation and management of distributed services. Its included web interface and available command-line interface (CLI) facilitate remote management and monitoring of the cluster and its services.

## Shortcodes

### Enterprise Tag {data-hide=true}

[enterprise]

Enterprise Content

### OSS Tag {data-hide=true}

[oss]

OSS Content

### Message {data-hide=true}

[message]Test Message[/message]

[message  color="yellow"]Test Message[/message]

[message  color="red"]Test Message[/message]

[message  color="black"]Test Message[/message]

[message  color="green"]Test Message[/message]

[message fill="false"]Test Message[/message]

[message  color="yellow" fill="false"]Test Message[/message]

[message  color="red" fill="false"]Test Message[/message]

[message  color="black" fill="false"]Test Message[/message]

[message  color="green" fill="false"]Test Message[/message]

## Syntax Highlighting

Inline Example

Inline `code` has `back-ticks around` it.

Javascript Example

```javascript
function foo() {
  console.log('bar');
}
```

No Language Example

```
dcos[options][<command>][<args>...]
```

Bash Example

```bash
dcos[options][<command>][<args>...]
```

## Tables

Colons can be used to align columns.

| Tables         | Are           | Cool  |
| -------------- |:-------------:| -----:|
| `--debug`      | right-aligned | $1600 |
| col 3 is       | right-aligned | $1600 |
| col 2 is       | centered      |   $12 |
| zebra stripes  | are neat      |    $1 |


## Block Quotes

> Blockquotes are very handy in email to emulate reply text.

> Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
> tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
> quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
> consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
> cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
> proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Quote break.

> This is a very long line that will still be quoted properly when it wraps. Oh boy

## Horizontal Rule

Three or more...

---

Hyphens

***

Asterisks

___

Underscores