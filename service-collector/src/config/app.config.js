const config = {
    local: {
        mode: 'local',
        port: 3000,
        mongo: {
            host: 'host.docker.internal',
            port: 27017
        },
        rabbit: {
            host: 'host.docker.internal',
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
    return config.local;
}
