#!/bin/bash

# Set path to Info.plist
INFO_PLIST_PATH="ios/fitbox/Info.plist"  # Adjust path as per your project structure

# Read current build number
CURRENT_BUILD_NUMBER=$(/usr/libexec/PlistBuddy -c "Print CFBundleVersion" "$INFO_PLIST_PATH")

# Increment build number
NEW_BUILD_NUMBER=$((CURRENT_BUILD_NUMBER + 1))

# Update Info.plist with new build number
/usr/libexec/PlistBuddy -c "Set :CFBundleVersion $NEW_BUILD_NUMBER" "$INFO_PLIST_PATH"

# Print and export the new build number for subsequent steps to use
echo "New Build Number: $NEW_BUILD_NUMBER"
echo "::set-output name=new_build_number::$NEW_BUILD_NUMBER"

# Commit the updated Info.plist if there are changes
if [ -n "$(git status --porcelain "$INFO_PLIST_PATH")" ]; then
    git add "$INFO_PLIST_PATH"
    git commit -m "Increment build number to $NEW_BUILD_NUMBER"
    git push origin main  # Push the commit to your repository
fi
