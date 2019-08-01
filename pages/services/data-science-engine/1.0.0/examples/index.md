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

Perform a default installation by following the instructions in the [Install and Customize](/services/data-science-engine/1.0.0/install/) section.

To run any job, first you have to open the lab and choose the notebook you want to run.
You can select from many notebooks available in the lab e.g. Scala, Python, R, etc.
Notebook consists of cells and each cell can be of type `markdown` or `code`. 
In the `markdown` cell, you can write text or html. 
In the `code` cell, you can type your code as shown in the example below.
You can also write a notebook by yourself and upload it to the lab to run. 
In the example below, we are going to show notebook written for different kernels available.
You can copy these notebook code and paste it in a file with the extension `.ipynb`. Upload the file to the lab and run it.

## Example of Python Kernel

```json
{
 "cells": [
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "<b>Notebook Example of Python Kernel</b>"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 14,
   "metadata": {},
   "outputs": [],
   "source": [
    "def initMatrix(nrow, ncol):\n",
    "    mat = []\n",
    "    counter = 1\n",
    "    for i in range(0, nrow):\n",
    "        row = []\n",
    "        for j in range(0, ncol):\n",
    "            row.append(counter)\n",
    "            counter += 1\n",
    "        mat.append(row)\n",
    "    return mat"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 15,
   "metadata": {},
   "outputs": [],
   "source": [
    "def sumMatrix(mat):\n",
    "    sum = 0\n",
    "    for row in mat:\n",
    "        for x in row:\n",
    "            sum += x\n",
    "    return sum"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 16,
   "metadata": {},
   "outputs": [
    {
     "name": "stdout",
     "output_type": "stream",
     "text": [
      "5050\n"
     ]
    }
   ],
   "source": [
    "mat = initMatrix(10, 10)\n",
    "sum = sumMatrix(mat)\n",
    "print(sum)"
   ]
  }
 ],
 "metadata": {
  "kernelspec": {
   "display_name": "Python 3",
   "language": "python",
   "name": "python3"
  },
  "language_info": {
   "codemirror_mode": {
    "name": "ipython",
    "version": 3
   },
   "file_extension": ".py",
   "mimetype": "text/x-python",
   "name": "python",
   "nbconvert_exporter": "python",
   "pygments_lexer": "ipython3",
   "version": "3.6.7"
  }
 },
 "nbformat": 4,
 "nbformat_minor": 2
}
```

## Example of Scala Kernel

```json
{
 "cells": [
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "<b>Notebook Example of Scala Kernel</b>"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": null,
   "metadata": {},
   "outputs": [],
   "source": [
    "def initMatrix(nrow: Int, ncol: Int): Array[Array[Int]] = {\n",
    "    val mat = Array.ofDim[Int](nrow, ncol)\n",
    "    var counter = 1\n",
    "    for(i <- 0 to 9) {\n",
    "        for(j <- 0 to 9) {\n",
    "            mat(i)(j) = counter\n",
    "            counter += 1\n",
    "        }\n",
    "    }\n",
    "    mat\n",
    "}"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": null,
   "metadata": {},
   "outputs": [],
   "source": [
    "def sumMatrix(mat: Array[Array[Int]]): Int = {\n",
    "    var sum = 0\n",
    "    for (i <- 0 to 9) {\n",
    "        for (j <- 0 to 9) {\n",
    "            sum = sum + mat(i)(j)\n",
    "        }\n",
    "    }\n",
    "    sum\n",
    "}"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": null,
   "metadata": {},
   "outputs": [],
   "source": [
    "// Initialize a matrix of 10 by 10 with numbers\n",
    "val mat = initMatrix(10, 10)\n",
    "// Adding all the numbers in the matrix\n",
    "val sum = sumMatrix(mat)"
   ]
  }
 ],
 "metadata": {
  "kernelspec": {
   "display_name": "Scala",
   "language": "scala",
   "name": "scala"
  },
  "language_info": {
   "codemirror_mode": "text/x-scala",
   "file_extension": ".scala",
   "mimetype": "",
   "name": "Scala",
   "nbconverter_exporter": "",
   "version": "2.11.12"
  }
 },
 "nbformat": 4,
 "nbformat_minor": 2
}
```

## Example of Java Kernel

```json
{
 "cells": [
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "<b>Notebook example of Java Kernel</b>"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": null,
   "metadata": {},
   "outputs": [],
   "source": [
    "// class to handle matrix\n",
    "class Matrix {\n",
    "    private int[][] mat;\n",
    "    \n",
    "    // constructor to initialize matrix of given number of rows and columns\n",
    "    public Matrix(int row, int col) {\n",
    "        mat = new int[row][col];\n",
    "        int counter = 1;\n",
    "        for(int i = 0; i < row; i++) {\n",
    "            for(int j = 0; j < col; j++) {\n",
    "                mat[i][j] = counter++;\n",
    "            }\n",
    "        }\n",
    "    }\n",
    "    \n",
    "    // finding sum of all the numbers in the matrix\n",
    "    public int sum() {\n",
    "        int sum = 0;\n",
    "        for(int i = 0; i < mat.length; i++) {\n",
    "            for(int j = 0; j < mat[i].length; j++) {\n",
    "                sum += mat[i][j];\n",
    "            }\n",
    "        }\n",
    "        return sum;\n",
    "    }\n",
    "}"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": null,
   "metadata": {},
   "outputs": [],
   "source": [
    "Matrix mat = new Matrix(10, 10);\n",
    "return mat.sum();"
   ]
  }
 ],
 "metadata": {
  "kernelspec": {
   "display_name": "Java",
   "language": "java",
   "name": "java"
  },
  "language_info": {
   "codemirror_mode": "text/x-java",
   "file_extension": ".java",
   "mimetype": "",
   "name": "Java",
   "nbconverter_exporter": "",
   "version": "1.8.0_172"
  }
 },
 "nbformat": 4,
 "nbformat_minor": 2
}
```

