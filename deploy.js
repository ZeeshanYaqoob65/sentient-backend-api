#!/usr/bin/env node

/**
 * SSH Deployment Script
 * 
 * This script deploys your application to a remote server via SSH.
 * 
 * Usage:
 *   node deploy.js
 *   node deploy.js --dry-run  (test without deploying)
 *   node deploy.js --skip-build  (skip local build step)
 */

const { NodeSSH } = require('node-ssh');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const config = require('./deploy.config.js');

// Parse command line arguments
const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');
const skipBuild = args.includes('--skip-build');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function error(message) {
  log(`❌ Error: ${message}`, 'red');
  process.exit(1);
}

function success(message) {
  log(`✅ ${message}`, 'green');
}

function info(message) {
  log(`ℹ️  ${message}`, 'cyan');
}

function warning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

// Validate configuration
function validateConfig() {
  if (!config.server.host || config.server.host === 'your-server-ip-or-domain') {
    error('Please set DEPLOY_HOST environment variable or update deploy.config.js');
  }

  if (!config.server.username) {
    error('Please set DEPLOY_USER environment variable or update deploy.config.js');
  }

  // Handle private key - can be a file path (string) or key content (Buffer)
  if (config.server.privateKey === null || config.server.privateKey === undefined) {
    error('SSH private key not configured. Set SSH_PRIVATE_KEY_PATH environment variable or update deploy.config.js');
  }

  // If private key is a file path (string), read it
  if (typeof config.server.privateKey === 'string') {
    const keyPath = path.isAbsolute(config.server.privateKey) 
      ? config.server.privateKey 
      : path.join(__dirname, config.server.privateKey);
    
    if (!fs.existsSync(keyPath)) {
      error(`SSH private key not found at: ${keyPath}`);
    }
    try {
      const keyContent = fs.readFileSync(keyPath);
      
      // Check if it's a PPK file (PuTTY format)
      if (keyPath.endsWith('.ppk') || keyContent.toString().includes('PuTTY-User-Key-File')) {
        warning('PPK format detected. node-ssh may not support PPK directly.');
        warning('Consider converting to OpenSSH format: puttygen deploy_key.ppk -O private-openssh -o deploy_key');
        warning('Attempting to use PPK key anyway...');
      }
      
      config.server.privateKey = keyContent;
    } catch (err) {
      error(`Failed to read SSH private key: ${err.message}`);
    }
  }
  
  // If it's already a Buffer, use it as is
}

// Execute local commands
function runLocalCommand(command, description) {
  if (isDryRun) {
    info(`[DRY RUN] Would run: ${command}`);
    return;
  }

  try {
    log(`\n📦 ${description}...`, 'blue');
    execSync(command, { stdio: 'inherit', cwd: config.paths.local });
    success(description);
  } catch (err) {
    error(`Failed to ${description.toLowerCase()}: ${err.message}`);
  }
}

// Execute remote commands via SSH
async function runRemoteCommand(ssh, command, description) {
  if (isDryRun) {
    info(`[DRY RUN] Would run on server: ${command}`);
    return { stdout: '', stderr: '', code: 0 };
  }

  try {
    log(`\n🔧 ${description}...`, 'blue');
    const result = await ssh.execCommand(command, {
      cwd: config.paths.remote,
    });

    if (result.code !== 0) {
      warning(`Command exited with code ${result.code}`);
      if (result.stderr) {
        log(result.stderr, 'yellow');
      }
    } else {
      success(description);
      if (result.stdout) {
        log(result.stdout, 'reset');
      }
    }

    return result;
  } catch (err) {
    error(`Failed to ${description.toLowerCase()}: ${err.message}`);
  }
}

