for f in ./build/umd/* ; do
  if [[ "$f" == *"development"* ]] && [[ "$f" != *"map" ]]; then
    cat $f >> './build/umd/bundle.development.js'
  elif [[ "$f" == *"production"* ]]; then
    cat $f >> './build/umd/bundle.production.min.js'
  fi
done
