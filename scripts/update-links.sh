# find ./pages -name index.md -type f -exec sed -i '' -e 's/](\//](\/mesosphere\/dcos\//g' {} \;
# find ./pages -name index.md -type f -exec sed -i '' -e 's/]: \//]: \/mesosphere\/dcos\//g' {} \;
# find ./pages -name index.md -type f -exec sed -i '' -e 's/]:\//]: \/mesosphere\/dcos\//g' {} \;

# find ./pages -name index.md -type f -exec sed -i '' -e 's/#include \//#include \/mesosphere\/dcos\//g' {} \;

# find ./pages -name index.md -type f -exec sed -i '' -e "s/api='\//api='\/mesosphere\/dcos\//g" {} \;

