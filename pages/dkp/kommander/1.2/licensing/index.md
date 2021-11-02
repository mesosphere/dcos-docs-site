---
layout: layout.pug
beta: false
navigationTitle: Licensing
title: License
excerpt:
menuWeight: 6
---

## Purchase a License

You can evaluate Kommander running two clusters for free. Kommander cluster plus one additional cluster. If you want to add more clusters, you need a valid license.

To obtain a valid Kommander license, contact your sales representative at <sales@d2iq.com>. After purchase, download the license file from the [support website][support-downloads] using your [login credentials][support-creds] to a place accessible by Kommander.

## Enter a Valid License Key

After you have downloaded the license, an administrator must add it to Kommander.

In the Kommander UI, do the following:

1. Select **Global** in the workspace header drop-down.
2. In the side menu, select **Administration** > **Licensing**.
3. Select **+ Add License**.
4. Paste your license content in the textbox and select **Add**.

![Licenses Form](/dkp/kommander/1.2/img/Licenses-form.png)
Licenses Form

If there is an error submitting the license, you can add the license directly through kubectl using the commands in the message within Kommander.

![Licenses Error](/dkp/kommander/1.2/img/Licenses-error.png)
Licenses Error

## Delete a license

To delete a license from Kommander, you have to delete the `Secret` and `License` objects. In this example, the secret is named "the-secret".

First, validate that the secret exists in the `kommander` namespace: `kubectl describe secret -n kommander the-secret`

Expected output:

```
Name:         the-secret
Namespace:    kommander
Labels:       <none>
Annotations:
Type:         Opaque
Data
====
jwt:  455 bytes
```

Then, delete the secret from the `kommander` namespace: `kubectl delete secret -n kommander the-secret`

Expected output:

```
secret "the-secret" deleted
```

Once this is done, we do the same with the `License` object. First, validate that it exists in the `kommander` namespace: `kubectl describe license -n kommander license-sample`

Expected output:

```
Name:         license-sample
Namespace:    kommander
Labels:       <none>
Annotations:  kubectl.kubernetes.io/last-applied-configuration:
                {"apiVersion":"kommander.mesosphere.io/v1beta1","kind":"License","metadata":{"annotations":{},"name":"license-sample","namespace":"kommand...
API Version:  kommander.mesosphere.io/v1beta1
Kind:         License
Metadata:
  Creation Timestamp:  2020-03-25T14:57:31Z
  Generation:          1
  Resource Version:    17895
  Self Link:           /apis/kommander.mesosphere.io/v1beta1/namespaces/kommander/licenses/license-sample
  UID:                 35ee9254-4094-40eb-a2d8-4687c5d212d9
Spec:
  License Ref:
    Name:  the-secret
Status:
  Cluster Capacity:  500
  Customer Id:       mesosphere-developer
  End Date:          2020-10-02T14:00:09Z
  License Id:        mesosphere-developer
  Start Date:        2019-10-02T14:00:09Z
  Valid:             true
  Version:           1.0
Events:
  Type    Reason                Age                  From              Message
  ----    ------                ----                 ----              -------
  Normal  LicenseUpdateSuccess  7m7s (x2 over 7m7s)  LicenseSignature  License updated successfully
```

Finally, delete the license from the `kommander` namespace: `kubectl delete license -n kommander license-sample`

Expected output:

```
license.kommander.mesosphere.io "license-sample" deleted
```

You have now successfuly deleted a license.

[support-downloads]: https://support.d2iq.com/hc/en-us/articles/4409215222932-Product-Downloads
[support-creds]: https://support.d2iq.com/hc/en-us/
