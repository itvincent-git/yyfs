
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes');

var app = module.exports = express.createServer();

app.register(".html", require('tenjin'));
// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  //app.set('view engine', 'jade');
  app.set('view options', {layout: false});
  //app.set('view engine', 'ejs');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  //app.use(express.logger());//http日志
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  //app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes
console.log(routes);

app.get('/', routes.index);
app.post('/list', routes.list);
app.post('/create', routes.create);
app.post('/delete', routes.delete);

app.error(function(err, req, res, next){
    res.send(err, 404);
});

app.get('/delKeys1983aawLG', routes.delKeys);

app.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
