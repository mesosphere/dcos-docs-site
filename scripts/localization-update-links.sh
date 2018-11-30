# Links and Images

find ./pages/cn -type f -exec sed -i '' -e 's/](\/1.11/](\/cn\/1.11/g' {} \;
find ./pages/cn -type f -exec sed -i '' -e 's/](1.11/](cn\/1.11/g' {} \;

# Include files

find ./pages/cn -type f -exec sed -i '' -e 's/#include \/cn/#include \/cn/g' {} \;

# bad code blocks

## Opening
#find ./pages/cn -type f -exec sed -i '' -e 's/<```>/```/g' {} \;
## Closing
#find ./pages/cn -type f -exec sed -i '' -e 's/<\/```>/```/g' {} \;
## linebreaks
#find ./pages/cn -type f -exec sed -i '' -e 's/<linebreak>/\'$'\n/g' {} \;

# Data yml

