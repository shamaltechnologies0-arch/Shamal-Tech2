#!/usr/bin/env node

/**
 * Script to replace @payload-config alias with relative imports
 */

const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../src');
const payloadConfigPath = path.join(srcDir, 'payload.config.ts');

function getRelativePath(fromFile, toPath) {
  const fromDir = path.dirname(fromFile);
  const relativePath = path.relative(fromDir, toPath);
  let normalized = relativePath.replace(/\\/g, '/');
  if (!normalized.startsWith('.')) {
    normalized = './' + normalized;
  }
  // Remove .ts extension for imports
  normalized = normalized.replace(/\.ts$/, '');
  return normalized;
}

function fixImportsInFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  let newContent = content;
  
  // Match import statements with @payload-config
  const importRegex = /from\s+['"]@payload-config['"]/g;
  
  newContent = newContent.replace(importRegex, (match) => {
    const relativePath = getRelativePath(filePath, payloadConfigPath);
    modified = true;
    return `from '${relativePath}'`;
  });
  
  // Also handle require statements
  const requireRegex = /require\s*\(\s*['"]@payload-config['"]\s*\)/g;
  
  newContent = newContent.replace(requireRegex, (match) => {
    const relativePath = getRelativePath(filePath, payloadConfigPath);
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
console.log('Fixing @payload-config aliases in:', srcDir);
const files = walkDir(srcDir);
let fixedCount = 0;

files.forEach(file => {
  if (fixImportsInFile(file)) {
    fixedCount++;
  }
});

console.log(`\nFixed ${fixedCount} files.`);
