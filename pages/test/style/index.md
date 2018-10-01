---
layout: layout.pug
title: Style Guide
navigationTitle: Style Guide
menuWeight: -1
overviewGrid: true
enterprise: false
---

# Heading Title 1

## Heading Title 2

### Heading Title 3

#### Heading Title 4

##### Heading Title 5

###### Heading Title 6

Test Large
[enterprise]

Test Small
[enterprise size="small"]

Test Inline [enterprise type="inline"] hello world

Test Inline Small [enterprise type="inline" size="small" /]

Test Large
[enterprise type="inline"]

[enterprise]
# dcos_audit_logging
[/enterprise]

[enterprise size="small"]
# dcos_audit_logging
[/enterprise]

[enterprise]
## dcos_audit_logging
[/enterprise]

[enterprise]
### dcos_audit_logging
[/enterprise]

[enterprise size="small"]
#### dcos_audit_logging
[/enterprise]

---
## Notes and Warnings

These styles are configured in /shortcodes/_message.scss.

<p class="message--warning">
This is a warning. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.
</p>
<p class="message--warning-label">
This is a paragraph with a warning-label. I haven't figured out how to get it to display BOTH the label and the background formatting.
</p>
<p class="message--important">
This is an important note. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.
</p>
<p class="message--note">
This is a note. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. 


---
## Numbering steps in a procedure

1. Something
    1. Child
    1. Child
1. Something
    1. Child
    1. Child
1. Something
    1. Child
    1. Child
1. Something
    1. Child
    1. Child


1.  Click a package.
    1. Click **REVIEW & RUN**.

        Some Text

    1. Optionally click [**EDIT**](/1.10/deploying-services/config-universe-service/), customize parameters, and click **REVIEW & RUN**.
    1. Click **RUN SERVICE**.


1.  Click a package.
    1. Click **REVIEW & RUN**.
    1. Optionally click [**EDIT**](/1.10/deploying-services/config-universe-service/), customize parameters, and click **REVIEW & RUN**.
    1. Click **RUN SERVICE**.



* Item 1
    * Item 1
    * Item 2
    * Item 3
* Item 2

    Hello World

* Item 3
* Item 4


1. Item 1
    1. Item 1
    1. Item 2
    1. Item 3
1. Item 2

    Hello World

1. Item 3
1. Item 4


1. Item 1

    1. Item 1

    1. Item 2

    1. Item 3

1. Item 2

    Hello World

1. Item 3

1. Item 4

---

## Unordered List

- Item 1
- Item 2
- Item 3
- Item 4
- Item 5
- Item 6

This is text under a list.

## Ordered List

1. Item 1
2. Item 2
3. Item 3
4. Item 4
5. Item 5
6. Item 6

This is text under a list.

## Definition List (HTML)

<dl>
  <dt>Lower cost</dt>
  <dd>The new version of this product costs significantly less than the previous one!</dd>
  <dt>Easier to use</dt>
  <dd>We've changed the product so that it's much easier to use!</dd>
</dl>