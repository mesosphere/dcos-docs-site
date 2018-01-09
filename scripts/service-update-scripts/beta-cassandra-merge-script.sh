#!/bin/bash
#
echo "-----------------------------------------"
echo " Merging beta cassandra"
echo "-----------------------------------------"

# Update sort order of index files

for i in $( ls ./services/beta-cassandra/*/index.md );
do
  awk '/^menu_order:/ {sub(/[[:digit:]]+$/,$NF+10)}1 {print}' $i > $i.tmp && mv $i.tmp $i
done

# Get values for version and directory variable

version=$1
if [ -z "$1" ]; then echo "Enter a version tag as the first argument."; exit 1; fi
directory=$2
if [ -z "$2" ]; then echo "Enter a directory name as the second argument."; exit 1; fi

# Create directory structure

echo "Creating new directories"
mkdir services/beta-cassandra/$directory
mkdir services/beta-cassandra/$directory/img
echo "New directories created: services/beta-cassandra/$directory and services/beta-cassandra/$directory/img"

# Move to the top level of the repo

root="$(git rev-parse --show-toplevel)"
cd $root

# pull dcos-commons
git remote rm dcos-commons
git remote add dcos-commons https://github.com/mesosphere/dcos-commons.git
git fetch dcos-commons > /dev/null 2>&1

# check out each file in the merge list from the relesse tag
while read p;
do
  echo $p
  # checkout
  git checkout tags/$version $p
  # markdown files only
  if [ ${p: -3} == ".md" ]; then
        # insert tag ( markdown files only )
    awk -v n=2 '/---/ { if (++count == n) sub(/---/, "---\n\n<!-- This source repo for this topic is https://github.com/mesosphere/dcos-commons -->\n"); } 1{print}' $p > tmp && mv tmp $p
        # remove https://docs.mesosphere.com from links
    awk '{gsub(/https:\/\/docs.mesosphere.com\/1.9\//,"/1.9/");}{print}' $p > tmp && mv tmp $p
    awk '{gsub(/https:\/\/docs.mesosphere.com\/1.10\//,"/1.10/");}{print}' $p > tmp && mv tmp $p
    awk '{gsub(/https:\/\/docs.mesosphere.com\/1.10\//,"/1.11/");}{print}' $p > tmp && mv tmp $p
    awk '{gsub(/https:\/\/docs.mesosphere.com\/latest\//,"/latest/");}{print}' $p > tmp && mv tmp $p
    awk '{gsub(/https:\/\/docs.mesosphere.com\/services\//,"/services/");}{print}' $p > tmp && mv tmp $p

      # add full path for images
    awk -v directory="$directory" '{gsub(/\(img/,"(/services/beta-cassandra/"directory"/img");}{print;}' $p > tmp && mv tmp $p
  fi

cp -r frameworks/cassandra/docs/* services/beta-cassandra/$directory

done <scripts/merge-lists/beta-cassandra-merge-list.txt

git rm -rf frameworks

# Add version information to latest index file

sed -i '' -e "2s/.*/navigationTitle: Beta Cassandra $directory/g" ./services/beta-cassandra/$directory/index.md
sed -i '' -e "2s/.*/title: Beta Cassandra $directory/g" ./services/beta-cassandra/$directory/index.md

echo "------------------------------------------------"
echo " beta cassandra merge complete"
echo "------------------------------------------------"
