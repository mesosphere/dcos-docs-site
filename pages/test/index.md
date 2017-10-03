---
layout: layout.pug
title: Home
navigationTitle: Home
menuWeight: -1
overviewGrid: true
enterprise: true
rss: true
---

[enterprise]

## Introduction

DC/OS is a distributed operating system based on the Apache Mesos distributed systems kernel. It enables the management of multiple machines as if they were a single computer. It automates resource management, schedules process placement, facilitates inter-process communication, and simplifies the installation and management of distributed services. Its included web interface and available command-line interface (CLI) facilitate remote management and monitoring of the cluster and its services.

## Shortcodes

### Enterprise Tag {data-hide=true}

#### Options
| Attribute      | Requirement   | Options  |
| -------------- |:-------------:| -----:|
| size            | optional (default: large)      | large, small   |
| type           | optional (default: block) | block, inline |
##### Large

Example:
[enterprise]
  
  
Usage:  

[enterprise&nbsp;]

##### Small

Example:
[enterprise size="small"]
  
  
Usage:  

[enterprise&nbsp;size="small"]

##### Inline

Example:
[enterprise type="inline"] this is an example of an inline badge
  
  
Usage:  

[enterprise&nbsp;type="inline"] this is an example of an inline badge

Enterprise Content

### OSS Tag {data-hide=true}

##### Large

Example:
[oss]
  
  
Usage:  

[oss&nbsp;]

##### Small

Example:
[oss size="small"]
  
  
Usage:  

[oss&nbsp;size="small"]

##### Inline

Example:
[oss type="inline"] this is an example of an inline badge
  
  
Usage:  

[oss&nbsp;type="inline"] this is an example of an inline badge

OSS Content

### Tooltips

#### Options
| Attribute      | Requirement   | Options  |
| -------------- |:-------------:| -----:|
| content            | required      | text to be displayed in tooltip   |

Example:
Copy your existing [tooltip content="This is some content"]config.yaml[/tooltip] and [tooltip content="Tooltip"]ip-detect[/tooltip] files to...
  
  
Usage:  

Copy your existing [tooltip&nbsp;content="This is some content"]config.yaml[/tooltip] and [tooltip&nbsp;content="Tooltip"]ip-detect[/tooltip] files to...
### Support for Image Types and Opening In New Tab

#### Options
| Attribute      | Requirement   | Options  |
| -------------- |:-------------:| -----:|
| src            | required      | url / path to image   |
| srcset         | optional      | img srcset attribute  |
| type           | optional (default: inline) | inline (original size and inline), fill (100% of parent container), fluid (100% of parent container and min-width = original size) |
| alt            | optional      |   text to be displayed if image does not load |
| caption        | optional      |    text to be displayed below image |


##### Inline (original size and inline)

Example:
  
[image src="../docs/1.10/img/auth-login.png" type="inline" alt="Test" caption="Example caption"]

Usage:  

[image&nbsp;src="../docs/1.10/img/auth-login.png" type="inline" alt="Test" caption="Example caption"]

##### Fill (fill 100% of parent container)

Example:
  
[image src="../docs/1.10/img/auth-login.png" type="fill" alt="Test" caption="Example caption"]

Usage:  

[image&nbsp;src="../docs/1.10/img/auth-login.png" type="fill" alt="Test" caption="Example caption"]

##### Fluid (fill 100% of parent container until reaching original size (min-width = original size))

Example:
  
[image src="../docs/1.10/img/auth-login.png" type="fluid" alt="Test" caption="Example caption"]

Usage:  

[image&nbsp;src="../docs/1.10/img/auth-login.png" type="fluid" alt="Test" caption="Example caption"]

Example:

[image srcset="https://www.smashingmagazine.com/wp-content/uploads/2015/06/10-dithering-opt.jpg 1x ../docs/1.10/img/auth-login.png 2x" sizes="(min-width: 36em) 33.3vw, 100vw" src="../docs/1.10/img/auth-login.png" alt="A rad wolf" caption="Example caption" type="inline"]

<!-- [image srcset="app-destroy.png 1x ../docs/1.10/img/auth-login.png 2x" sizes="(min-width: 36em) 33.3vw, 100vw" src="../docs/1.10/img/auth-login.png" alt="A rad wolf" caption="Example caption" type="inline"] -->

### Buttons

#### Options
| Attribute      | Requirement   | Options  |
| -------------- |:-------------:| -----:|
| color          | optional (default: purple) | purple, pink, dark, light|
| size           | optional (default: large) | large, small |


##### Large (default)

Example:
  
  [button color="purple"]Purple[/button]
