#!/bin/bash

ZIP_NAME="leetdaily.zip"

# Remove existing ZIP if any
rm -f $ZIP_NAME

# Zip all necessary files and folders except unwanted ones
zip -r $ZIP_NAME \
  manifest.json \
  background.js \
  popup.html \
  popup.js \
  privacy.html \
  icon.png \
  styles/ \
  src/ \
  -x "node_modules/*" "package.json" "package-lock.json" "README.md" "tailwind.config.js" "zip.sh" "*.DS_Store"

  #chmod +x zip.sh
  #./zip.sh
