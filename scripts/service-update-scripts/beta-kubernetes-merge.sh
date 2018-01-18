#!/bin/bash
#
echo "------------------------------"
echo " Merging Beta Kubernetes"
echo "------------------------------"

# Update sort order of index files

for i in $( ls ./pages/services/beta-kubernetes/*/index.md );
do
  awk '/^menuWeight:/ {sub(/[[:digit:]]+$/,$NF+10)}1 {print}' $i > $i.tmp && mv $i.tmp $i
done

# Get values for version and directory variable

version=$1
if [ -z "$1" ]; then echo "Enter a version tag as the first argument."; exit 1; fi
directory=$2
if [ -z "$2" ]; then echo "Enter a directory name as the second argument."; exit 1; fi

# Create directory structure

echo "Creating new directories"
mkdir ./pages/services/beta-kubernetes/$directory
mkdir ./pages/services/beta-kubernetes/$directory/img
echo "New directories created: /pages/services/beta-kubernetes/$directory and /pages/services/beta-kubernetes/$directory/img"

# Move to the top level of the repo

root="$(git rev-parse --show-toplevel)"
cd $root

# pull dcos-kubernetes
git remote rm dcos-kubernetes
git remote add dcos-kubernetes git@github.com:mesosphere/dcos-kubernetes.git
git fetch dcos-kubernetes > /dev/null 2>&1

# checkout each file in the merge list from dcos-kubernetes/master
while read p;
do
  echo $p
  # checkout
  git checkout tags/$version $p
  # markdown files only
  if [ ${p: -3} == ".md" ]; then
        # insert tag ( markdown files only )
    awk -v n=2 '/---/ { if (++count == n) sub(/---/, "---\n\n<!-- This source repo for this topic is https://github.com/mesosphere/dcos-kubernetes -->\n"); } 1{print}' $p > tmp && mv tmp $p
        # remove https://docs.mesosphere.com from links
    awk '{gsub(/https:\/\/docs.mesosphere.com\/1.9\//,"/1.9/");}{print}' $p > tmp && mv tmp $p
    awk '{gsub(/https:\/\/docs.mesosphere.com\/1.10\//,"/1.10/");}{print}' $p > tmp && mv tmp $p
    awk '{gsub(/https:\/\/docs.mesosphere.com\/1.10\//,"/1.11/");}{print}' $p > tmp && mv tmp $p
    awk '{gsub(/https:\/\/docs.mesosphere.com\/latest\//,"/latest/");}{print}' $p > tmp && mv tmp $p
    awk '{gsub(/https:\/\/docs.mesosphere.com\/service-docs\//,"/services/");}{print}' $p > tmp && mv tmp $p

      # add full path for images
    awk -v directory="$directory" '{gsub(/\(img/,"(/services/beta-kubernetes/"directory"/img");}{print;}' $p > tmp && mv tmp $p
    
      # if it's not an index file, make a directory from the filename, rename file to "index.md"
      if [ ${p: -8} != "index.md" ]; then
        directory_from_filename=$p
        tmp_val=$(echo "$directory_from_filename" | sed 's/...$//')
        directory_from_filename=$tmp_val
        mkdir $directory_from_filename
        mv $p $directory_from_filename/index.md
      fi
    
  fi

cp -r docs/package/* ./pages/services/beta-kubernetes/$directory

done <scripts/service-update-scripts/merge-lists/beta-kubernetes-merge-list.txt

git rm -rf docs/
m -rf docs/

# Add version information to latest index file

sed -i '' -e "2s/.*/navigationTitle: Beta Kubernetes $directory/g" ./pages/services/beta-kubernetes/$directory/index.md
sed -i '' -e "2s/.*/title: Beta Kubernetes $directory/g" ./pages/services/beta-kubernetes/$directory/index.md

echo "------------------------------"
echo " Beta Kubernetes merge complete"
echo "------------------------------"
