module.exports={
    port: process.env.PORT || 3000,
    pool: {
        connectionLimit: 100,
        host: 'localhost',
        port: 3306,
        user: 'user',
        password: 'password',
        database: 'shipments',
        timezone: 'utc'
    }
}