## Example of R Kernel

```json
{
 "cells": [
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "<b>Notebook Example of R Kernel</b>"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": null,
   "metadata": {},
   "outputs": [],
   "source": [
    "# creating 10 x 10 matrix\n",
    "mat <- matrix(data = seq(1, 100, by=1), nrow = 10, ncol = 10)\n",
    "sum = 0\n",
    "# calculating sum of all numbers\n",
    "for (r in 1:nrow(mat)) {\n",
    "    for(c in 1:ncol(mat)) {\n",
    "        sum = sum + mat[r,c]\n",
    "    }\n",
    "}\n",
    "print(sum)"
   ]
  }
 ],
 "metadata": {
  "kernelspec": {
   "display_name": "R",
   "language": "R",
   "name": "ir"
  },
  "language_info": {
   "codemirror_mode": "r",
   "file_extension": ".r",
   "mimetype": "text/x-r-source",
   "name": "R",
   "pygments_lexer": "r",
   "version": "3.4.1"
  }
 },
 "nbformat": 4,
 "nbformat_minor": 2
}
```

## Example of Clojure Kernel

```json
{
 "cells": [
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "<b>Notebook example of Clojure Kernel</b>"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": null,
   "metadata": {},
   "outputs": [],
   "source": [
    ";; add numbers from 1 to 100\n",
    "(reduce + (range 1 101 1))"
   ]
  }
 ],
 "metadata": {
  "kernelspec": {
   "display_name": "Clojure",
   "language": "clojure",
   "name": "clojure"
  },
  "language_info": {
   "codemirror_mode": "Clojure",
   "file_extension": ".clj",
   "mimetype": "text/x-clojure",
   "name": "Clojure",
   "nbconverter_exporter": "",
   "version": "1.9.0"
  }
 },
 "nbformat": 4,
 "nbformat_minor": 2
}
```

## Example of Groovy Kernel

```json
{
 "cells": [
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "<b>Notebook example of Groovy Kernel</b>"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": null,
   "metadata": {},
   "outputs": [],
   "source": [
    "// Add numbers from 1 to 100\n",
    "def sum = 0\n",
    "1.upto(100) {\n",
    "    sum = sum + it\n",
    "}\n",
    "sum"
   ]
  }
 ],
 "metadata": {
  "kernelspec": {
   "display_name": "Groovy",
   "language": "groovy",
   "name": "groovy"
  },
  "language_info": {
   "codemirror_mode": "groovy",
   "file_extension": ".groovy",
   "mimetype": "",
   "name": "Groovy",
   "nbconverter_exporter": "",
   "version": "2.4.3"
  }
 },
 "nbformat": 4,
 "nbformat_minor": 2
}
```

## Example of Kotlin Kernel

```json
{
 "cells": [
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "<b>Notebook example of Kotlin Kernel</b>"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": null,
   "metadata": {},
   "outputs": [],
   "source": [
    "// function to initialize matrix\n",
    "fun initMatrix(nrow: Int, ncol: Int): Array<IntArray> {\n",
    "    val mat = Array(nrow, {IntArray(ncol)})\n",
    "    var counter = 1\n",
    "    for(i in 0..9) {\n",
    "        for(j in 0..9) {\n",
    "            mat[i][j] = counter\n",
    "            counter += 1\n",
    "        }\n",
    "    }\n",
    "    return mat\n",
    "}"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": null,
   "metadata": {},
   "outputs": [],
   "source": [
    "// function to add all the elements of matrix\n",
    "fun sumMatrix(mat: Array<IntArray>): Int {\n",
    "    var sum = 0\n",
    "    for(i in 0..9) {\n",
    "        for(j in 0..9) {\n",
    "            sum += mat[i][j]\n",
    "        }\n",
    "    }\n",
    "    return sum\n",
    "}"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": null,
   "metadata": {},
   "outputs": [],
   "source": [
    "val mat = initMatrix(10, 10)\n",
    "val sum = sumMatrix(mat)\n",
    "sum"
   ]
  }
 ],
 "metadata": {
  "kernelspec": {
   "display_name": "Kotlin",
   "language": "kotlin",
   "name": "kotlin"
  },
  "language_info": {
   "codemirror_mode": "kotlin",
   "file_extension": ".kt",
   "mimetype": "",
   "name": "Kotlin",
   "nbconverter_exporter": "",
   "version": "1.2.21"
  }
 },
 "nbformat": 4,
 "nbformat_minor": 2
}
```

# Advanced

## Example of launching Spark Job

```json
{
 "cells": [
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "## This notebook runs simple Spark SparkPi application."
   ]
  },
  {
   "cell_type": "code",
   "execution_count": null,
   "metadata": {},
   "outputs": [],
   "source": [
    "! spark-submit --class org.apache.spark.examples.SparkPi http://downloads.mesosphere.com/spark/assets/spark-examples_2.11-2.4.0.jar 100"
   ]
  }
 ],
 "metadata": {
  "kernelspec": {
   "display_name": "Python 3",
   "language": "python",
   "name": "python3"
  },
  "language_info": {
   "codemirror_mode": {
    "name": "ipython",
    "version": 3
   },
   "file_extension": ".py",
   "mimetype": "text/x-python",
   "name": "python",
   "nbconvert_exporter": "python",
   "pygments_lexer": "ipython3",
   "version": "3.6.7"
  }
 },
 "nbformat": 4,
 "nbformat_minor": 2
}
```
