module.exports = function (app, routes) {
    app.get('/',routes.index);
    app.get('/port',routes.port);
    app.get('/face',routes.face);
    app.get('/words',routes.words);
    app.get('/card',routes.card);
    app.get('/leader',routes.leader);
    app.get('/robot',routes.robot);
    app.get('/sr',routes.sr);
    app.post('/service/:sql',routes.servicedo);
};