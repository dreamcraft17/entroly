module.exports = {
    apps: [
        {
            name: 'entroly',
            script: 'node_modules/next/dist/bin/next',
            args: 'start',
            cwd: '/data/projects/Entroly',
            instances: 1,
            autorestart: true,
            watch: false,
            node_args: '--max-old-space-size=10000', // 10GB heap for in-memory cache
            max_memory_restart: '16G',
            env: {
                NODE_ENV: 'production',
                PORT: 4013
            }
        }
    ]
};
