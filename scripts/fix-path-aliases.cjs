#!/usr/bin/env node

/**
 * Script to replace @/ path aliases with relative imports
 * This fixes the Amplify build issue where @/ aliases aren't resolved
 */

const fs = require('fs');
const path = require('path');

// Get the source directory from command line or use default
const srcDir = process.argv[2] || path.join(__dirname, '../src');

function getRelativePath(fromFile, toPath) {
  // Remove @/ prefix
  const targetPath = toPath.replace(/^@\//, '');
  
  // Get directory of source file
  const fromDir = path.dirname(fromFile);
  
  // Calculate relative path from source file to target
  const relativePath = path.relative(fromDir, path.join(srcDir, targetPath));
  
  // Normalize path separators and ensure it starts with ./
  let normalized = relativePath.replace(/\\/g, '/');
  if (!normalized.startsWith('.')) {
    normalized = './' + normalized;
  }
  
  return normalized;
}

function fixImportsInFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  let newContent = content;
  
  // Match import statements with @/ aliases
  const importRegex = /from\s+['"]@\/([^'"]+)['"]/g;
  
  newContent = newContent.replace(importRegex, (match, importPath) => {
    const relativePath = getRelativePath(filePath, `@/${importPath}`);
    modified = true;
    return `from '${relativePath}'`;
  });
  
  // Also handle require statements
  const requireRegex = /require\s*\(\s*['"]@\/([^'"]+)['"]\s*\)/g;
  
  newContent = newContent.replace(requireRegex, (match, importPath) => {
    const relativePath = getRelativePath(filePath, `@/${importPath}`);
    modified = true;
    return `require('${relativePath}')`;
  });
  
  if (modified) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`Fixed: ${path.relative(srcDir, filePath)}`);
    return true;
  }
  
  return false;
}

function walkDir(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      // Skip node_modules and .next
      if (file !== 'node_modules' && file !== '.next') {
        walkDir(filePath, fileList);
      }
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Main execution
console.log('Fixing @/ path aliases in:', srcDir);
const files = walkDir(srcDir);
let fixedCount = 0;

files.forEach(file => {
  if (fixImportsInFile(file)) {
    fixedCount++;
  }
});

console.log(`\nFixed ${fixedCount} files.`);
