#!/bin/bash

# Script maintained for 1.x releases of Kubernetes

# sed needs different args to -i depending on the flavor of the tool that is installed
sedi () {
    sed --version >/dev/null 2>&1 && sed -i "$@" || sed -i "" "$@"
}

echo "------------------------------"
echo " Merging Kubernetes"
echo "------------------------------"

# Get values for branch
branch=$1
if [ -z "$1" ]; then echo "Enter a branch as the first argument."; exit 1; fi
skip=$2
# Package name, default to "kubernetes"
name=${3:-kubernetes}

# Move to the top level of the repo

root="$(git rev-parse --show-toplevel)"
cd $root

# pull dcos-kubernetes-cluster
git remote rm dcos-kubernetes-1.x
git remote add dcos-kubernetes-1.x git@github.com:mesosphere/dcos-kubernetes-1.x.git
git fetch dcos-kubernetes-1.x > /dev/null 2>&1

# checkout
git checkout dcos-kubernetes-1.x/$branch docs/package

# remove any user specified directories 
if [ -n "$skip" ]; then 
  echo "Skipping $skip"
  for d in $(echo $skip | sed "s/,/ /g"); do rm -rf docs/package/$d; done
fi

# always remove lates/ directory it will never be copied
rm -rf docs/package/latest

# checkout each file in the merge list from tags/$version
for d in docs/package/*/; do
  echo $d
  for p in `find $d -type f`; do
    echo $p
    # markdown files only
    if [ ${p: -3} == ".md" ]; then
      # remove any dodgy control characters - sometimes copied in from commands
      sedi -e 's/ *//g' $p

      # remove https://docs.mesosphere.com from links
      awk '{gsub(/https:\/\/docs.mesosphere.com\/1.9\//,"/1.9/");}{print}' $p > tmp && mv tmp $p
      awk '{gsub(/https:\/\/docs.mesosphere.com\/1.10\//,"/1.10/");}{print}' $p > tmp && mv tmp $p
      awk '{gsub(/https:\/\/docs.mesosphere.com\/1.11\//,"/1.11/");}{print}' $p > tmp && mv tmp $p
      awk '{gsub(/https:\/\/docs.mesosphere.com\/1.12\//,"/1.12/");}{print}' $p > tmp && mv tmp $p
      awk '{gsub(/https:\/\/docs.mesosphere.com\/latest\//,"/latest/");}{print}' $p > tmp && mv tmp $p
      awk '{gsub(/https:\/\/docs.mesosphere.com\/service-docs\//,"/services/");}{print}' $p > tmp && mv tmp $p

      # add full path for images
      awk -v directory=$(basename $d) -v name="$name" '{gsub(/\([.][.]\/img/,"(/services/"name"/"directory"/img");}{print;}' $p > tmp && mv tmp $p
    fi
  done
done

# Fix up relative links after prettifying structure above
sedi -e 's/](\(.*\)\.md)/](..\/\1)/' $(find docs/package/ -name '*.md')

# Backup 2.x docs
mkdir tmp_backup && mv ./pages/services/$name/2.* tmp_backup/

# Remove old docs 
rm -rf ./pages/services/$name
mkdir -p ./pages/services/$name

# Restore backup 2.x docs
mv tmp_backup/* ./pages/services/$name
rm -rf tmp_backup

# Copy new docs
cp -r docs/package/* ./pages/services/$name

git rm -rf docs/
rm -rf docs/

# Update sort order of index files
weight=10
for i in $( ls -r ./pages/services/$name/*/index.md ); do
  sedi "s/^menuWeight:.*$/menuWeight: ${weight}/" $i
  weight=$(expr ${weight} + 10)
done

echo "------------------------------"
echo " Kubernetes merge complete"
echo "------------------------------"
