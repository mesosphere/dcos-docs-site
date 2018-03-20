#!/bin/bash
set -e

STABLE_BRANCH=${STABLE_BRANCH:-"sdk-0.40"}
BETA_BRANCH=${BETA_BRANCH:-"master"}

REPO_NAME=${REPO_NAME:-"dcos-commons"}
REPO_URL=${REPO_URL:-"https://github.com/mesosphere/${REPO_NAME}.git"}

TEMPLATE_REPO_NAME=${TEMPLATE_REPO_NAME:-"dcos-commons"}
TEMPLATE_REPO_URL=${TEMPLATE_REPO_URL:-"https://github.com/mesosphere/${TEMPLATE_REPO_NAME}.git"}

syntax() {
    cat <<EOF
This script copies docs for the specified framework from ${REPO_NAME} into this repository.
Syntax:
  $0 <[beta-]packagename> <version[-beta]> <packagetitle>
Examples:
  $0 beta-cassandra 2.1.0-3.0.6-beta Cassandra
  $0 hdfs 2.1.0-4.1.0 HDFS
EOF
    exit 1
}

# Get values for version and directory variable

package=$1
if [ -z "$package" ]; then syntax; fi
version=$2
if [ -z "$version" ]; then syntax; fi
title=$3
if [ -z "$title" ]; then syntax; fi

echo "------------------------------"
echo " Merging $package from ${REPO_NAME}"
echo "------------------------------"

# Determine if the package is a beta or not
if [[ "$package" == beta-* ]]; then
    branch=$BETA_BRANCH
    # Verify that version ends with '-beta'
    if [[ "$version" != *-beta ]]; then
        echo "Package $package requires a version ending in '-beta', but version was $version"
        exit 1
    fi
else
    branch=$STABLE_BRANCH
    # Verify that the version doesn't end with '-beta'
    if [[ "$version" == *-beta ]]; then
        echo "Package $package requires a version that doesn't end in '-beta', but version was $version"
        exit 1
    fi
fi
template_branch=${TEMPLATE_BRANCH:-${branch}}


# "sed -i" has mutually independent syntax depending on platform:
# - Linux: "sed -i <cmd> <file>"
# - OSX: "sed -i '' <cmd> <file>"
platform="$(uname)"
case "$platform" in
    "Linux")
        SED_INPLACE="sed -i"
    ;;
    "Darwin")
        SED_INPLACE="sed -i ''"
    ;;
    *)
        echo "Unsupported platform: '$platform'"
        exit 1
    ;;
esac

# Go to dcos-docs-site root directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "${SCRIPT_DIR}"/../..
pwd

# Grab correct branch from repo
rm -rf "${REPO_NAME:?}/"
git clone --depth 1 --branch $branch $REPO_URL

if [ x"$TEMPLATE_REPO_NAME" != x"$REPO_NAME" ]; then
    # Set the template branch
    rm -rf "${TEMPLATE_REPO_NAME:?}/"
    git clone --depth 1 --branch $template_branch $TEMPLATE_REPO_URL
fi

# Omit any 'beta-' prefix from package name when getting dcos-commons path:
# (shellcheck: '^beta-' not supported by ${var//search/replace})
# shellcheck disable=SC2001

framework=$(echo "$package" | sed 's/^beta-//g')
input_framework_docs_dir=$REPO_NAME/frameworks/${framework}/docs

if [ ! -d $input_framework_docs_dir ]; then
    echo "The input docs dir does not exist. Trying the root folder"
    if [ -d $REPO_NAME/docs ]; then
        input_framework_docs_dir=$REPO_NAME/docs
    else
        echo "The doc folder could not be found."
        exit 1
    fi
fi


output_package_dir=pages/services/${package}
output_package_version_dir=${output_package_dir}/${version}
if [ -d "$output_package_version_dir" ]; then
   echo "Output directory already exists, remove first: $(pwd)/$output_package_version_dir"
   exit 1
fi

