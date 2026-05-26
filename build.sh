#!/bin/bash
# Build script for Cloudflare Workers deployment
# Copies static files to public/ directory

rm -rf public
mkdir -p public

cp index.html style.css script.js CNAME public/
cp -r assets public/
cp -r admin public/
cp -r faq public/

echo "Build complete: public/ directory ready"
