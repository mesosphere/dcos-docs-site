---
layout: layout.pug
navigationTitle: TPC Options
title: TPC Configuration
menuWeight: 20
excerpt: Configurating TPC for DSE 6.0.2
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
    
**Attention:** Do not tune. We recommend contacting the DataStax Services team before changing this value.

   Default: commented out (number of cores -1)

### tpc_io_cores
    
   The number of tpc_cores to use for asynchronous disk reads.
    
**Attention:** Do not tune. We recommend contacting the DataStax Services team before changing this value.
   
   Default: commented out (min(io_global_queue_depth/4, tpc_cores)
   
### io_global_queue_depth

   Global IO queue depth used for reads when AIO is enabled (the default for SSDs). The optimal queue depth as found with the fio tool for a given disk setup.
   
**Attention:** Do not tune. DataStax recommends contacting the DataStax Services team before changing this value.

   Default: 128

