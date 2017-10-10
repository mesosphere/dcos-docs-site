---
layout: layout.pug
title: Home
navigationTitle: Home
menuWeight: -1
overviewGrid: true
enterprise: false
rss: true
relatedPages:
  - /test/overview
  - /test/api
  - /test/cli
---

# Introduction

DC/OS is a distributed operating system based on the Apache Mesos distributed systems kernel. It enables the management of multiple machines as if they were a single computer. It automates resource management, schedules process placement, facilitates inter-process communication, and simplifies the installation and management of distributed services. Its included web interface and available command-line interface (CLI) facilitate remote management and monitoring of the cluster and its services.

# Shortcodes

*Note: Examples use a `!` prefix for shortcode syntax to disable parsing.*

### Enterprise Tag {data-hide=true}

#### Options

| Attribute      | Requirement               | Options       |
| -------------- |:-------------------------:| -------------:|
| size           | optional (default: large) | large, small  |
| type           | optional (default: block) | block, inline |

###### Usage

```*
[!enterprise]
```

###### Example

[enterprise]

### OSS Tag {data-hide=true}

#### Options

| Attribute      | Requirement               | Options       |
| -------------- |:-------------------------:| -------------:|
| size           | optional (default: large) | large, small  |
| type           | optional (default: block) | block, inline |

###### Usage

```*
[!oss]
```

###### Example

[oss]

### Switch {data-hide=true}

#### Options

##### Case

| Attribute      | Requirement               | Options                            |
| -------------- |:-------------------------:| ----------------------------------:|
| filter         | required                  | text to display and sort by filter |

##### Usage

```*
[!switch]

[!case filter="OSS"]

OSS Content

[/!case]

[!case filter="Enterprise"]

Enterprise Content

[/!case]

[/!switch]
```

##### Example:

[switch]
[case filter="OSS"]
OSS Content
[/case]
[case filter="Enterprise"]
Enterprise Content
[/case]
[/switch]

### SwaggerUI {data-hide=true}

#### Options

| Attribute | Requirement | Options             |
| --------- |:-----------:| -------------------:|
| api       | requires    | path to config file |

##### Usage

```*
[!swagger api="/test/api/marathon.yaml"]
```

##### Example:

[swagger api="/test/api/marathon.yaml"]

### Ngindox {data-hide=true}

#### Options

| Attribute | Requirement | Options             |
| --------- |:-----------:| -------------------:|
| api       | requires    | path to config file |

##### Usage

```*
[!ngindox api="/test/api/marathon.yaml"]
```

##### Example:

[ngindox api="/test/api/nginx.master.yaml"]

### Tooltips {data-hide=true}

#### Options

| Attribute      | Requirement   | Options  |
| -------------- |:-------------:| -----:|
| content            | required      | text to be displayed in tooltip   |

###### Usage:

```*
Copy your existing [!tooltip content="This is some content"]config.yaml[/!tooltip] and [!tooltip content="Tooltip"]ip-detect[/!tooltip] files to...
```

###### Example:

Copy your existing [tooltip content="This is some content"]config.yaml[/tooltip] and [tooltip content="Tooltip"]ip-detect[/tooltip] files to...

### Support for Image Types and Opening In New Tab {data-hide=true}

#### Options

| Attribute      | Requirement                                   | Options                                                                                                                            |
| -------------- |:---------------------------------------------:| ----------------------------------------------------------------------------------------------------------------------------------:|
| src            | required                                      | url / path to image                                                                                                                |
| srcset         | optional                                      | html img srcset attribute                                                                                                          |
| sizes          | optional (required if using srcset attribute) | html img sizes attribute                                                                                                           |
| type           | optional (default: inline)                    | inline (original size and inline), fill (100% of parent container), fluid (100% of parent container and min-width = original size) |
| alt            | optional                                      | text to be displayed if image does not load                                                                                        |
| caption        | optional                                      | text to be displayed below image                                                                                                   |

##### Inline (original size and inline)

###### Usage:

```*
[!image src="../docs/1.10/img/auth-login.png" type="inline" alt="Test" caption="Inline image caption"]
```

###### Example:

[image src="../docs/1.10/img/auth-login.png" type="inline" alt="Test" caption="Inline image caption"]

