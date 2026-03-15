module.exports = {
  apps: [
    {
      name: "paws-and-petals",
      script: "node_modules/.bin/next",
      args: "dev",
      cwd: __dirname,
      watch: false,              // Next.js has its own HMR — don't double-watch
      autorestart: true,         // restart if the process crashes
      max_restarts: 10,          // give up after 10 rapid crashes
      min_uptime: "5s",          // a restart counts only if it lived ≥5s
      restart_delay: 2000,       // wait 2s between restart attempts
      env: {
        NODE_ENV: "development",
        PORT: 3000,
      },
      // Stream logs to ~/.pm2/logs/
      out_file: "~/.pm2/logs/paws-and-petals-out.log",
      error_file: "~/.pm2/logs/paws-and-petals-error.log",
      merge_logs: true,
      log_date_format: "YYYY-MM-DD HH:mm:ss",
    },
  ],
};
