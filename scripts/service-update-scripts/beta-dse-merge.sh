#!/bin/bash
#
echo "------------------------------"
echo " Merging Beta DSE"
echo "------------------------------"

# Update sort order of index files

for i in $( ls ./services/beta-dse/*/index.md );
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
mkdir service-docs/beta-dse/$directory
mkdir service-docs/beta-dse/$directory/img
echo "New directories created: service-docs/beta-dse/$directory and service-docs/beta-dse/$directory/img"

# Move to the top level of the repo
root="$(git rev-parse --show-toplevel)"
cd $root

# pull dse-private
git remote rm dse-private
git remote add dse-private https://github.com/mesosphere/dse-private.git
git fetch dse-private > /dev/null 2>&1

# checkout each file in the merge list from dse-private/<latest-release>
while read p;
do
  echo $p
  # checkout
  git checkout tags/$version $p
  # markdown files only
  if [ ${p: -3} == ".md" ]; then
        # insert tag ( markdown files only )
    awk -v n=2 '/---/ { if (++count == n) sub(/---/, "---\n\n<!-- This source repo for this topic is https://github.com/mesosphere/dse-private -->\n"); } 1{print}' $p > tmp && mv tmp $p
        # remove https://docs.mesosphere.com from links
    awk '{gsub(/https:\/\/docs.mesosphere.com\/1.9\//,"/1.9/");}{print}' $p > tmp && mv tmp $p
    awk '{gsub(/https:\/\/docs.mesosphere.com\/1.10\//,"/1.10/");}{print}' $p > tmp && mv tmp $p
    awk '{gsub(/https:\/\/docs.mesosphere.com\/latest\//,"/latest/");}{print}' $p > tmp && mv tmp $p
    awk '{gsub(/https:\/\/docs.mesosphere.com\/service-docs\//,"/services/");}{print}' $p > tmp && mv tmp $p

      # add full path for images
    awk -v directory="$directory" '{gsub(/\(img/,"(/services/beta-dse/"directory"/img");}{print;}' $p > tmp && mv tmp $p
  fi

cp -r docs/* service-docs/beta-dse/$directory

done <scripts/merge-lists/dse-private-merge-list.txt

git rm -rf docs/

# Add version information to latest index file

sed -i '' -e "2s/.*/post_title: Beta DSE $directory/g" ./services/beta-dse/$directory/index.md


echo "------------------------------"
echo " Beta DSE merge complete"
echo "------------------------------"
