module.exports = function (app, routes) {
    app.get('/',routes.index);
    app.post('/service/:sql',routes.servicedo);
};