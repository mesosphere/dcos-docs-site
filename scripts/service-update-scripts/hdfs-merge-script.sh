#!/bin/bash
#
echo "-------------------------------------"
echo " Merging HDFS"
echo "-------------------------------------"

# Update sort order of index files

for i in $( ls ./services/hdfs/*/index.md );
do
  awk '/^menu_order:/ {sub(/[[:digit:]]+$/,$NF+10)}1 {print}' $i > $i.tmp && mv $i.tmp $i
done

# Get values for version and directory variable

branch=$1
if [ -z "$1" ]; then echo "Enter a branch as the first argument."; exit 1; fi
directory=$2
if [ -z "$2" ]; then echo "Enter a directory name as the second argument."; exit 1; fi

# Create directory structure

echo "Creating new directories"
mkdir service-docs/hdfs/$directory
mkdir service-docs/hdfs/$directory/img
echo "New directories created: service-docs/hdfs/$directory and service-docs/hdfs/$directory/img"

# Move to the top level of the repo
root="$(git rev-parse --show-toplevel)"
cd $root

# pull dcos-commons
git remote rm dcos-commons
git remote add dcos-commons https://github.com/mesosphere/dcos-commons.git
git fetch dcos-commons > /dev/null 2>&1

# checkout each file in the merge list from dcos-commons/0.30.X
while read p;
do
  echo $p
  # checkout
  git checkout dcos-commons/$branch $p

  # markdown files only
  if [ ${p: -3} == ".md" ]; then
        # insert tag ( markdown files only )
    awk -v n=2 '/---/ { if (++count == n) sub(/---/, "---\n\n<!-- This source repo for this topic is https://github.com/mesosphere/dcos-commons -->\n"); } 1{print}' $p > tmp && mv tmp $p
        # remove https://docs.mesosphere.com from links
    awk '{gsub(/https:\/\/docs.mesosphere.com\/1.9\//,"/1.9/");}{print}' $p > tmp && mv tmp $p
    awk '{gsub(/https:\/\/docs.mesosphere.com\/1.10\//,"/1.10/");}{print}' $p > tmp && mv tmp $p
    awk '{gsub(/https:\/\/docs.mesosphere.com\/latest\//,"/latest/");}{print}' $p > tmp && mv tmp $p
    awk '{gsub(/https:\/\/docs.mesosphere.com\/service-docs\//,"/services/");}{print}' $p > tmp && mv tmp $p

      # add full path for images
    awk -v directory="$directory" '{gsub(/\(img/,"(/services/hdfs/"directory"/img");}{print;}' $p > tmp && mv tmp $p
  fi

cp -r frameworks/hdfs/docs/* service-docs/hdfs/$directory

done <scripts/merge-lists/dcos-hdfs-service-merge-list.txt

git rm -rf frameworks

# Add version information to latest index file

sed -i '' -e "2s/.*/post_title: HDFS $directory/g" ./services/hdfs/$directory/index.md

echo "---------------------------------------------"
echo " HDFS merge complete"
echo "---------------------------------------------"
