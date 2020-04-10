---
layout: layout.pug
navigationTitle:  Release Notes for 1.0.1  
title: Release Notes for 1.0.1
menuWeight: 11
beta: false
excerpt: Release notes for Dispatch 1.0.1
---

Dispatch 1.0.1 was released on 9 April, 2020. 

This release of Dispatch includes bug fixes.

[button color="purple" href="https://support.d2iq.com/s/entitlement-based-product-downloads"]Download Dispatch [/button]

- Secrets can now be used to checkout source code residing in a Gitlab repository. (D2IQ-65714)
- Dispatch files no longer produce a parser error if they are greater than 4kB in size. (D2IQ-66701)
- Dispatch now correctly prints line numbers for errors in CUE based Dispatchfiles. (D2IQ-62707) 