##### Fill (fill 100% of parent container)

###### Example:

[image src="../docs/1.10/img/auth-login.png" type="fill" alt="Test" caption="Fill image caption"]

###### Usage:
```*
[!image src="../docs/1.10/img/auth-login.png" type="fill" alt="Test" caption="Fill image caption"]
```

##### Fluid (fill 100% of parent container until reaching original size (min-width = original size))

###### Example:

[image src="../docs/1.10/img/auth-login.png" type="fluid" alt="Test" caption="Fluid image caption"]

###### Usage:
```*
[!image src="../docs/1.10/img/auth-login.png" type="fluid" alt="Test" caption="Fluid image caption"]
```

##### srcset and sizes

###### Example:

[image srcset="../docs/1.10/img/app-destroy.png 1x ../docs/1.10/img/auth-login.png 2x" sizes="(min-width: 36em) 33.3vw, 100vw" src="../docs/1.10/img/auth-login.png" alt="A rad wolf" caption="Inline Example using srcset" type="inline"]

###### Usage:
```*
[!image srcset="../docs/1.10/img/app-destroy.png 1x ../docs/1.10/img/auth-login.png 2x" sizes="(min-width: 36em) 33.3vw, 100vw" src="../docs/1.10/img/auth-login.png" alt="A rad wolf" caption="Inline Example using srcset" type="inline"]
```

### Buttons {data-hide=true}

#### Options
| Attribute      | Requirement                | Options                   |
| -------------- |:--------------------------:| -------------------------:|
| type           | optional                   | submit, reset, button     |
| color          | optional (default: purple) | purple, pink, dark, light |
| size           | optional (default: large)  | large, small              |


##### Large (default)

###### Usage:

```*
[!button color="purple"]Purple[/button]
```

###### Example:

[button color="purple"]Purple[/button]

### Message {data-hide=true}

#### Options

| Attribute      | Requirement              | Options                       |
| -------------- |:------------------------:| -----------------------------:|
| type           | optional                 | warning, error, info, success |
| fill           | optional (default: true) | boolean                       |

###### Example:

[message]Test Message[/message]

###### Usage:

```*
[!message]Test Message[/!message]
```

###### Example:

[message type="warning"]Test Message[/message]

###### Usage:

```*
[!message type="warning"]Test Message[/!message]
```

###### Example:

[message  type="error"]Test Message[/message]

###### Usage:

```*
[!message type="error"]Test Message[/!message]
```

###### Example:

[message type="info"]Test Message[/message]

###### Usage:

```*
[!message type="info"]Test Message[/!message]
```

###### Example:

[message  type="success"]Test Message[/message]

###### Usage:

```*
[!message type="success"]Test Message[/!message]
```

###### Example:

[message fill="false"]Test Message[/message]

###### Usage:

```*
[!message fill="false"]Test Message[/!message]
```

###### Example:

[message  type="warning" fill="false"]Test Message[/message]

###### Usage:

```*
[!message type="warning" fill="false"]Test Message[/!message]
```

###### Example:

[message type="error" fill="false"]Test Message[/message]

###### Usage:

```*
[!message type="error" fill="false"]Test Message[/!message]
```

###### Example:

[message  type="info" fill="false"]Test Message[/message]

###### Usage:

```*
[!message type="info" fill="false"]Test Message[/!message]
```

###### Example:

[message  type="success" fill="false"]Test Message[/message]

###### Usage:

```*
[!message type="success" fill="false"]Test Message[/!message]
```

### Feather Icons {data-hide=true}

#### Options

| Attribute        | Requirement   | Options               |
| ---------------- |:-------------:| ---------------------:|
| glyph            | required      | icon to be displayed  |

###### Example:

[icon glyph="message-square"]

###### Usage:

```*
[!icon glyph="message-square"]
```

