module.exports = {
    load: {
        before: ['responseTime', 'logger', 'cors', 'responses'],
        order: [],
        after: ['parser', 'router'],
    },
    settings: {
        cors: {
            enabled: true,
            headers: ['*'],
            origin: '*', //allow all
        },
    },
}