Usage:  

[button&nbsp;color="purple"]Purple[/button]

Example:
  
  [button color="pink"]Pink[/button]
Usage:  

[button&nbsp;color="pink"]Pink[/button]

Example:
  
  [button color="dark"]Dark[/button]
Usage:  

[button&nbsp;color="dark"]Dark[/button]

Example:
  
  [button color="light"]Light[/button]
Usage:  

[button&nbsp;color="light"]Light[/button]

##### Small
Example:
  
  [button color="purple" size="small"]Purple[/button]
Usage:  

[button&nbsp;color="purple" size="small"]Purple[/button]

Example:
  
  [button color="pink" size="small"]Pink[/button]
Usage:  

[button&nbsp;color="pink" size="small"]Pink[/button]

Example:
  
  [button color="dark" size="small"]Dark[/button]
Usage:  

[button&nbsp;color="dark" size="small"]Dark[/button]

Example:
  
  [button color="light" size="small"]Light[/button]
Usage:  

[button&nbsp;color="light" size="small"]Light[/button]

### Message {data-hide=true}

#### Options
| Attribute      | Requirement   | Options  |
| -------------- |:-------------:| -----:|
| type            | optional      | warning, error, info, success   |
| fill           | optional (default: true) | boolean |

Example:
  
  [message]Test Message[/message]
Usage:  

[message&nbsp;]Test Message[/message]

Example:
  
  [message  type="warning"]Test Message[/message]
Usage:  

[message&nbsp;type="warning"]Test Message[/message]

Example:
  
  [message  type="error"]Test Message[/message]
Usage:  

[message&nbsp;type="error"]Test Message[/message]

Example:
  
  [message  type="info"]Test Message[/message]
Usage:  

[message&nbsp;type="info"]Test Message[/message]

Example:
  
  [message  type="success"]Test Message[/message]
Usage:  

[message&nbsp;type="success"]Test Message[/message]

Example:
  
  [message fill="false"]Test Message[/message]
Usage:  

[message&nbsp;fill="false"]Test Message[/message]

Example:
  
  [message  type="warning" fill="false"]Test Message[/message]
Usage:  

[message&nbsp;type="warning" fill="false"]Test Message[/message]

Example:
  
  [message  type="error" fill="false"]Test Message[/message]
Usage:  

[message&nbsp;type="error" fill="false"]Test Message[/message]

Example:
  
  [message  type="info" fill="false"]Test Message[/message]
Usage:  

[message&nbsp;type="info" fill="false"]Test Message[/message]

Example:
  
  [message  type="success" fill="false"]Test Message[/message]
Usage:  

[message&nbsp;type="success" fill="false"]Test Message[/message]

### Feather Icons {data-hide=true}

#### Options
| Attribute      | Requirement   | Options  |
| -------------- |:-------------:| -----:|
| glyph            | required      | icon to be displayed   |

Example:
[icon glyph="message-square"]
  
  
Usage:  

[icon&nbsp;glyph="message-square"]

All feather icon glyphs are available at [https://feathericons.com](https://feathericons.com)

## Syntax Highlighting

Inline Example

Inline `code` has `back-ticks around` it.

I.E. `` `some inline code` ``

Use three back-ticks for code blocks
Javascript Example

Example:
```javascript
function foo() {
  console.log('bar');
}
```
  
  
Usage:  

````
  ```javascript
    function foo() {
      console.log('bar');
    }
  ```
````


No Language Example

Example:
```
dcos[options][<command>][<args>...]
```
  
  
Usage:  

````
  ```
  dcos[options][<command>][<args>...]
  ```
````

Bash Example

Example:
```bash
dcos[options][<command>][<args>...]
```

````
  ```bash
  dcos[options][<command>][<args>...]
  ```
````

## Tables

Colons can be used to align columns.

Example:
| Tables         | Are           | Cool  |
| -------------- |:-------------:| -----:|
| `--debug`      | right-aligned | $1600 |
| col 3 is       | right-aligned | $1600 |
| col 2 is       | centered      |   $12 |
| zebra stripes  | are neat      |    $1 |
  
  
Usage:  

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

Example:
> Blockquotes are very handy in email to emulate reply text.

> Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
> tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
> quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
> consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
> cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
> proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Quote break.

> This is a very long line that will still be quoted properly when it wraps. Oh boy
  
  
Usage:  

````
> Blockquotes are very handy in email to emulate reply text.

> Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
> tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
> quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
> consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
> cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
> proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Quote break.

> This is a very long line that will still be quoted properly when it wraps. Oh boy
````

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