# Before copying content, add 10 to the sort order of existing index files
for i in "$output_package_dir"/*/index.md; do
    awk '/^menuWeight:/ {sub(/[[:digit:]]+$/,$NF+10)}1 {print}' "$i" > "$i.tmp" && mv "$i.tmp" "$i"
done

merge_list_file=scripts/service-update-scripts/merge-lists/${package}-merge-list.txt
rm -f "$merge_list_file"

###
# Version-specific content

echo "Copying service content"
rm -rf "$output_package_version_dir"
mkdir -p "$output_package_version_dir"
for filepath in "$input_framework_docs_dir"/*.md; do
    if [ "$(basename "$filepath")" == "index.md" ]; then
        # Copy index.md to root, don't create index/index.md...
        cp -v "$filepath" "$output_package_version_dir"/
    else
        # Copy foo.md as foo/index.md
        directory_name=$(basename "$filepath" | sed 's/\.md$//g')
        mkdir -p "$output_package_version_dir"/"$directory_name"
        cp -v "$filepath" "$output_package_version_dir"/"$directory_name"/index.md
    fi
    echo "$filepath" >> "$merge_list_file"
done

if [ -d "$input_framework_docs_dir/img/" ]; then
    echo "Copying service images"
    mkdir -p "${output_package_version_dir}/img/"
    cp -v "$input_framework_docs_dir/img/*" "${output_package_version_dir}/img/"
    ls "$input_framework_docs_dir/img/*" >> "$merge_list_file"
fi

echo "Updating service model"
# e.g.: cassandra.yml => services/beta-cassandra/data.yml
output_yml_data_filepath=pages/services/${package}/data.yml
cp -v $REPO_NAME/docs/pages/_data/services/"${framework}.yml" "$output_yml_data_filepath"

###
# Shared content

echo "Updating template content"
input_template_dir=$TEMPLATE_REPO_NAME/docs/pages/_includes/services
output_template_dir=pages/services/include

rm -rf $output_template_dir
mkdir -p $output_template_dir
for filepath in "$input_template_dir"/*.md; do
    # e.g. pages/_includes/services/template.md => pages/services/include/template.tmpl
    dest_filename=$(basename "$filepath" | sed 's/\.md$/.tmpl/g')
    cp -v "$filepath" "$output_template_dir/$dest_filename"
    echo "$filepath" >> "$merge_list_file"
done

echo "Updating template images"
# e.g. pages/img/services/file.png => pages/services/include/img/file.png
input_template_image_dir=$TEMPLATE_REPO_NAME/docs/pages/img/services
output_template_image_dir=$output_template_dir/img
rm -rf $output_template_image_dir
mkdir -p $output_template_image_dir
cp -v $input_template_image_dir/* $output_template_image_dir
ls $input_template_image_dir/* >> "$merge_list_file"

# Copying finished, delete source repo:
rm -rf "${REPO_NAME:?}/"
if [ x"$TEMPLATE_REPO_NAME" != x"$REPO_NAME" ]; then
    rm -rf "${TEMPLATE_REPO_NAME:?}/"
fi


###
# Conversion hacks

mangle_content_file() {
    echo "Mangling $1..."

    original=$1
    target=$original.new
    cp "$original" "$target"

    vcs_source=${2:-"$REPO_URL:$branch"}

    # Insert source comment, and these headers: "model: /services/$package/data.yml" + "render: mustache"
    awk -v n=2 "/---/ { if (++count == n) sub(/---/, \"model: /services/$package/data.yml\nrender: mustache\n---\n\n<!-- Imported from $vcs_source -->\"); } 1{print}" "$target" > tmp && mv tmp "$target"

    # Link/image url hacks:

    # Remove https://docs.mesosphere.com from links (use , as sed delim)
    $SED_INPLACE 's,https://docs.mesosphere.com/,/,g' "$target"

    # Update template image urls: /dcos-commons/img/services/ => services/include/img/ (use , as sed delim)
    $SED_INPLACE 's,/dcos-commons/img/services/,/services/include/img/,g' "$target"

    # Update service image urls: /dcos-commons/services/$framework/img/ => /services/$package/$version/img/ (use , as sed delim)
    $SED_INPLACE "s,/dcos-commons/services/$framework/img/,/services/$package/$version/img/,g" "$target"


    # Jekyll templating hacks for service .md files:

    # Remove {% assign data = site.data.services.svcname %}
    $SED_INPLACE 's/{% assign .* %}$//g' "$target"

    # Replace {% include services/foo.md data=data %} => #include /services/include/foo.tmpl (use , as sed delim)
    $SED_INPLACE 's,{% include services/\(.*\)\.md .*%},#include /services/include/\1.tmpl,g' "$target"

    # Replace {{ data.foo }} => {{ model.foo }} (THIS MUST HAPPEN AFTER include.data.foo ABOVE)
    $SED_INPLACE 's/{{ \?data\.\([^ ]*\) \?}}/{{ model.\1 }}/g' "$target"

    # Jekyll templating hacks for common .tmpl files:

    # Replace {{ include.data.foo }} => {{ model.foo }}
    $SED_INPLACE 's/{{ \?include\.data\.\([^ ]*\) \?}}/{{ model.\1 }}/g' "$target"

    #diff $original $target || true
    mv "$target" "$original"
}

echo "$output_package_version_dir"
# (shellcheck: want both versiondir/*.md and versiondir/*/*.md)
# shellcheck disable=SC2044
for filepath in $(find "$output_package_version_dir" -iname "*.md"); do
    mangle_content_file "$filepath"
done

# (shellcheck: want both templatedir/*.tmpl and templatedir/**/*.tmpl)
# shellcheck disable=SC2044
for filepath in $(find "$output_template_dir" -iname "*.tmpl"); do
    mangle_content_file "$filepath" "$TEMPLATE_REPO_URL:$template_branch"
done

# Update packageName in data.yml (including or omitting beta- prefix)
$SED_INPLACE "s/packageName:.*/packageName: $package/g" "$output_yml_data_filepath"

# Add title/version information to latest index file
$SED_INPLACE "s/navigationTitle:.*/navigationTitle: $title $version/g" "${output_package_version_dir}/index.md"
$SED_INPLACE "s/title:.*/title: $title $version/g" "${output_package_version_dir}/index.md"

echo "------------------------------"
echo " $title $version merge complete"
echo "------------------------------"
