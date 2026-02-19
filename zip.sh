#!/bin/bash

ZIP_NAME="leetdaily.zip"

# Remove existing ZIP if any
rm -f $ZIP_NAME

# Zip all files needed for the Chrome extension
zip -r $ZIP_NAME \
  manifest.json \
  background.js \
  content.js \
  popup.html \
  popup.js \
  privacy.html \
  icon.png \
  problems-explorer.html \
  problems-explorer.js \
  styles/output.css \
  data/ \
  utils/ \
  -x "*.DS_Store"

echo ""
echo "Created $ZIP_NAME ($(du -h $ZIP_NAME | cut -f1))"
echo "Files included:"
unzip -l $ZIP_NAME | tail -n +4 | head -n -2 | awk '{print "  " $4}'

# Usage:
#   chmod +x zip.sh
#   ./zip.sh
