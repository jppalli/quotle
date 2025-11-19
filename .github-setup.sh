#!/bin/bash

# GitHub Setup Script for Quotle
# This script helps you quickly set up your GitHub repository

echo "🎮 Quotle - GitHub Setup Script"
echo "================================"
echo ""

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install git first."
    exit 1
fi

echo "📝 Setting up Git repository..."

# Initialize git if not already done
if [ ! -d .git ]; then
    git init
    echo "✅ Git repository initialized"
else
    echo "✅ Git repository already exists"
fi

# Add all files
echo "📦 Adding files to git..."
git add .

# Commit
echo "💾 Creating initial commit..."
git commit -m "Initial commit: Quotle game ready for deployment"

# Set main branch
git branch -M main

# Add remote (update this URL with your actual repository)
REPO_URL="https://github.com/jppalli/quotle.git"
echo "🔗 Adding remote repository: $REPO_URL"

# Check if remote already exists
if git remote | grep -q "origin"; then
    echo "⚠️  Remote 'origin' already exists. Updating URL..."
    git remote set-url origin $REPO_URL
else
    git remote add origin $REPO_URL
fi

echo ""
echo "✅ Git setup complete!"
echo ""
echo "📤 Next steps:"
echo "1. Make sure you've created the repository at: $REPO_URL"
echo "2. Run: git push -u origin main"
echo ""
echo "🚀 After pushing, deploy on Vercel:"
echo "   - Go to https://vercel.com"
echo "   - Import your GitHub repository"
echo "   - Click Deploy"
echo ""
