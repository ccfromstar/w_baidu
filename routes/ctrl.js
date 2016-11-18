module.exports = function (app, routes) {
    app.get('/',routes.index);
    app.get('/port',routes.port);
    app.post('/service/:sql',routes.servicedo);
};