All feather icon glyphs are available at [https://feathericons.com](https://feathericons.com)

# Syntax Highlighting

Inline Example

Inline `code` has `back-ticks around` it.

I.E. `` `some inline code` ``

Use three back-ticks for code blocks

Follow this link for a full list of <a href="http://prismjs.com/download.html" target="_blank">supported languages</a>

For no language blocks, set language to `*` to display copy button  
IE:  

````*
  ```*
    // some code
  ```
````

Language styling can be found in scss/vendor/_prism.scss

###### Javascript Example:

```javascript
function foo() {
  console.log('bar');
}
```

###### Usage:

````*
  ```javascript
    function foo() {
      console.log('bar');
    }
  ```
````

###### JSON Example:

```json
  {
    "firstName": "foo",
    "lastName": "bar",
  }
```

###### Usage:

````*
  ```json
    {
      "firstName": "foo",
      "lastName": "bar",
    }
  ```
````

###### YAML Example:

```yaml
  # Employee records
  -  martin:
      name: Martin D'vloper
      job: Developer
      skills:
        - python
        - perl
        - pascal
```

###### Usage:

````*
  ```yaml
    # Employee records
    -  martin:
        name: Martin D'vloper
        job: Developer
        skills:
          - python
          - perl
          - pascal
  ```
````

###### XML Example:

```markup
  <?xml version="1.0"?>
  <BCPFORMAT 
  xmlns="http://schemas.microsoft.com/sqlserver/2004/bulkload/format" 
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
    <RECORD>
      <FIELD ID="1" xsi:type="CharTerm" TERMINATOR="\t" 
        MAX_LENGTH="12"/> 
      <FIELD ID="2" xsi:type="CharTerm" TERMINATOR="\t" 
        MAX_LENGTH="20" COLLATION="SQL_Latin1_General_CP1_CI_AS"/>
      <FIELD ID="3" xsi:type="CharTerm" TERMINATOR="\r\n" 
        MAX_LENGTH="30" 
        COLLATION="SQL_Latin1_General_CP1_CI_AS"/>
    </RECORD>
    <ROW>
      <COLUMN SOURCE="1" NAME="age" xsi:type="SQLINT"/>
      <COLUMN SOURCE="2" NAME="firstname" xsi:type="SQLVARYCHAR"/>
      <COLUMN SOURCE="3" NAME="lastname" xsi:type="SQLVARYCHAR"/>
    </ROW>
  </BCPFORMAT>
```

###### Usage:

````*
  ```markup
    <?xml version="1.0"?>
    <BCPFORMAT 
    xmlns="http://schemas.microsoft.com/sqlserver/2004/bulkload/format" 
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
      <RECORD>
        <FIELD ID="1" xsi:type="CharTerm" TERMINATOR="\t" 
          MAX_LENGTH="12"/> 
        <FIELD ID="2" xsi:type="CharTerm" TERMINATOR="\t" 
          MAX_LENGTH="20" COLLATION="SQL_Latin1_General_CP1_CI_AS"/>
        <FIELD ID="3" xsi:type="CharTerm" TERMINATOR="\r\n" 
          MAX_LENGTH="30" 
          COLLATION="SQL_Latin1_General_CP1_CI_AS"/>
      </RECORD>
      <ROW>
        <COLUMN SOURCE="1" NAME="age" xsi:type="SQLINT"/>
        <COLUMN SOURCE="2" NAME="firstname" xsi:type="SQLVARYCHAR"/>
        <COLUMN SOURCE="3" NAME="lastname" xsi:type="SQLVARYCHAR"/>
      </ROW>
    </BCPFORMAT>
  ```
````


###### Bash Example:

```bash
dcos[options][<command>][<args>...]
```

###### Usage:

````*
  ```bash
  dcos[options][<command>][<args>...]
  ```
````

###### PowerShell Example:

```powershell
  Get-Help –Name <Cmdlet name>
```

###### Usage:

````*
  ```powershell
    Get-Help –Name <Cmdlet name>
  ```
````

###### .properties Example
  ```properties
  # This is a comment
  ! This is a comment too
  some_key some_value
  some\ key\ with\ spaces : some value
  some_key = some \
  multiline value
```

###### Usage

````
  ```properties
    # This is a comment
    ! This is a comment too
    some_key some_value
    some\ key\ with\ spaces : some value
    some_key = some \
    multiline value
  ```
````


###### No Language Example:

```*
dcos[options][<command>][<args>...]
```

###### Usage:

````*
  ```*
  dcos[options][<command>][<args>...]
  ```
````


# Tables

Colons can be used to align columns.

###### Example:

| Tables         | Are           | Cool  |
| -------------- |:-------------:| -----:|
| `--debug`      | right-aligned | $1600 |
| col 3 is       | right-aligned | $1600 |
| col 2 is       | centered      |   $12 |
| zebra stripes  | are neat      |    $1 |

###### Usage:

```*
  | Tables         | Are           | Cool  |
  | -------------- |:-------------:| -----:|
  | `--debug`      | right-aligned | $1600 |
  | col 3 is       | right-aligned | $1600 |
  | col 2 is       | centered      |   $12 |
  | zebra stripes  | are neat      |    $1 |
```

# Block Quotes

use ` > ` to denote blockquotes

###### Example:

> Blockquotes are very handy in email to emulate reply text.

> Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
> tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
> quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
> consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
> cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
> proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Quote break.

> This is a very long line that will still be quoted properly when it wraps. Oh boy

###### Usage:

````*
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

___&nbsp;

Underscores

# Forms

###### Example:

<form class="form tall-bottom">
  <div class="form-group">
    <label>First Name</label>
    <input type="text" class="form-control" placeholder="">
  </div>
  <div class="form-group">
    <label>Last Name</label>
    <input type="text" class="form-control" placeholder="">
  </div>
  <div class="form-group">
    <label>Email address</label>
    <input type="email" class="form-control form-control-rounded" placeholder="email@domain.com">
    <p class="form-control-feedback">Please provide a valid email.</p>
  </div>
  <div class="form-group">
    <label>Password</label>
    <input type="password" class="form-control" placeholder="">
    <p class="form-control-feedback">Must include at least 1 number and 1 symbol.</p>
  </div>
  <div class="form-group">
    <label>About Me</label>
    <textarea class="form-control" rows="3"></textarea>
  </div>
  <div class="form-group">
    <label>I am a...</label>
    <label class="form-control-toggle form-control-toggle-custom">
      <input type="radio" name="radio-group-a" checked="checked">
      <span class="form-control-toggle-indicator"></span>
      Man
    </label>
    <label class="form-control-toggle form-control-toggle-custom">
      <input type="radio" name="radio-group-a">
      <span class="form-control-toggle-indicator"></span>
      Woman
    </label>
    <label class="form-control-toggle form-control-toggle-custom">
      <input type="radio" name="radio-group-a">
      <span class="form-control-toggle-indicator"></span>
      Unicorn
    </label>
  </div>
  <div class="btn-container" style="display:flex;justify-content:center;">
    [button type="submit" color="purple"]Submit[/button]
  </div>
</form>

###### Usage:

````markup
  <form class="form tall-bottom">
    <div class="form-group">
      <label>First Name</label>
      <input type="text" class="form-control" placeholder="">
    </div>
    <div class="form-group">
      <label>Last Name</label>
      <input type="text" class="form-control" placeholder="">
    </div>
    <div class="form-group">
      <label>Email address</label>
      <input type="email" class="form-control form-control-rounded" placeholder="email@domain.com">
      <p class="form-control-feedback">Please provide a valid email.</p>
    </div>
    <div class="form-group">
      <label>Password</label>
      <input type="password" class="form-control" placeholder="">
      <p class="form-control-feedback">Must include at least 1 number and 1 symbol.</p>
    </div>
    <div class="form-group">
      <label>About Me</label>
      <textarea class="form-control" rows="3"></textarea>
    </div>
    <div class="form-group">
      <label>I am a...</label>
      <label class="form-control-toggle form-control-toggle-custom">
        <input type="radio" name="radio-group-a" checked="checked">
        <span class="form-control-toggle-indicator"></span>
        Man
      </label>
      <label class="form-control-toggle form-control-toggle-custom">
        <input type="radio" name="radio-group-a">
        <span class="form-control-toggle-indicator"></span>
        Woman
      </label>
      <label class="form-control-toggle form-control-toggle-custom">
        <input type="radio" name="radio-group-a">
        <span class="form-control-toggle-indicator"></span>
        Unicorn
      </label>
    </div>
    <div class="btn-container" style="display:flex;justify-content:center;">
      <button type="submit" color="purple" size="large">Submit</button>
    </div>
  </form>
````