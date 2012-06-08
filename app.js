
/**
 * Module dependencies.
 */

var express = require('express')
    , routes = require('./routes')
    , namespace = require('express-namespace')
    , gzippo = require('gzippo');
//    , resource = require('express-resource')


var app = module.exports = express.createServer();

app.register(".html", require('tenjin'));
//app.register('.html', {
//    compile: function(str, options){
//        return function(locals){
//            return str;
//        };
//    }
//});
// Configuration

app.configure(function(){
    app.set('views', __dirname + '/views');
    //app.set('view engine', 'jade');
    app.set('view options', {layout: false});
    //app.set('view engine', 'ejs');
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);

//    var oneHour = 24 * 60 * 60 * 1000;
//    app.use('/sticker', express.static(__dirname + '/public', { maxAge: oneHour }));
    app.use(express.static(__dirname + '/public'));
    app.use('/sticker', gzippo.staticGzip(__dirname + '/public'));

//    app.use(connect.compress());
//  app.use(express.logger());//http日志
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes
console.log(routes);

app.namespace('/sticker', function() {
    app.get('/', routes.index);
    app.post('list', routes.list);
    app.post('create', routes.create);
    app.post('delete', routes.delete);
    app.post('iknow', routes.notRemind);
    app.post('user', routes.userInfo);
});

app.get('/', routes.index);
app.post('list', routes.list);
app.post('create', routes.create);
app.post('delete', routes.delete);
app.post('iknow', routes.notRemind);
app.post('user', routes.userInfo);

app.error(function(err, req, res, next){
    res.send(err, 404);
});

//app.get('/delKeys1983aawLG', routes.delKeys);

//app.get('/hello', function(req, res){
//    res.send('hello');
//});

app.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
