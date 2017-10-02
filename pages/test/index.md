---
layout: layout.pug
title: Home
navigationTitle: Home
menuWeight: -1
overviewGrid: true
enterprise: true
rss: true
relatedPages:
  - /test/overview
  - /test/api
  - /test/cli
---

[enterprise]

## Introduction

DC/OS is a distributed operating system based on the Apache Mesos distributed systems kernel. It enables the management of multiple machines as if they were a single computer. It automates resource management, schedules process placement, facilitates inter-process communication, and simplifies the installation and management of distributed services. Its included web interface and available command-line interface (CLI) facilitate remote management and monitoring of the cluster and its services.

## Shortcodes

### Enterprise Tag {data-hide=true}
##### Large

[enterprise]
[enterprise&nbsp;]

##### Small

[enterprise size="small"]
[enterprise&nbsp;size="small"]

##### Inline

[enterprise type="inline"] this is an example of an inline badge

[enterprise&nbsp;type="inline"] this is an example of an inline badge

Enterprise Content

### OSS Tag {data-hide=true}

##### Large

[oss]
[oss&nbsp;]

##### Small

[oss size="small"]
[oss&nbsp;size="small"]

##### Inline

[oss type="inline"] this is an example of an inline badge

[oss&nbsp;type="inline"] this is an example of an inline badge

OSS Content

### Tooltips

Copy your existing [tooltip content="This is some content"]config.yaml[/tooltip] and [tooltip content="Tooltip"]ip-detect[/tooltip] files to...

Copy your existing [tooltip&nbsp;content="This is some content"]config.yaml[/tooltip] and [tooltip&nbsp;content="Tooltip"]ip-detect[/tooltip] files to...
### Support for Image Types and Opening In New Tab

| Attribute      | Requirement   | Options  |
| -------------- |:-------------:| -----:|
| src            | required      | url / path to image   |
| type           | optional (default: inline) | inline (original size and inline), fill (100% of parent container), fluid (100% of parent container and min-width = original size) |
| alt            | optional      |   text to be displayed if image does not load |
| caption        | optional      |    text to be displayed below image |


##### Inline (original size and inline)

[image src="../docs/1.10/img/auth-login.png" type="inline" alt="Test" caption="Example caption"]
[image&nbsp;src="../docs/1.10/img/auth-login.png" type="inline" alt="Test" caption="Example caption"]


##### Fill (fill 100% of parent container)

[image src="../docs/1.10/img/auth-login.png" type="fill" alt="Test" caption="Example caption"]
[image&nbsp;src="../docs/1.10/img/auth-login.png" type="fill" alt="Test" caption="Example caption"]

##### Fluid (fill 100% of parent container until reaching original size (min-width = original size))

[image src="../docs/1.10/img/auth-login.png" type="fluid" alt="Test" caption="Example caption"]
[image&nbsp;src="../docs/1.10/img/auth-login.png" type="fluid" alt="Test" caption="Example caption"]


### Buttons

#### Options

| Attribute      | Requirement   | Options  |
| -------------- |:-------------:| -----:|
| color          | optional (default: purple) | purple, pink, dark, light|
| size           | optional (default: large) | large, small |


##### Large (default)

[button color="purple"]Purple[/button]
[button&nbsp;color="purple"]Purple[/button]

[button color="pink"]Pink[/button]
[button&nbsp;color="pink"]Pink[/button]

[button color="dark"]Dark[/button]
[button&nbsp;color="dark"]Dark[/button]

[button color="light"]Light[/button]
[button&nbsp;color="light"]Light[/button]

##### Small
[button color="purple" size="small"]Purple[/button]
[button&nbsp;color="purple" size="small"]Purple[/button]

[button color="pink" size="small"]Pink[/button]
[button&nbsp;color="pink" size="small"]Pink[/button]

[button color="dark" size="small"]Dark[/button]
[button&nbsp;color="dark" size="small"]Dark[/button]

[button color="light" size="small"]Light[/button]
[button&nbsp;color="light" size="small"]Light[/button]

### Message {data-hide=true}

#### Options
| Attribute      | Requirement   | Options  |
| -------------- |:-------------:| -----:|
| type            | optional      | warning, error, info, success   |
| fill           | optional (default: true) | boolean |


[message]Test Message[/message]
[message&nbsp;]Test Message[/message]

[message  type="warning"]Test Message[/message]
[message&nbsp;type="warning"]Test Message[/message]

[message  type="error"]Test Message[/message]
[message&nbsp;type="error"]Test Message[/message]

[message  type="info"]Test Message[/message]
[message&nbsp;type="info"]Test Message[/message]

[message  type="success"]Test Message[/message]
[message&nbsp;type="success"]Test Message[/message]

[message fill="false"]Test Message[/message]
[message&nbsp;fill="false"]Test Message[/message]

[message  type="warning" fill="false"]Test Message[/message]
[message&nbsp;type="warning" fill="false"]Test Message[/message]

[message  type="error" fill="false"]Test Message[/message]
[message&nbsp;type="error" fill="false"]Test Message[/message]

[message  type="info" fill="false"]Test Message[/message]
[message&nbsp;type="info" fill="false"]Test Message[/message]

[message  type="success" fill="false"]Test Message[/message]
[message&nbsp;type="success" fill="false"]Test Message[/message]

### Feather Icons {data-hide=true}

[icon glyph="message-square"]

[icon&nbsp;glyph="message-square"]

All feather icon glyphs are available at [https://feathericons.com](https://feathericons.com)

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

```markdown
  | Tables         | Are           | Cool  |
  | -------------- |:-------------:| -----:|
  | `--debug`      | right-aligned | $1600 |
  | col 3 is       | right-aligned | $1600 |
  | col 2 is       | centered      |   $12 |
  | zebra stripes  | are neat      |    $1 |
```

## Block Quotes

use ` > ` to denote blockquotes

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

---&nbsp;

Hyphens

***

***&nbsp;

Asterisks

___

___ &nbsp;

Underscores