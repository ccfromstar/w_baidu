module.exports = function (app, routes) {
    app.get('/',routes.index);
    app.get('/port',routes.port);
    app.get('/face',routes.face);
    app.get('/words',routes.words);
    app.post('/service/:sql',routes.servicedo);
};