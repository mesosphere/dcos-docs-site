---
layout: layout.pug
navigationTitle: Continuous Paging Options
title: Continuous Paging
menuWeight: 20
excerpt: Configuring Continuous Paging for DSE 6.0.2
featureMaturity:
enterprise: true
model: /services/dse/data.yml
render: mustache
---

# Continuous Paging Configuration template

Options to tune continuous paging that pushes pages, when requested, continuously to the client:

   Maximum memory used:

      max_concurrent_sessions ⨉ max_session_pages ⨉ max_page_size_mb

   Default: calculated (60 ⨉ 4 ⨉ 8 = 1920 MB)

**Guidance**

   - Because memtables and SSTables are used by the continuous paging query, you can define the maximum period of time during which memtables cannot be flushed and compacted SSTables cannot be deleted.
   
   - If fewer threads exist than sessions, a session cannot execute until another one is swapped out.
   
   - Distributed queries (CL > ONE or non-local data) are swapped out after every page, while local queries at CL = ONE are swapped out after `max_local_query_time_ms`.

**Template:**

```
continuous_paging:
    max_concurrent_sessions: 60
    max_session_pages: 4
    max_page_size_mb: 8
    max_local_query_time_ms: 5000
    client_timeout_sec: 600
    cancel_timeout_sec: 5
    paused_check_interval_ms: 1
```

### max_concurrent_sessions
   
   The maximum number of concurrent sessions. Additional sessions are rejected with an unavailable error.

   Default value is 60.
   
### max_session_pages

   The maximum number of pages that can be buffered for each session. If the client is not reading from the socket, the producer thread is blocked after it has prepared max_session_pages.

   Default value is 4.

### max_page_size_mb
    
   The maximum size of a page, in MB. If an individual CQL row is larger than this value, the page can be larger than this value.

   Default value is 8.
   
### max_local_query_time_ms
    
   The maximum time for a local continuous query to run. When this threshold is exceeded, the session is swapped out and rescheduled. Swapping and rescheduling ensures the release of resources that prevent the memtables from flushing and ensures fairness when max_threads < max_concurrent_sessions. Adjust when high write workloads exist on tables that have continuous paging requests.

   Default value is 5000.

### Below are the options that are added new as per the DataStax Enterprise version 6.0.2

### client_timeout_sec

   How long the server will wait, in seconds, for clients to request more pages if the client is not reading and the server queue is full.

   Default value is 600.
   
### cancel_timeout_sec
   
   How long to wait before checking if a paused session can be resumed. Continuous paging sessions are paused because of backpressure or when the client has not request more pages with backpressure updates.

   Default value is 5.
   
### paused_check_interval_ms

   How long to wait, in milliseconds, before checking if a continuous paging sessions can be resumed, when that session is paused because of backpressure.

   Default value is 1.
