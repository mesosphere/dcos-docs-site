---
layout: layout.pug
navigationTitle: Patching
title: Patching
menuWeight: 20
excerpt:
---

# Patching live clusters with no downtime

A DC/OS patch describes a set of changes and supporting data designed to update, fix, or improve the features/functionality of DC/OS. A point release that consists of minor changes is also called a patch.

A patching process includes the following:
- Addresses fixed issues, known issues/limitations, notable changes and security enhancements.
- Does not impact workloads which is an essential piece of patching live clusters with no downtime.
- Helps users to understand the minor changes impacting the functionality of DC/OS.

Example: DC/OS 1.X.A to 1.X.B (1.10.1 --> 1.10.2)

**Note:** A patching process occurs only between minor releases.


## Supported patching path matrix
 The following matrix table lists the patching paths for DC/OS 1.10.

**DC/OS minor versions for DC/OS 1.10**


|**Display Icon** | **Service** |
|---------- | ------- |
| ⚫| Supported |
| ◯| Not Supported |

<table class="table">
    <tr>
    <th><p style="text-align: center;"><strong>Patch From</strong></p></th>
    <th></th>
    <th></th>
    <th></th>
    <th></th>
    <th><p style="text-align: center;"><strong>Patch To</strong></p></th>
    <th></th>
    <th></th>
    <th></th>
    </tr>
    <tr>
    <th></th>
    <th><p style="text-align: center;">1.10.1</p></th>
    <th><p style="text-align: center;">1.10.2</p></th>
    <th><p style="text-align: center;">1.10.3</p></th>
    <th><p style="text-align: center;">1.10.4</p></th>
    <th><p style="text-align: center;">1.10.5</p></th>
    <th><p style="text-align: center;">1.10.6</p></th>
    <th><p style="text-align: center;">1.10.7</p></th>
    <th><p style="text-align: center;">1.10.8</p></th>
    </tr>
    <tr>
       <td><p style="text-align: center;">1.10.0</p></td>
       <td><p style="text-align: center;">⚫</p></td>
       <td><p style="text-align: center;">◯</p></td>
       <td><p style="text-align: center;">◯</p></td>
       <td><p style="text-align: center;">⚫</p></td>
       <td><p style="text-align: center;">⚫</p></td>
       <td><p style="text-align: center;">⚫</p></td>
       <td><p style="text-align: center;">⚫</p></td>
       <td><p style="text-align: center;">⚫</p></td>
    </tr>
    <tr>
       <td><p style="text-align: center;">1.10.1</p></td>
       <td><p style="text-align: center;">◯</p></td>
       <td><p style="text-align: center;">⚫</p></td>
       <td><p style="text-align: center;">⚫</p></td>
       <td><p style="text-align: center;">⚫</p></td>
       <td><p style="text-align: center;">⚫</p></td>
       <td><p style="text-align: center;">⚫</p></td>
       <td><p style="text-align: center;">⚫</p></td>
       <td><p style="text-align: center;">⚫</p></td>
    </tr>
    <tr>
       <td><p style="text-align: center;">1.10.2</p></td>
       <td><p style="text-align: center;">◯</p></td>
       <td><p style="text-align: center;">◯</p></td>
       <td><p style="text-align: center;">⚫</p></td>
       <td><p style="text-align: center;">⚫</p></td>
       <td><p style="text-align: center;">⚫</p></td>
       <td><p style="text-align: center;">⚫</p></td>
       <td><p style="text-align: center;">⚫</p></td>
       <td><p style="text-align: center;">⚫</p></td>
    </tr>
      <td><p style="text-align: center;">1.10.3</p></td>
      <td><p style="text-align: center;">◯</p></td>
      <td><p style="text-align: center;">◯</p></td>
      <td><p style="text-align: center;">◯</p></td>
      <td><p style="text-align: center;">⚫</p></td>
      <td><p style="text-align: center;">⚫</p></td>
      <td><p style="text-align: center;">⚫</p></td>
      <td><p style="text-align: center;">⚫</p></td>
      <td><p style="text-align: center;">⚫</p></td>
    </tr>
    </tr>
      <td><p style="text-align: center;">1.10.4</p></td>
      <td><p style="text-align: center;">◯</p></td>
      <td><p style="text-align: center;">◯</p></td>
      <td><p style="text-align: center;">◯</p></td>
      <td><p style="text-align: center;">◯</p></td>
      <td><p style="text-align: center;">⚫</p></td>
      <td><p style="text-align: center;">⚫</p></td>
      <td><p style="text-align: center;">⚫</p></td>
      <td><p style="text-align: center;">⚫</p></td>
    </tr>
    </tr>
      <td><p style="text-align: center;">1.10.5</p></td>
      <td><p style="text-align: center;">◯</p></td>
      <td><p style="text-align: center;">◯</p></td>
      <td><p style="text-align: center;">◯</p></td>
      <td><p style="text-align: center;">◯</p></td>
      <td><p style="text-align: center;">◯</p></td>
      <td><p style="text-align: center;">⚫</p></td>
      <td><p style="text-align: center;">⚫</p></td>
      <td><p style="text-align: center;">⚫</p></td>
    </tr>
     </tr>
      <td><p style="text-align: center;">1.10.6</p></td>
      <td><p style="text-align: center;">◯</p></td>
      <td><p style="text-align: center;">◯</p></td>
      <td><p style="text-align: center;">◯</p></td>
      <td><p style="text-align: center;">◯</p></td>
      <td><p style="text-align: center;">◯</p></td>
      <td><p style="text-align: center;">◯</p></td>
      <td><p style="text-align: center;">⚫</p></td>
      <td><p style="text-align: center;">⚫</p></td>
    </tr>
    </tr>
      <td><p style="text-align: center;">1.10.7</p></td>
      <td><p style="text-align: center;">◯</p></td>
      <td><p style="text-align: center;">◯</p></td>
      <td><p style="text-align: center;">◯</p></td>
      <td><p style="text-align: center;">◯</p></td>
      <td><p style="text-align: center;">◯</p></td>
      <td><p style="text-align: center;">◯</p></td>
      <td><p style="text-align: center;">◯</p></td>
      <td><p style="text-align: center;">⚫</p></td>
    </tr>
 </table>   


There are no specific instructions for patching since it occurs as a part of the release. Refer to [Upgrading instructions](/1.10/installing/production/upgrading/#instructions) for upgrading DC/OS.
