module.exports = {

    production: {
        client: 'postgresql',
        connection: process.env.DATABASE_URL,
        migrations: {
            directory: './migrations',
        },
        seeds: {
            directory: './seeds/prod',
        }
    },

    development: {
        client: 'postgresql',
        connection: {
            database: 'group1-week6-dev',
            user: 'morio',
            password: '',
            host: 'localhost',
            port: 5432
        },
        migrations: {
            directory: './migrations',
        },
        seeds: {
            directory: './seeds/dev',
        },
    },

    test: {
        client: 'postgresql',
        connection: {
            database: 'group1-week6-test',
            user: 'morio',
            password: '',
            host: 'localhost',
            port: 5432
        },
        migrations: {
            directory: './migrations',
        },
        seeds: {
            directory: './seeds/test',
        },
    }
}