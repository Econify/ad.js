echo 'Beginning production build'

CURRENT_PUBLISHED_VERSION=$(npm info adjs version)
if [ -z $CURRENT_PUBLISHED_VERSION ]; then echo "Could not find latest published version. Exiting build."; exit 1; fi

LOCAL_VERSION=$(node -e "console.log(require('./package.json').version)")
if [ -z $LOCAL_VERSION ]; then echo "Version is missing from package.json. Exiting build."; exit 1; fi

if [ $LOCAL_VERSION = $CURRENT_PUBLISHED_VERSION ]
then
  echo "Version is unchanged. No build further actions required."
else
  echo "inside else"
fi