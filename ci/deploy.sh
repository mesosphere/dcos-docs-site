#!/bin/bash

set -ex

[ -z $BUCKET ] && echo "Please provide a $BUCKET" && exit 1

aws s3 mb s3://$BUCKET
aws s3api put-bucket-website --bucket $BUCKET --website-configuration file://$PWD/s3config.json
cat <<EOF > /tmp/policy
{
    "Version": "2012-10-17",
    "Id": "Policy1591460390239",
    "Statement": [
        {
            "Sid": "Stmt1591460387486",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::$BUCKET/*"
        }
    ]
}
EOF
aws s3api put-bucket-policy --bucket $BUCKET --policy file:///tmp/policy
aws s3 sync build s3://$BUCKET
