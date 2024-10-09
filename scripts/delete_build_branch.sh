#!/bin/bash
set -e  # Exit immediately if a command exits with a non-zero status.

BRANCH_NAME="dev-ios-build"

# Delete the local branch if it exists
if git show-ref --verify --quiet refs/heads/$BRANCH_NAME; then
    git branch -D $BRANCH_NAME
    echo "Deleted local branch $BRANCH_NAME"

    # Delete the remote branch
    git push origin --delete $BRANCH_NAME
    echo "Deleted remote branch $BRANCH_NAME"
else
    echo "Branch $BRANCH_NAME does not exist locally."
fi
