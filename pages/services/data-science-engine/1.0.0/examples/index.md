---
layout: layout.pug
navigationTitle: Examples
excerpt: Usage examples
title: Examples
menuWeight: 7
model: /services/data-science-engine/data.yml
render: mustache
---
This section contains examples for using {{ model.techName }}.

# Basic

Perform a default installation by following the instructions in the [Quick Start Guide](/services/data-science-engine/1.0.0/quick-start/) section.

To run any job, first you have to open the lab and choose the notebook you want to run.
You can select from many notebooks available in the lab, for example, Scala, Python, R, and so forth.
Notebook consists of cells; each cell can be of type `markdown` or `code`. 
In the `markdown` cell, you can write text or html. In the `code` cell, you can type your code as shown in the example below.

## Python Kernel
Open a `Python Notebook` and put the following sections in a different code cells.

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
Open a `Scala Notebook` and put the following sections in different code cells.

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

## Java Kernel
Open a `Java Notebook` and put the following sections in different code cells.

```java
class Matrix {
    private int[][] mat;
    
    // constructor to initialize matrix of given number of rows and columns
    public Matrix(int row, int col) {
        mat = new int[row][col];
        int counter = 1;
        for(int i = 0; i < row; i++) {
            for(int j = 0; j < col; j++) {
                mat[i][j] = counter++;
            }
        }
    }
    
    // finding sum of all the numbers in the matrix
    public int sum() {
        int sum = 0;
        for(int i = 0; i < mat.length; i++) {
            for(int j = 0; j < mat[i].length; j++) {
                sum += mat[i][j];
            }
        }
        return sum;
    }
}
```
```java
Matrix mat = new Matrix(10, 10);
return mat.sum();
```

## R Kernel
Open an `R Notebook` and put the following sections in different code cells.

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

## Clojure Kernel
Open a `Clojure Notebook` and put the following sections in different code cells.

```clojure
;; add numbers from 1 to 100
(reduce + (range 1 101 1))
```

## Groovy Kernel
Open a `Groovy Notebook` and put the following sections in different code cells.

```groovy
def sum = 0
1.upto(100) {
    sum = sum + it
}
sum
```

## Kotlin Kernel
Open a `Kotlin Notebook` and put the following sections in different code cells.

```kotlin
fun initMatrix(nrow: Int, ncol: Int): Array<IntArray> {
    val mat = Array(nrow, {IntArray(ncol)})
    var counter = 1
    for(i in 0..9) {
        for(j in 0..9) {
            mat[i][j] = counter
            counter += 1
        }
    }
    return mat
}
```
```kotlin
fun sumMatrix(mat: Array<IntArray>): Int {
    var sum = 0
    for(i in 0..9) {
        for(j in 0..9) {
            sum += mat[i][j]
        }
    }
    return sum
}
```
```kotlin
val mat = initMatrix(10, 10)
val sum = sumMatrix(mat)
sum
```

# Advanced

## Launching a Spark job
### Using Terminal
Open a `Terminal` from Notebook UI and run example `spark-submit` job:

```bash
spark-submit --class org.apache.spark.examples.SparkPi http://downloads.mesosphere.com/spark/assets/spark-examples_2.11-2.4.0.jar 100
```

### Using Python Notebook
Open a `Python Notebook` and put the following code in a code cell.

```python
from __future__ import print_function

import sys
from random import random
from operator import add

from pyspark.sql import SparkSession

spark = SparkSession\
        .builder\
        .appName("PythonPi")\
        .getOrCreate()

partitions = 2
n = 100000 * partitions

def f(_):
    x = random() * 2 - 1
    y = random() * 2 - 1
    return 1 if x ** 2 + y ** 2 <= 1 else 0

count = spark.sparkContext.parallelize(range(1, n + 1), partitions).map(f).reduce(add)
print("Pi is roughly %f" % (4.0 * count / n))

spark.stop
```
