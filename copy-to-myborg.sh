#!/bin/bash
# This script copies the Myborg Ponies website to its own repository.
# Run from the root of the ratswars repo.

set -e

echo "=== Copying Myborg Ponies to ntommer/Myborg-Ponies ==="

echo "Step 1: Fetching branch..."
git fetch origin claude/myborg-ponies-website-EzOoa

echo "Step 2: Checking out branch..."
git checkout claude/myborg-ponies-website-EzOoa

echo "Step 3: Splitting subtree..."
git subtree split --prefix=myborg-ponies -b myborg-split

echo "Step 4: Pushing to Myborg-Ponies repo..."
git push https://github.com/ntommer/Myborg-Ponies.git myborg-split:main

echo ""
echo "=== Done! Files are now at github.com/ntommer/Myborg-Ponies ==="
