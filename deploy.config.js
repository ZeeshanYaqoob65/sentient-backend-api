/**
 * SSH Deployment Configuration
 */
module.exports = {
  // Server connection details
  server: {
    host: process.env.DEPLOY_HOST || 'api.sentientapp.pk',
    port: process.env.DEPLOY_PORT || 22,
    username: process.env.DEPLOY_USER || 'apisentientapp',
    // Path to your private SSH key (PPK format is supported)
    privateKey: process.env.SSH_PRIVATE_KEY_PATH || require('path').join(__dirname, 'deploy_key.ppk'),
    // Or use password authentication (less secure) - fallback if key doesn't work
    password: process.env.DEPLOY_PASSWORD || 'Ap1@2o25!@',
    
    // Optional: passphrase for encrypted private key
    passphrase: process.env.SSH_PASSPHRASE || '',
  },

  // Deployment paths
  paths: {
    // Local project root (current directory)
    local: process.cwd(),
    
    // Remote server deployment directory (cPanel path)
    remote: process.env.DEPLOY_REMOTE_PATH || '/home/apisentientapp/public_html',
    
    // Files/folders to exclude from deployment
    exclude: [
      'node_modules',
      '.git',
      '.env',
      'logs',
      '*.log',
      '.DS_Store',
      'uploads',
      '.vscode',
      '.idea',
      'deploy.config.js',
      'deploy.js',
      '.gitignore',
      '.env.temp',
    ],
  },

  // Pre-deployment commands (run locally before deployment)
  preDeploy: [
    'npm run build', // Build locally, dist folder will be synced
  ],

  // Post-deployment commands (run on remote server)
  postDeploy: [
    'cd /home/apisentientapp/public_html',
    'npm install --production',
    'npm install -g pm2 || true', // Install PM2 globally if not installed
    'chmod +x dist/index.js || true', // Ensure executable permissions
    'npm run migration:run || true', // Run migrations if any, ignore errors
    'pm2 restart sentient-api || pm2 start ecosystem.config.js', // Restart or start PM2
    'pm2 save || true', // Save PM2 process list
  ],

  // Environment variables to set on server
  // These will be written to .env file on the server
  env: {
    NODE_ENV: 'production',
    DB_HOST: 'localhost',
    DB_PORT: '3306',
    DB_USERNAME: 'apisentientapp_node',
    DB_PASSWORD: 'Zeeshan@1234',
    DB_DATABASE: 'apisentientapp_sentient_beta',
    PORT: '3000',
    JWT_SECRET: process.env.JWT_SECRET || 'e25e7604c04ab5e23244204dd3cbb2c69c2ce86660c025a03e68e9499c32a3605c1198401ec98132b9bdf30d18f25a4221fac13b1f47e69e098cb61a022f384c',
    CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
    UPLOAD_PATH: './uploads',
    MAX_FILE_SIZE: '5242880', // 5MB
  },
};

