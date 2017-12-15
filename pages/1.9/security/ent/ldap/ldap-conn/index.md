---
layout: layout.pug
navigationTitle:  Configuring the LDAP connection
title: Configuring the LDAP connection
menuWeight: 1
excerpt: >
  First, you specify the address,
  protocol, and certificates to be used to
  connect to the LDAP server.
preview: true
enterprise: true
---


1.  Click on the **Settings** -> **Organization** -> **External Directory** tab.

1.  Click **Add Directory**.

   ![Add Directory dialog](/1.9/img/ldap-add-dir-conn.png)
 
1.  Type the host name or IP address of the LDAP directory server in the **Host** box. 

    **Tip**: Do not include the protocol prefix or port number. 

1.  Type the TCP/IP port number to use in the **Port** box. 

    **Tip**: Port `389` is usually used for StartTLS and unencrypted communications. Port `636` is often used for LDAPS connections.

1. Select your preferred encryption option from the **Select SSL/TLS setting** list box. 

    * Select the **Use SSL/TLS for all connections** check box to use [Secure LDAP (LDAPS)](http://social.technet.microsoft.com/wiki/contents/articles/2980.ldap-over-ssl-ldaps-certificate.aspx). 

    * Select **Attempt StartTLS, abort if it fails** to attempt to upgrade the connection to TLS via [StartTLS](https://tools.ietf.org/html/rfc2830) and abort the connection should the upgrade to TLS fail.

    * Select **Attempt StartTLS, proceed unencrypted if it fails** to attempt to upgrade the connection to TLS via [StartTLS](https://tools.ietf.org/html/rfc2830) and continue the connection unencrypted if the upgrade to TLS fail.

    **Tip:** We recommend either **Use SSL/TLS for all connections** or **Attempt StartTLS, abort if it fails** to ensure either SSL/TLS or StartTLS encryption; otherwise the password is sent in the clear.
    
1. If the LDAP directory server requires DC/OS to present a [client certificate](https://tools.ietf.org/html/rfc5246#section-7.4.6), paste it into the **Client certificate and private key (Optional)** field. The value should look similar to the following.

    ```
    -----BEGIN PRIVATE KEY-----
    MIIDtDCCApy...
    -----END PRIVATE KEY-----
    -----BEGIN CERTIFICATE-----
    OIymBpP...
    -----END CERTIFICATE-----
    ```

1. To ensure that your DC/OS cluster does not accept connections from parties other than the designated LDAP directory server, paste the root CA certificate of the LDAP directory server and any intermediate certificates in the **CA certificate chain (Optional)** field. We highly recommend completing this step to establish a secure communication channel with the LDAP directory server.

1.  Specify your authentication method and parameters, as discussed in the [next section](/1.9/security/ent/ldap/ldap-auth/).
