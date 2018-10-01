---
layout: layout.pug
navigationTitle: TPC Options
title: TPC Configuration
menuWeight: 20
excerpt: Configuring Thread Per Core parameters for DSE 6.0.2
featureMaturity:
enterprise: true
model: /services/dse/data.yml
render: mustache
---
# TPC Configuration

## Thread Per Core (TPC) parameters:

```
  #tpc_cores:
    # tpc_io_cores:
    io_global_queue_depth: 128
```

### tpc_cores
    
   Number of TPC event loops. If not set, the default is the number of cores (processors on the machine) minus one.
    
<p class="message--important"><strong>IMPORTANT: </strong>Do not tune. We recommend contacting the DataStax Services team before changing this value.</p>

   Default: commented out (number of cores -1)

### tpc_io_cores
    
   The number of `tpc_cores` to use for asynchronous disk reads.
    
<p class="message--important"><strong>IMPORTANT: </strong>Do not tune. We recommend contacting the DataStax Services team before changing this value.</p> 

   Default: commented out (min(io_global_queue_depth/4, tpc_cores)
   
### io_global_queue_depth

   Global IO queue depth used for reads when AIO is enabled (the default for SSDs). The optimal queue depth as found with the `fio` tool for a given disk setup.
   
<p class="message--important"><strong>IMPORTANT: </strong>Do not tune. We recommend contacting the DataStax Services team before changing this value.</p>

   Default: 128

