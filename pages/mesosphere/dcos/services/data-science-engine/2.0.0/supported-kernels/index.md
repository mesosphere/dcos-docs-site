---
layout: layout.pug
navigationTitle: Supported Kernels  
excerpt: Using DC/OS Data Science Engine with Kernels
title: Supported Kernels
menuWeight: 7
enterprise: true
model: /mesosphere/dcos/services/data-science-engine/data.yml
render: mustache
---
This section contains examples for using {{ model.techName }}.

# Basic

Perform a default installation by following the instructions in the [Quick Start Guide](/mesosphere/dcos/services/data-science-engine/2.0.0/quick-start/) section.

To run any job, first you have to open the lab and choose the notebook you want to run.
You can select from notebooks available in the lab, for example, Scala, Python, and R.
A Notebook consists of cells; each cell can be of type `markdown` or `code`.
In the `markdown` cell, you can write text or HTML. In the `code` cell, you can type your code as shown in the example below.

## Python Kernel
Open a `Python 3` Notebook and put the following sections in different code cells.

```python
def initMatrix(nrow, ncol):
    mat = []
    counter = 1
    for i in range(0, nrow):
        row = []
        for j in range(0, ncol):
            row.append(counter)
            counter += 1
        mat.append(row)
    return mat
```
```python
def sumMatrix(mat):
    sum = 0
    for row in mat:
        for x in row:
            sum += x
    return sum
```
```python
mat = initMatrix(10, 10)
sum = sumMatrix(mat)
print(sum)
```

## Scala Kernel
Open a `Apache Toree - Scala` Notebook and put the following sections in different code cells.

```scala
def initMatrix(nrow: Int, ncol: Int): Array[Array[Int]] = {
    val mat = Array.ofDim[Int](nrow, ncol)
    var counter = 1
    for(i <- 0 to 9) {
        for(j <- 0 to 9) {
            mat(i)(j) = counter
            counter += 1
        }
    }
    mat
}
```
```scala
def sumMatrix(mat: Array[Array[Int]]): Int = {
    var sum = 0
    for (i <- 0 to 9) {
        for (j <- 0 to 9) {
            sum = sum + mat(i)(j)
        }
    }
    sum
}
```
```scala
val mat = initMatrix(10, 10)
val sum = sumMatrix(mat)
```

## R Kernel
Open an `R` Notebook and put the following in a code cell.

```r
mat <- matrix(data = seq(1, 100, by=1), nrow = 10, ncol = 10)
sum = 0
# calculating sum of all numbers
for (r in 1:nrow(mat)) {
    for(c in 1:ncol(mat)) {
        sum = sum + mat[r,c]
    }
}
print(sum)
```


# Advanced

## Launching a Spark job
### Using Terminal
Open a `Terminal` from the Notebook UI and run an example `spark-submit` job:

```bash
spark-submit --class org.apache.spark.examples.SparkPi http://downloads.mesosphere.com/spark/assets/spark-examples_2.11-2.4.0.jar 100
```

### Using Python Notebook
Open a `Python 3` Notebook and put the following in a code cell:

```python
from __future__ import print_function
import sys
from random import random
from operator import add
from pyspark.sql import SparkSession
```
```python
spark = SparkSession\
        .builder\
        .appName("PythonPi")\
        .getOrCreate()
```
```python
partitions = 2
n = 100000 * partitions
def f(_):
    x = random() * 2 - 1
    y = random() * 2 - 1
    return 1 if x ** 2 + y ** 2 <= 1 else 0
count = spark.sparkContext.parallelize(range(1, n + 1), partitions).map(f).reduce(add)
print("Pi is roughly %f" % (4.0 * count / n))
```
```python
# Shutdown Spark workers
spark.stop()
```

### Using Scala Notebook
Open a `Apache Toree - Scala` Notebook and put the following in a code cell:
```scala
import org.apache.spark.mllib.feature.{HashingTF, IDF}
import org.apache.spark.mllib.linalg.Vector
import org.apache.spark.rdd.RDD
```
```scala
// Load documents (one per line)
val documents: RDD[Seq[String]] =
  sc.textFile("file:///opt/spark/data/mllib/kmeans_data.txt").map(_.split(" ").toSeq)
// Compute the term frequency vector
val hashingTF = new HashingTF()
val tf: RDD[Vector] = hashingTF.transform(documents)
tf.cache()
// First to compute the IDF vector and second to scale the term frequencies by IDF
val idf = new IDF().fit(tf)
val tfidf: RDD[Vector] = idf.transform(tf)
// spark.mllib IDF implementation provides an option for ignoring terms which occur in less than
// a minimum number of documents. In such cases, the IDF for these terms is set to 0.
// This feature can be used by passing the minDocFreq value to the IDF constructor.
val idfIgnore = new IDF(minDocFreq = 2).fit(tf)
val tfidfIgnore: RDD[Vector] = idfIgnore.transform(tf)
```
```scala
println(tfidf.collect()(0))
println(tfidfIgnore.collect()(0))
```
```scala
// Shutdown Spark workers
spark.stop() 
```