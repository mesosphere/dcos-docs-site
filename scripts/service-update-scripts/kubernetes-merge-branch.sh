#!/bin/bash

# sed needs different args to -i depending on the flavor of the tool that is installed
sedi () {
    sed --version >/dev/null 2>&1 && sed -i -- "$@" || sed -i "" "$@"
}

echo "------------------------------"
echo " Merging Kubernetes"
echo "------------------------------"

# Get values for branch and directory variable

branch=$1
if [ -z "$1" ]; then echo "Enter a branch as the first argument."; exit 1; fi
directory=$2
if [ -z "$2" ]; then echo "Enter a directory name as the second argument."; exit 1; fi

# Create directory structure

echo "Creating new directories"
mkdir -p ./pages/services/kubernetes/$directory
mkdir -p ./pages/services/kubernetes/$directory/img
echo "New directories created: pages/services/kubernetes/$directory and pages/services/kubernetes/$directory/img"

# Move to the top level of the repo

root="$(git rev-parse --show-toplevel)"
cd $root

# pull dcos-kubernetes
git remote rm dcos-kubernetes
git remote add dcos-kubernetes git@github.com:mesosphere/dcos-kubernetes.git
git fetch dcos-kubernetes > /dev/null 2>&1

# checkout
git checkout dcos-kubernetes/$branch docs/package

# checkout each file in the merge list from dcos-kubernetes/master
for p in `find docs/package -type f`; do
  echo $p
  # markdown files only
  if [ ${p: -3} == ".md" ]; then
    # remove any dodgy control characters - sometimes copied in from commands
    sedi -e 's/ *//g' $p

    # insert tag ( markdown files only )
    awk -v n=2 '/---/ { if (++count == n) sub(/---/, "---\n\n<!-- This source repo for this topic is https://github.com/mesosphere/dcos-kubernetes -->\n"); } 1{print}' $p > tmp && mv tmp $p
    # remove https://docs.mesosphere.com from links
    awk '{gsub(/https:\/\/docs.mesosphere.com\/1.9\//,"/1.9/");}{print}' $p > tmp && mv tmp $p
    awk '{gsub(/https:\/\/docs.mesosphere.com\/1.10\//,"/1.10/");}{print}' $p > tmp && mv tmp $p
    awk '{gsub(/https:\/\/docs.mesosphere.com\/1.10\//,"/1.11/");}{print}' $p > tmp && mv tmp $p
    awk '{gsub(/https:\/\/docs.mesosphere.com\/latest\//,"/latest/");}{print}' $p > tmp && mv tmp $p
    awk '{gsub(/https:\/\/docs.mesosphere.com\/service-docs\//,"/services/");}{print}' $p > tmp && mv tmp $p

    # add full path for images
    awk -v directory="$directory" '{gsub(/\(img/,"(/services/kubernetes/"directory"/img");}{print;}' $p > tmp && mv tmp $p
    
    # if it's not an index file, make a directory from the filename, rename file to "index.md"
    if [ ${p: -8} != "index.md" ]; then
      directory_from_filename=$p
      tmp_val=$(echo "$directory_from_filename" | sed 's/...$//')
      directory_from_filename=$tmp_val
      mkdir -p $directory_from_filename
      mv $p $directory_from_filename/index.md
    fi
    
  fi

done

# Fix up relative links after prettifying structure above
sedi -e 's/](\(.*\)\.md)/](..\/\1)/' $(find docs/package/ -name '*.md')

cp -r docs/package/* ./pages/services/kubernetes/$directory

git rm -rf docs/
rm -rf docs/

# Add version information to latest index file

sedi -e "s/^navigationTitle: .*$/navigationTitle: Kubernetes $directory/g" ./pages/services/kubernetes/$directory/index.md
sedi -e "s/^title: .*$/title: Kubernetes $directory/g" ./pages/services/kubernetes/$directory/index.md

# Update sort order of index files

weight=10
for i in $( ls -r ./pages/services/kubernetes/*/index.md ); do
  sedi "s/^menuWeight:.*$/menuWeight: ${weight}/" $i
  weight=$(expr ${weight} + 10)
done

echo "------------------------------"
echo " Kubernetes merge complete"
echo "------------------------------"
