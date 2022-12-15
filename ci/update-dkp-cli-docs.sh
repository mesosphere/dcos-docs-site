#!/bin/bash

set -e

DKP_CLI_VERSION=${DKP_CLI_VERSION:-"v0.0.0-dev.0"}
TARGET_VERSION=${TARGET_VERSION:-"2.3"}
TARGET_PATH=${TARGET_PATH:-"/dkp/kommander/$TARGET_VERSION/cli/"}

TMP_DIR=`mktemp -d`
trap "rm -r $TMP_DIR" EXIT
curl -fsSL "https://s3.amazonaws.com/downloads.mesosphere.io/dkp/${DKP_CLI_VERSION}/dkp_${DKP_CLI_VERSION}_linux_amd64.tar.gz" | tar xz -O dkp > $TMP_DIR/dkp
chmod +x $TMP_DIR/dkp
mkdir -p $TMP_DIR/docs

# generate the Markdown docs
$TMP_DIR/dkp help --output md --tree --output-dir $TMP_DIR/docs

for f in $TMP_DIR/docs/*.md; do
    # change link urls: dkp_attach_cluster.md --> [...]/dkp/attach/cluster/
    awk -i inplace "{
        n = match(\$0, /\[[^\]]+\]\(([^\)]+)\)/, x)
        if (n > 0) {
            url=x[1]
            gsub(\"_\", \"/\", url)
            gsub(\".md\", \"/\", url)
            url = \"$TARGET_PATH\" url
            gsub(x[1], url, \$0)
        }
        print
    }" $f

    # get command name from first line
    command_name=`awk 'NR == 1 {sub(/^##/, ""); print}' $f`
    # use 3rd line as excerpt
    excerpt=`awk 'NR == 3' $f`

    # move to the expected directory structure
    no_ext=${f/%.md}
    dir=${no_ext//_/"/"}
    mkdir -p "$dir"
    # add the header
    cat - $f <<END > "$dir/index.md"
---
layout: layout.pug
navigationTitle: $command_name
title: $command_name
menuWeight: 10
excerpt: $excerpt
notes: Automatically generated, DO NOT EDIT
enterprise: false
beta: false
---
<!-- vale off -->
<!-- markdownlint-disable -->

END
    rm $f
done

# copy to the destination directory
TARGET_DIR=pages$TARGET_PATH
mkdir -p $TARGET_DIR
rm -rf $TARGET_DIR/dkp/
cp -a $TMP_DIR/docs/* $TARGET_DIR/
