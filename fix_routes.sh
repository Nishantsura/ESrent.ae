#!/bin/bash

# List of files to fix
files=(
  "src/app/api/brands/slug/[slug]/route.ts"
  "src/app/api/cars/fuel-type/[fuelType]/route.ts"
  "src/app/api/cars/brand/[brand]/route.ts"
  "src/app/api/cars/type/[type]/route.ts"
  "src/app/api/categories/type/[type]/route.ts"
  "src/app/api/categories/[id]/route.ts"
)

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "Fixing $file"
    # Fix the params type definition
    sed -i.bak 's/{ params }: { params: { \([^}]*\) }/{ params }: { params: Promise<{ \1 }>/g' "$file"
    
    # Add the await params line after the function declaration
    if grep -q "const.*= await params" "$file"; then
      echo "Already has await params line"
    else
      # Find the line with function declaration and add await params after the opening brace
      sed -i.bak '/export async function.*{$/a\
  const { '"$(basename $(dirname $file) | tr -d '[]')"' } = await params;' "$file"
    fi
    
    # Clean up backup files
    rm -f "$file.bak"
  fi
done
