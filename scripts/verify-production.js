#!/usr/bin/env node

/**
 * Production Readiness Verification Script
 * Checks all critical aspects before deployment
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Starting Production Readiness Verification...\n');

let errors = [];
let warnings = [];
let passed = 0;

// Helper functions
const checkFileExists = (filePath) => {
  return fs.existsSync(path.join(__dirname, '..', filePath));
};

const readFile = (filePath) => {
  try {
    return fs.readFileSync(path.join(__dirname, '..', filePath), 'utf8');
  } catch (error) {
    return null;
  }
};

// 1. Check Environment Configuration
console.log('📋 Checking Environment Configuration...');
if (checkFileExists('.env.example')) {
  passed++;
  console.log('✅ .env.example exists');
} else {
  errors.push('.env.example file is missing');
}

if (checkFileExists('.env')) {
  const envContent = readFile('.env');
  if (envContent) {
    if (envContent.includes('toBeModified') || envContent.includes('tobemodified')) {
      warnings.push('Default secrets detected in .env - MUST be changed for production!');
    }
    if (!envContent.includes('NODE_ENV')) {
      warnings.push('NODE_ENV not set in .env');
    }
    passed++;
    console.log('✅ .env file exists');
  }
} else {
  warnings.push('.env file not found - create from .env.example');
}

// 2. Check Critical Config Files
console.log('\n📋 Checking Configuration Files...');
const configFiles = [
  'config/database.ts',
  'config/server.ts',
  'config/middlewares.ts',
  'config/api.ts',
  'config/env/production/database.ts',
  'config/env/production/server.ts'
];

configFiles.forEach(file => {
  if (checkFileExists(file)) {
    passed++;
    console.log(`✅ ${file} exists`);
  } else {
    errors.push(`${file} is missing`);
  }
});

// 3. Check API Controllers
console.log('\n📋 Checking API Controllers...');
const controllers = [
  'src/api/chat/controllers/chat.ts',
  'src/api/post/controllers/post.ts',
  'src/api/comment/controllers/comment.ts',
  'src/api/poll/controllers/poll.ts',
  'src/api/story/controllers/story.ts'
];

controllers.forEach(file => {
  if (checkFileExists(file)) {
    const content = readFile(file);
    if (content) {
      // Check for basic error handling
      if (!content.includes('try') || !content.includes('catch')) {
        warnings.push(`${file} may be missing error handling`);
      }
      // Check for authentication
      if (!content.includes('ctx.state.user')) {
        warnings.push(`${file} may be missing authentication checks`);
      }
      passed++;
      console.log(`✅ ${file} exists`);
    }
  } else {
    errors.push(`${file} is missing`);
  }
});

// 4. Check Utility Files
console.log('\n📋 Checking Utility Files...');
const utilFiles = [
  'src/utils/api-helpers.ts',
  'src/utils/logger.ts',
  'src/utils/validators.ts'
];

utilFiles.forEach(file => {
  if (checkFileExists(file)) {
    passed++;
    console.log(`✅ ${file} exists`);
  } else {
    errors.push(`${file} is missing`);
  }
});

// 5. Check Middleware
console.log('\n📋 Checking Middleware...');
if (checkFileExists('src/middlewares/security.ts')) {
  passed++;
  console.log('✅ Security middleware exists');
} else {
  warnings.push('Security middleware not found');
}

// 6. Check Schema Files
console.log('\n📋 Checking Schema Files...');
const schemas = [
  'src/api/chat/content-types/chat/schema.json',
  'src/api/post/content-types/post/schema.json',
  'src/api/comment/content-types/comment/schema.json',
  'src/api/poll/content-types/poll/schema.json'
];

schemas.forEach(file => {
  if (checkFileExists(file)) {
    const content = readFile(file);
    try {
      JSON.parse(content);
      passed++;
      console.log(`✅ ${file} is valid JSON`);
    } catch (error) {
      errors.push(`${file} contains invalid JSON`);
    }
  } else {
    errors.push(`${file} is missing`);
  }
});

// 7. Check Package.json
console.log('\n📋 Checking Package Configuration...');
if (checkFileExists('package.json')) {
  const packageJson = JSON.parse(readFile('package.json'));
  
  if (packageJson.scripts && packageJson.scripts.build) {
    passed++;
    console.log('✅ Build script exists');
  } else {
    errors.push('Build script missing in package.json');
  }
  
  if (packageJson.scripts && packageJson.scripts.start) {
    passed++;
    console.log('✅ Start script exists');
  } else {
    errors.push('Start script missing in package.json');
  }
  
  if (packageJson.engines && packageJson.engines.node) {
    passed++;
    console.log('✅ Node version specified');
  } else {
    warnings.push('Node version not specified in package.json');
  }
} else {
  errors.push('package.json is missing');
}

// 8. Check Documentation
console.log('\n📋 Checking Documentation...');
const docs = [
  'README.md',
  'PRODUCTION_DEPLOYMENT.md',
  'API_Documentation.md'
];

docs.forEach(file => {
  if (checkFileExists(file)) {
    passed++;
    console.log(`✅ ${file} exists`);
  } else {
    warnings.push(`${file} is missing`);
  }
});

// 9. Check TypeScript Configuration
console.log('\n📋 Checking TypeScript Configuration...');
if (checkFileExists('tsconfig.json')) {
  passed++;
  console.log('✅ tsconfig.json exists');
} else {
  errors.push('tsconfig.json is missing');
}

// 10. Security Checks
console.log('\n📋 Running Security Checks...');
const middlewaresContent = readFile('config/middlewares.ts');
if (middlewaresContent) {
  if (middlewaresContent.includes('strapi::security')) {
    passed++;
    console.log('✅ Security middleware configured');
  } else {
    errors.push('Security middleware not configured');
  }
  
  if (middlewaresContent.includes('strapi::cors')) {
    passed++;
    console.log('✅ CORS middleware configured');
  } else {
    errors.push('CORS middleware not configured');
  }
}

// Print Summary
console.log('\n' + '='.repeat(60));
console.log('📊 VERIFICATION SUMMARY');
console.log('='.repeat(60));
console.log(`✅ Passed: ${passed}`);
console.log(`⚠️  Warnings: ${warnings.length}`);
console.log(`❌ Errors: ${errors.length}`);

if (warnings.length > 0) {
  console.log('\n⚠️  WARNINGS:');
  warnings.forEach((warning, index) => {
    console.log(`   ${index + 1}. ${warning}`);
  });
}

if (errors.length > 0) {
  console.log('\n❌ ERRORS:');
  errors.forEach((error, index) => {
    console.log(`   ${index + 1}. ${error}`);
  });
  console.log('\n❌ Production readiness check FAILED!');
  console.log('   Please fix the errors above before deploying.\n');
  process.exit(1);
} else {
  console.log('\n✅ Production readiness check PASSED!');
  if (warnings.length > 0) {
    console.log('   Note: Please review warnings before deploying.\n');
  } else {
    console.log('   Your application is ready for production deployment! 🚀\n');
  }
  process.exit(0);
}