// Create .env file on server
async function createEnvFile(ssh) {
  if (isDryRun) {
    info('[DRY RUN] Would create .env file on server');
    return;
  }

  log(`\n📝 Creating .env file on server...`, 'blue');

  try {
    // Build .env file content
    const envLines = Object.entries(config.env).map(([key, value]) => {
      // Escape special characters in values
      const escapedValue = String(value).replace(/"/g, '\\"').replace(/\$/g, '\\$');
      return `${key}="${escapedValue}"`;
    });

    const envContent = envLines.join('\n') + '\n';

    // Write to temporary local file first
    const tempEnvPath = path.join(__dirname, '.env.temp');
    fs.writeFileSync(tempEnvPath, envContent);

    // Upload to server
    const envPath = path.join(config.paths.remote, '.env').replace(/\\/g, '/');
    await ssh.putFile(tempEnvPath, envPath);

    // Clean up temp file
    if (fs.existsSync(tempEnvPath)) {
      fs.unlinkSync(tempEnvPath);
    }

    success('.env file created successfully');
  } catch (err) {
    error(`Failed to create .env file: ${err.message}`);
  }
}

// Create required directories on server
async function createDirectories(ssh) {
  if (isDryRun) {
    info('[DRY RUN] Would create directories (uploads, logs) on server');
    return;
  }

  log(`\n📁 Creating required directories...`, 'blue');

  try {
    const directories = [
      path.join(config.paths.remote, 'uploads').replace(/\\/g, '/'),
      path.join(config.paths.remote, 'logs').replace(/\\/g, '/'),
    ];

    for (const dir of directories) {
      await ssh.execCommand(`mkdir -p "${dir}"`);
    }

    success('Directories created successfully');
  } catch (err) {
    error(`Failed to create directories: ${err.message}`);
  }
}

// Sync files using SSH2
async function syncFiles(ssh) {
  if (isDryRun) {
    info(`[DRY RUN] Would sync files to ${config.server.host}:${config.paths.remote}`);
    return;
  }

  log(`\n📤 Syncing files to server...`, 'blue');

  try {
    // Get list of files to transfer (excluding patterns)
    const filesToTransfer = [];
    
    function shouldExclude(filePath) {
      return config.paths.exclude.some(pattern => {
        // Simple pattern matching
        if (pattern.includes('*')) {
          const regex = new RegExp(pattern.replace(/\*/g, '.*'));
          return regex.test(filePath);
        }
        return filePath.includes(pattern);
      });
    }

    function walkDir(dir, baseDir = '') {
      const files = fs.readdirSync(dir);
      for (const file of files) {
        const fullPath = path.join(dir, file);
        const relPath = path.join(baseDir, file).replace(/\\/g, '/');
        
        if (shouldExclude(relPath) || shouldExclude(file)) {
          continue;
        }

        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
          walkDir(fullPath, relPath);
        } else {
          filesToTransfer.push({ local: fullPath, remote: relPath });
        }
      }
    }

    walkDir(config.paths.local);

    log(`Found ${filesToTransfer.length} files to transfer`, 'cyan');

    // Transfer files
    let transferred = 0;
    for (const file of filesToTransfer) {
      const remotePath = path.join(config.paths.remote, file.remote).replace(/\\/g, '/');
      const remoteDir = path.dirname(remotePath).replace(/\\/g, '/');
      
      // Ensure remote directory exists
      await ssh.execCommand(`mkdir -p "${remoteDir}"`);
      
      // Transfer file
      await ssh.putFile(file.local, remotePath);
      transferred++;
      
      if (transferred % 10 === 0) {
        log(`Transferred ${transferred}/${filesToTransfer.length} files...`, 'cyan');
      }
    }

    success(`Files synced successfully (${transferred} files)`);
  } catch (err) {
    error(`Failed to sync files: ${err.message}`);
  }
}

// Main deployment function
async function deploy() {
  log('\n🚀 Starting deployment...\n', 'cyan');

  // Validate configuration
  validateConfig();

  const ssh = new NodeSSH();

  try {
    // Step 1: Pre-deployment (local build)
    if (!skipBuild && config.preDeploy.length > 0) {
      log('\n📋 Pre-deployment steps:', 'blue');
      for (const command of config.preDeploy) {
        runLocalCommand(command, `Running: ${command}`);
      }
    } else if (skipBuild) {
      warning('Skipping build step (--skip-build flag)');
    }

    // Step 2: Connect to server
    log(`\n🔌 Connecting to ${config.server.username}@${config.server.host}:${config.server.port}...`, 'blue');
    
    if (!isDryRun) {
      // Build connection options
      const connectOptions = {
        host: config.server.host,
        port: config.server.port,
        username: config.server.username,
        readyTimeout: 20000,
      };

      // Use password if available, otherwise try private key
      if (config.server.password) {
        connectOptions.password = config.server.password;
        log('Using password authentication...', 'cyan');
      } else if (config.server.privateKey) {
        connectOptions.privateKey = config.server.privateKey;
        connectOptions.passphrase = config.server.passphrase || '';
        log('Using private key authentication...', 'cyan');
      } else {
        error('No authentication method available (need password or private key)');
      }

      await ssh.connect(connectOptions);
      success('Connected to server');
    } else {
      info('[DRY RUN] Would connect to server');
    }

    // Step 3: Create remote directory if it doesn't exist
    if (!isDryRun) {
      await runRemoteCommand(
        ssh,
        `mkdir -p ${config.paths.remote}`,
        'Creating remote directory'
      );
    }

    // Step 4: Create required directories
    await createDirectories(ssh);

    // Step 5: Create .env file
    if (config.env) {
      await createEnvFile(ssh);
    }

    // Step 6: Sync files
    await syncFiles(ssh);

    // Step 7: Post-deployment (remote commands)
    if (config.postDeploy.length > 0) {
      log('\n📋 Post-deployment steps:', 'blue');
      for (const command of config.postDeploy) {
        await runRemoteCommand(ssh, command, `Running: ${command}`);
      }
    }

    // Step 8: Show PM2 status
    if (!isDryRun) {
      await runRemoteCommand(ssh, 'pm2 status', 'PM2 Status');
    }

    success('\n🎉 Deployment completed successfully!');

  } catch (err) {
    error(`Deployment failed: ${err.message}`);
  } finally {
    if (!isDryRun && ssh.isConnected()) {
      ssh.dispose();
      log('\n🔌 Disconnected from server', 'blue');
    }
  }
}

// Run deployment
deploy().catch((err) => {
  error(`Unexpected error: ${err.message}`);
  process.exit(1);
});

