const config = {
    local: {
        mode: 'local',
        port: 4000,
        mongo: {
            host: '127.0.0.1',
            port: 27017
        },
        rabbit: {
            host: '127.0.0.1',
            port: 15672
        },
        mysql: {
            host: '127.0.0.1',
            port: 3306,
            user: 'monty',
            password: 'some_pass',
            db: 'upsellx'
        }
    },
    staging: {
        mode: 'staging',
        port: 6000,
        mongo: {
            host: '127.0.0.1',
            port: 27017
        },
        rabbit: {
            host: '127.0.0.1',
            port: 15672
        },
        mysql: {
            host: '127.0.0.1',
            port: 3306,
            user: 'monty',
            password: 'some_pass',
            db: 'upsellx'
        }
    },
    production: {
        mode: 'production',
        port: 4000,
        mongo: {
            host: '127.0.0.1',
            port: 27017
        },
        rabbit: {
            host: '127.0.0.1',
            port: 15672
        },
        mysql: {
            host: '127.0.0.1',
            port: 3306,
            user: 'monty',
            password: 'some_pass',
            db: 'upsellx'
        }
    }
}

module.exports = function(mode) {
    return config[mode || process.argv[2] || 'local'] || config.local;
}
