---
layout: layout.pug
navigationTitle:  Configure Task Handling
title: Configure Task Handling
menuWeight: 0
excerpt: Configuring Marathon for unreachable tasks
render: mustache
model: /1.14/data.yml
enterprise: false
---



You can configure Marathon's actions on unreachable tasks. The `unreachableStrategy` parameter of your app or pod definition allows you to configure this in two ways: by defining when a new task instance should be launched, and by defining when a task instance should be expunged.

```json
"unreachableStrategy": {
	"inactiveAfterSeconds": "<integer>",
	"expungeAfterSeconds": "<integer>"
}
```

## Configuration Options

- `inactiveAfterSeconds`: If a task instance is unreachable for longer than this value, it is marked inactive and a new instance will launch. At this point, the unreachable task is not yet expunged. The default value is 0 seconds.

- `expungeAfterSeconds`: If an instance is unreachable for longer than this value, it will be expunged. An expunged task will be killed if it ever comes back. Instances are usually marked as unreachable before they are expunged, but that is not required. This value is required to be greater than `inactiveAfterSeconds` unless both are zero. If the instance has any persistent volumes associated with it, then they will be destroyed and associated data will be deleted. The default value is 0 seconds.

You can use `inactiveAfterSeconds` and `expungeAfterSeconds` in conjunction with one another. For example, if you configure `inactiveAfterSeconds = 60` and `expungeAfterSeconds = 120`, a task instance will be expunged if it has been unreachable for more than 120 seconds and a second instance will be started if it has been unreachable for more than 60 seconds.

## Kill Selection
You call also define a kill selection to declare whether Marathon kills the youngest or oldest tasks first when rescaling or otherwise killing multiple tasks. The default value for this parameter is `YoungestFirst`. You can also specify `OldestFirst`.

Add the `killSelection` parameter to your app definition, or to the `PodSchedulingPolicy` parameter of your pod definition.

```json
{
    "killSelection": "YoungestFirst"
}
```

## Persistent Volumes

The default `unreachableStrategy` for apps with persistent volumes will create new instances with new volumes and delete existing volumes (if possible) after an instance has been unreachable for longer than 7 days and has been expunged by Marathon.

<p class="message--warning"><strong>WARNING: </strong>Data may be deleted when the existing volumes of an unreachable instance are deleted.</p>

