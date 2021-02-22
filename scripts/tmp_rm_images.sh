for f in $(fd .$1); do
  if ! rg $(basename "$f") > /dev/null 2>&1; then
    echo $f
  fi
done
