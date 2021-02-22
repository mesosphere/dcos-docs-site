gifs=$(fd .gif)

for f in $gifs; do
  if ! rg $(basename $f) > /dev/null 2>&1; then
    echo $f
  fi
done
