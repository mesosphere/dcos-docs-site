#!/bin/bash

# sed needs different args to -i depending on the flavor of the tool that is installed
sedi () {
    sed --version >/dev/null 2>&1 && sed -i "$@" || sed -i "" "$@"
}

echo "------------------------------"
echo " Merging Kubernetes"
echo "------------------------------"

# Get values for version
version=$1
if [ -z "$1" ]; then echo "Enter a version tag as the first argument."; exit 1; fi
skip=$2
# Package name, default to "kubernetes"
name=${3:-kubernetes}

# Move to the top level of the repo

root="$(git rev-parse --show-toplevel)"
cd $root

# pull dcos-kubernetes-cluster
git remote rm dcos-kubernetes-cluster
git remote add dcos-kubernetes-cluster git@github.com:mesosphere/dcos-kubernetes-cluster.git
git fetch dcos-kubernetes-cluster > /dev/null 2>&1

# checkout
git checkout tags/$version docs/package

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

      awk '{gsub(/https:\/\/docs.mesosphere.com\//,"/mesosphere/dcos/services/");}{print}' $p > tmp && mv tmp $p

      awk '{gsub(/\]\(\/services\/kubernetes/,"](/mesosphere/dcos/services/kubernetes");}{print}' $p > tmp && mv tmp $p
      awk '{gsub(/services\/edge-lb/,"mesosphere/dcos/services/edge-lb");}{print}' $p > tmp && mv tmp $p
      awk '{gsub(/services\/marathon-lb/,"mesosphere/dcos/services/marathon-lb");}{print}' $p > tmp && mv tmp $p
      awk '{gsub(/1.12\/cli/,"mesosphere/dcos/1.12/cli");}{print}' $p > tmp && mv tmp $p
      awk '{gsub(/1.12\/security/,"mesosphere/dcos/1.12/security");}{print}' $p > tmp && mv tmp $p
      awk '{gsub(/1.12\/administering-clusters/,"mesosphere/dcos/1.12/administering-clusters");}{print}' $p > tmp && mv tmp $p
      awk '{gsub(/1.12\/networking/,"mesosphere/dcos/1.12/networking");}{print}' $p > tmp && mv tmp $p
      awk '{gsub(/1.12\/overview/,"mesosphere/dcos/1.12/overview");}{print}' $p > tmp && mv tmp $p
      awk '{gsub(/\/tutorial-kubernetes-storage-basic/,"/mesosphere/dcos/tutorial-kubernetes-storage-basic");}{print}' $p > tmp && mv tmp $p

      # remove https://docs.mesosphere.com from links
      awk '{gsub(/https:\/\/docs.mesosphere.com\/1.9\//,"/1.9/");}{print}' $p > tmp && mv tmp $p
      awk '{gsub(/https:\/\/docs.mesosphere.com\/1.10\//,"/1.10/");}{print}' $p > tmp && mv tmp $p
      awk '{gsub(/https:\/\/docs.mesosphere.com\/1.11\//,"/1.11/");}{print}' $p > tmp && mv tmp $p
      awk '{gsub(/https:\/\/docs.mesosphere.com\/1.12\//,"/1.12/");}{print}' $p > tmp && mv tmp $p
      awk '{gsub(/https:\/\/docs.mesosphere.com\/latest\//,"/latest/");}{print}' $p > tmp && mv tmp $p

      awk '{gsub(/services\/services\/kubernetes/,"services/kubernetes");}{print}' $p > tmp && mv tmp $p

      # add full path for images
      awk -v directory=$(basename $d) -v name="$name" '{gsub(/\([.][.]\/img/,"(/mesosphere/dcos/services/"name"/"directory"/img");}{print;}' $p > tmp && mv tmp $p
    fi
  done
done

# Fix up relative links after prettifying structure above
# sedi -e 's/](\(.*\)\.md)/](..\/\1)/' $(find docs/package/ -name '*.md')

# Backup 1.x docs
mkdir tmp_backup && mv ./pages/mesosphere/dcos/services/$name/1.* tmp_backup/

# Remove old docs
rm -rf ./pages/mesosphere/dcos/services/$name
mkdir -p ./pages/mesosphere/dcos/services/$name

# Restore backup 1.x docs
mv tmp_backup/* ./pages/mesosphere/dcos/services/$name
rm -rf tmp_backup

# Copy new docs
cp -r docs/package/* ./pages/mesosphere/dcos/services/$name

git rm -rf docs/
rm -rf docs/

# Update sort order of index files
# Skipping any files with a menuWeight of -1
weight=1
for i in $( ls -r ./pages/mesosphere/dcos/services/$name/*/index.md ); do
  cw=$(grep 'menuWeight: ' $i | sed 's/^.*: //')
  if [ "$cw" -ne "-1" ]; then
    sedi "s/^menuWeight:.*$/menuWeight: ${weight}/" $i
    weight=$(expr ${weight} + 1)
  fi
done

echo "------------------------------"
echo " Kubernetes merge complete"
echo "------------------------------"
