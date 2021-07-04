const config = {
    local: {
        mode: 'local',
        port: 3000,
        mongo: {
            host: 'mongo',
            port: 27017
        },
        rabbit: {
            host: 'rabbitmq',
            port: 15672
        },
        mysql: {
            host: 'mariadb',
            port: 3306,
            user: 'root',
            password: 'passpass',
            db: 'upsellx'
        }
    }
}

module.exports = function(mode) {
    return config[mode || process.argv[2] || 'local'] || config.local;
}
