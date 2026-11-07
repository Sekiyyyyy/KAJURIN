module.exports = {
  apps: [
    {
      name: 'kajurin',
      cwd: '/var/www/KAJURIN',
      script: 'server/index.js',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '300M'
    }
  ]
};

