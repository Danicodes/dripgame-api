const assets = require('./assets');
const contributors = require('./contributors');
const models = require('./models');
const canvas = require('./canvas');
const twitch = require('./twitch');
const reports = require('./reports');
const admins = require('./admins');

function constructorMethod(app){
    app.use('/assets', assets);
    app.use('/contributors', contributors);
    app.use('/models', models);
    app.use('/canvas', canvas);
    app.use('/twitch', twitch);
    app.use('/reports', reports);
    app.use('/admins', admins);


    app.use('*', (req, res) => {
        res.status(404).json({error: 'Not found, you can fuck off then'});
    });
}

module.exports = constructorMethod;