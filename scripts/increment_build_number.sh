#!/bin/bash

# Set path to xcodeproj
PROJECT_PATH="ios/fitbox.xcodeproj"  # Adjust path as per your project structure
BRANCH_DEV="dev"
BRANCH_DEV_BUILD="dev-ios-build"

# Function to handle errors
handle_error() {
    echo "Error: $1"
    exit 1
}

# Create a new branch from dev
echo "Creating branch $BRANCH_DEV_BUILD from $BRANCH_DEV..."
git checkout -b $BRANCH_DEV_BUILD origin/$BRANCH_DEV || handle_error "Failed to create branch $BRANCH_DEV_BUILD"

# Pull latest changes from the dev branch
echo "Pulling latest changes from $BRANCH_DEV branch..."
git pull origin $BRANCH_DEV || handle_error "Failed to pull latest changes from $BRANCH_DEV branch"

# Read the build number from GitHub Actions
BUILD_NUMBER=$((GITHUB_RUN_NUMBER - 54))
echo "Setting build number to $BUILD_NUMBER"


# Update CURRENT_PROJECT_VERSION in the project.pbxproj
sed -i '' -e "s/CURRENT_PROJECT_VERSION = [0-9]*;/CURRENT_PROJECT_VERSION = $BUILD_NUMBER;/g" $PROJECT_PATH/project.pbxproj

echo "Updated CURRENT_PROJECT_VERSION to $BUILD_NUMBER in XCODEPROJ"

# Commit the updated file if there are changes
if [ -n "$(git status --porcelain "$PROJECT_PATH")" ]; then
    git add "$PROJECT_PATH"
    git commit -m "build: set CURRENT_PROJECT_VERSION to $BUILD_NUMBER" --author="GitHub Actions <actions@github.com>"
    git push origin HEAD:$BRANCH_DEV_BUILD
fi
