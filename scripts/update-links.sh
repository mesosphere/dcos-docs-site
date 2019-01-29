# Links and Images

## Update 1.11
#find ./pages/cn -name index.md -type f -exec sed -i '' -e 's/](\/1.11/](\/cn\/1.11/g' {} \;
#find ./pages/cn -name index.md -type f -exec sed -i '' -e 's/](1.11/](cn\/1.11/g' {} \;

## Update services
#find ./pages/cn -name index.md -type f -exec sed -i '' -e 's/](\/services/](\/cn\/services/g' {} \;
#find ./pages/cn -name index.md -type f -exec sed -i '' -e 's/](services/](cn\/services/g' {} \;

# Fix broken links/images
# find ./pages -name index.md -type f -exec sed -i '' -e 's/] (\//](\//g' {} \;

# Include files

# find ./pages/cn -name index.md -type f -exec sed -i '' -e 's/#include \/cn/#include \/cn/g' {} \;
#find ./pages/cn -name index.md -type f -exec sed -i '' -e 's/](\/1.10/](\/cn\/1.11/g' {} \;
#find ./pages/cn -name index.md -type f -exec sed -i '' -e 's/](\/1.9/](\/cn\/1.11/g' {} \;
#find ./pages/cn -name index.md -type f -exec sed -i '' -e 's/](\/1.8/](\/cn\/1.11/g' {} \;

# Fix double slash links
#find ./pages -name index.md -type f -exec sed -i '' -e 's/\]\(\/\//\]\(\//g' {} \;
find ./pages -name index.md -type f -exec sed -i '' -e 's/\]\: \/\//\]\: \/1\.12\//g' {} \;

# bad code blocks

## Opening
#find ./pages/cn -type f -exec sed -i '' -e 's/<```>/```/g' {} \;
## Closing
#find ./pages/cn -type f -exec sed -i '' -e 's/<\/```>/```/g' {} \;
## linebreaks
#find ./pages/cn -type f -exec sed -i '' -e 's/<linebreak>/\'$'\n/g' {} \;

# Data yml

