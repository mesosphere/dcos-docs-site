---
layout: layout.pug
navigationTitle: 管理 JSON Web 令牌
title: 管理 JSON Web 令牌
menuWeight: 200
excerpt: 管理 JSON Web 令牌

enterprise: true
---
<!-- The source repository for this topic is https://github.com/dcos/dcos-docs-site -->

# 刷新令牌
服务可以使用各种方式刷新其令牌。理想情况下，服务应计算令牌到期之前的时间长度，该时间长度嵌入令牌本身，并在它到期之前请求新的令牌。但是，服务也可以等待，直到其收到 `401` 以请求新令牌。

您可能需要使用服务帐户配置服务，具体取决于您的 [安全模式](/cn/1.11/security/ent/#security-modes) 以及服务请求的来源。

API 使用者应能够在当前认证令牌到期时处理。

- **过期后续订** 使用此方法，您会在收到“无效令牌”响应后获取新的认证令牌。使用 401 HTTP 状态代码响应无效认证令牌，并且该服务重新调用服务帐户登录程序。尝试获取新的认证令牌（通过重试和后退）。在服务没有有效认证令牌的期间，服务可能需要暂停操作，从而导致延迟峰值。
- **到期前续订** 使用此方法，令牌将在到期前刷新。服务可以在到期之前安排异步令牌续订。它可以获取新的认证令牌，而旧的认证令牌仍然有效。这可防止由过期认证令牌引起的延迟峰值。

# RS256 身份认证 JWT 带外验证
DC/OS 服务可使用公钥加密技术代表 [DC/OS Identity and Access Manager (Bouncer)](/cn/1.11/overview/architecture/components/#dcos-iam) 组件对传入请求进行身份认证。如果客户端显示的认证令牌已由 Bouncer 使用 Bouncer 的验证序号和 RS256 算法签名，则此方法有效。

## Bouncer JSON Web Key Set (JWKS) 端点
Bouncer 的 JWKS 端点（`/auth/jwks`) 提供验证 Bouncer 发布的 RS256 JWTs 类型签名所需的公共验证序号详细信息。该端点发出的 JSON 文档数据结构符合 [RFC 7517](https://tools.ietf.org/html/rfc7517)。在该数据结构内，公钥根据 [RFC 7518](https://tools.ietf.org/html/rfc7518) 进行参数化。

以下为示例响应：

```json
curl localhost:8101/acs/api/v1/auth/jwks
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

## 从 JWKS 数据构建公共验证序号
完全定义 RSA 公钥的两个参数是模数 (`n`)和指数 (`e`)。两者均为整数。在上一个示例中，指数参数以 `e` 的值编码，模数以 `n` 的值编码。

整数是“Base64urLuInt”编码。此编码由 [RFC 7518] 指定(https://tools.ietf.org/html/rfc7518#section-6.3)：

<blockquote>将正整数值或零的值表示为值的无符号大端表示的 base64url 编码作为八位字节序列。八位字节序列 **必须**使用代表值所需的最小八位字节数。零表示为 BASE64URL（单个零值八位字节），即“AA”。</blockquote>

例如，值 `AQAB` 表示 65537。

使用您选择的工具生成验证认证令牌所需的公共验证序号表示。这是基于加密模块的 Python 示例（使用 OpenSSL 作为其后端）。此示例直接从给定指数和模数生成公共验证序号对象。

```python
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives.asymmetric import rsa

# `modulus_int` and `exponent_int` are the two parameters defining
# an RSA public key. These are objects of type `int`.
public_numbers = rsa.RSAPublicNumbers(n=modulus_int, e=exponent_int)
public_key = public_numbers.public_key(backend=default_backend())
```

## 使用公共验证序号验证认证令牌
本示例使用 Python [PyJWT 模块](https://pyjwt.readthedocs.io/en/latest/)、认证令牌验证和用户 ID 的提取：

```python
# `token` is the string holding the authentication token.
# `public_key` is an RSA public key object of the cryptography module.
payload = jwt.decode(token, public_key, algorithm='RS256')
uid = payload['uid']
```

解码方法验证令牌签名和到期时间，并在令牌无效时引发异常。

## 完成令牌验证示例
此示例使认证令牌 (RS256 JWT) 失效。以下是示例令牌

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
