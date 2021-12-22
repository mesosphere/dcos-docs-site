---
layout: layout.pug
navigationTitle: Remove a Kommander license
title: Remove a Kommander license
excerpt: Remove licenses for Kommander clusters
menuWeight: 0
beta: false
---

## Remove a license

If your license information has changed, you may need to remove an existing license from Kommander to add a new one. Only Kommander administrators have the ability to remove licenses.

<p class="message--note"><strong>NOTE: </strong>Original license information can still be obtained from D2iQ or the AWS License Manager console even after removing from Kommander.</p>

In the Kommander UI, do the following:

1.  Select **Global** in the workspace header drop-down.

1.  In the sidebar menu, select **Administration** > **Licensing**.

1.  Your existing licenses will be listed. Click **Remove License** on the license you would like to remove, and follow the prompts.

### Manually remove a license using kubectl

To remove a license from Kommander using `kubectl`, you have to delete the `Secret` and `License` objects. In this example, the secret is named "my-license-secret".

1.  Validate that the secret exists in the `kommander` namespace:

    ```bash
    kubectl describe secret -n kommander my-license-secret
    ```

    Expected output:

    ```bash
    Name:         my-license-secret
    Namespace:    kommander
    Labels:       kommanderType=license
    Annotations:  <none>

    Type:         Opaque

    Data
    ====
    jwt:  455 bytes
    ```

1.  Delete the secret from the `kommander` namespace:

    ```bash
    kubectl delete secret -n kommander my-license-secret
    ```

    Expected output:

    ```bash
    secret "my-license-secret" deleted
    ```

1.  We do the same with the `License` object. Validate that it exists in the `kommander` namespace:

    ```bash
    kubectl describe license -n kommander my-license
    ```

    Expected output:

    ```bash
    Name:         my-license
    Namespace:    kommander
    Labels:       <none>
    Annotations:  kubectl.kubernetes.io/last-applied-configuration:
                    {"apiVersion":"kommander.mesosphere.io/v1beta1","kind":"License","metadata":{"annotations":{},"name":"my-license", "namespace":"kommand...
    API Version:  kommander.mesosphere.io/v1beta1
    Kind:         License
    Metadata:
      Creation Timestamp:  2020-03-25T14:57:31Z
      Generate Name:       license-
      Generation:          1
      Resource Version:    17895
      Self Link:           /apis/kommander.mesosphere.io/v1beta1/namespaces/kommander/licenses/my-license
      UID:                 35ee9254-4094-40eb-a2d8-4687c5d212d9
    Spec:
      License Ref:
        Name:  my-license-secret
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

1.  Delete the license from the `kommander` namespace:

    ```bash
    kubectl delete license -n kommander my-license
    ```

    Expected output:

    ```bash
    license.kommander.mesosphere.io "my-license" deleted
    ```

You have now successfully removed a license.

[support-downloads]: https://support.d2iq.com/hc/en-us/articles/4409215222932-Product-Downloads
[support-creds]: https://support.d2iq.com/hc/en-us
