const config = {
    local: {
        mode: 'local',
        port: 3000,
        mongo: {
            host: '127.0.0.1',
            port: 27017
        },
        rabbit: {
            host: '127.0.0.1',
            port: 15672
        }
    },
    staging: {
        mode: 'staging',
        port: 3000,
        mongo: {
            host: '127.0.0.1',
            port: 27017
        },
        rabbit: {
            host: '127.0.0.1',
            port: 15672
        }
    },
    production: {
        mode: 'production',
        port: 3000,
        mongo: {
            host: '127.0.0.1',
            port: 27017
        },
        rabbit: {
            host: '127.0.0.1',
            port: 15672
        }
    }
}

module.exports = function(mode) {
    return config[mode || process.argv[2] || 'local'] || config.local;
}
