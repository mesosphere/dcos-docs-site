---
layout: layout.pug
navigationTitle:  带外令牌验证
title: 带外令牌验证
excerpt: 带外验证 DC/OS 认证令牌
render: mustache
model：/mesosphere/dcos/1.13/data.yml
menuWeight: 20
---
<!-- The source repository for this topic is https://github.com/dcos/dcos-docs-site -->

其他服务可使用公钥加密技术代表 [DC/OS 身份和访问管理器(IAM)](/mesosphere/dcos/1.13/overview/architecture/components/#dcos-iam) 组件对传入请求进行身份验证。如果客户端显示的认证令牌已由 IAM 使用其私钥签名，则此方法有效。

## Bouncer JSON Web Key Set (JWKS) 端点
Bouncer 的 JWKS 端点（`/auth/jwks`) 提供验证 Bouncer 发布的 RS256 JWTs 类型签名所需的公匙详细信息。该端点发出的 JSON 文档数据结构符合 [RFC 7517](https://tools.ietf.org/html/rfc7517)。在该数据结构内，公钥根据 [RFC 7518](https://tools.ietf.org/html/rfc7518) 进行参数化。

以下为示例响应：

```json
curl -k https://<host-ip/acs/api/v1/auth/jwks
{
  "keys": [
    {
      "e": "AQAB",
      "use": "sig",
      "n": "7dYvibxUngEyfdut1uSYbRCCP5dT5MQyMfLyy_6o5x8PD-fUMgkm0vGUJAUoKimnkZ85aUmswaU3yAxQiZ8yeaoSpgUR4WJCRhOIEJ6Oyq4mjK06vr9-wJj5gVXDBaqbxD0yhgzMHEDyxg3EFOJ2ve73Vkg4p7pygA4fI_de1Bs6n68Hwt9LJ7B-fPg0PU8IdPe_4dYNuHT09KGxWSlq3m4KSvNxPIGQ8nNK9H3gjQaoBT9-hDXfsAgrQo7GenXRZTYW13KATtRAR5Vtd177iEeVefbK3HRj9IfYjYPnlBP2CZv_YIK-9H_33JPXxlDTFgI92l_JKRF-fPSa1EEkIw",
      "alg": "RS256",
      "kid": "49f795b26f80bec01f44b0f52e6ba6459ee2048fbb342f861f1a4e8ed4ebcb7f",
      "kty": "RSA"
    }
  ]
}
```

## 从 JWKS 数据构建公钥
完全定义 RSA 公钥的两个参数是模数 (`n`)和指数 (`e`)。两个均为使用 Base64 编码的整数，如 [RFC 7518] 中所述(https://tools.ietf.org/html/rfc7518#section-6.3)

使用您选择的工具生成验证认证令牌所需的公钥表示。

这是基于加密模块的 Python 示例（使用 OpenSSL 作为其后端）。此示例直接从给定指数和模数生成公钥对象。

```python
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives.asymmetric import rsa

# `modulus_int` and `exponent_int` are the two parameters defining
# an RSA public key. These are objects of type `int`.
public_numbers = rsa.RSAPublicNumbers(n=modulus_int, e=exponent_int)
public_key = public_numbers.public_key(backend=default_backend())
```

## 使用公钥验证认证令牌
本示例使用 Python [PyJWT 模块](https://pyjwt.readthedocs.io/en/latest/)、认证令牌验证和用户 ID 的提取：

```python
# `token` is the string holding the authentication token.
# `public_key` is an RSA public key object of the cryptography module.
payload = jwt.decode(token, public_key, algorithm='RS256')
uid = payload['uid']
```

解码方法验证令牌签名和到期时间，并在令牌无效时引发异常。

## 完成令牌验证示例
此示例验证认证令牌。以下是示例令牌

```json
eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJleHAiOjE0Njc5ODU0NjYsInVpZCI6InBldGVyIn0.lsLJx2WsX99HF96CizMOcZpMIgbjGDBHvFZCGeNDsM-xZQzHQJHo_UA8WodQ52o8uBJ2CY983DhJdIH2Gfc_fbZtYGvUx-IvQnHFbUBd8qBN0A_4BQHeNINFUKdVQuJsbsW-uVj-w0q3RAFwO5DPPc2ppwIjkeQbgGP1ZN-2-uV6Jow04cdkq4jcODsD1y0v4EmIBPLQil0HU2B95IHtlBNN7haTUkCksXE-43BHy4ErboySeq6VgkwLpw_Pi8n236kZ2-GobSmhA-BpjbkO3uGLHrYUfJjrJyiPM2_PZQMHY80-m5sMMMQ9m1Ciag2Cw74JKGfJ3qMW3j3z2Hm7GQ
```

以下是用于执行验证的 Python 代码，遵循上面给出的说明：

```python
>>> import jwt
>>> import requests
>>> from cryptography.hazmat.backends import default_backend
>>> from cryptography.hazmat.primitives.asymmetric import rsa
>>> from jwt.utils import base64url_decode, bytes_to_number

>>> keys = requests.get('http://localhost:8101/acs/api/v1/auth/jwks').json()['keys'][0]
>>> keys
{'kty': 'RSA', 'n': 'sybUYxu3TXxXAgG_Eq72tKxE7xhGFgL14g5OGryDtE5dBL8frAoSsI4D7tSKR2pLbOlT68YJbYLUHxoju0E_NB9htjKEsay4t3WXoXQ-XsDM4Zz22H6HfDG6CCcvGb2DoQP0R2je1HJDA56_BoR8shZMxHbrX1WgQURtGygMD7bQY95qmHZYRPlq13-pR5Jnu70OMmFlbl-_o-ag1JfndTJPtx75IalCgy_h_itHLDPhdTfypAJeiewCOUZd9nNa1j19M-xeqlZonlRABqiH0e-vQVWCeW5FZ0HJamIjd2VifhRCp0fSAgCdCQdrY6HdI3h6egpn6z4gwkwXBfczww', 'kid': '55fb61042768f62ea3b06778c6043f7c8c92769a0c248076a2995dfd50c4acb9', 'use': 'sig', 'alg': 'RS256', 'e': 'AQAB'}

>>> exponent_bytes = base64url_decode(keys['e'].encode('ascii'))
>>> exponent_int = bytes_to_number(exponent_bytes)

>>> modulus_bytes = base64url_decode(keys['n'].encode('ascii'))
>>> modulus_int = bytes_to_number(modulus_bytes)

>>> public_numbers = rsa.RSAPublicNumbers(n=modulus_int, e=exponent_int)
>>> public_key = public_numbers.public_key(backend=default_backend())

>>> authtoken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJleHAiOjE0Njc5ODU0NjYsInVpZCI6InBldGVyIn0.lsLJx2WsX99HF96CizMOcZpMIgbjGDBHvFZCGeNDsM-xZQzHQJHo_UA8WodQ52o8uBJ2CY983DhJdIH2Gfc_fbZtYGvUx-IvQnHFbUBd8qBN0A_4BQHeNINFUKdVQuJsbsW-uVj-w0q3RAFwO5DPPc2ppwIjkeQbgGP1ZN-2-uV6Jow04cdkq4jcODsD1y0v4EmIBPLQil0HU2B95IHtlBNN7haTUkCksXE-43BHy4ErboySeq6VgkwLpw_Pi8n236kZ2-GobSmhA-BpjbkO3uGLHrYUfJjrJyiPM2_PZQMHY80-m5sMMMQ9m1Ciag2Cw74JKGfJ3qMW3j3z2Hm7GQ"
>>> payload = jwt.decode(authtoken, public_key, algorithm='RS256')
>>> payload
{'uid': 'peter', 'exp': 1467985466}
```

响应表示这是 `peter` 的有效认证令牌。
