
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
  //app.use(express.logger());//���http��־
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});


// Routes
console.log(routes);
app.get('/edit', routes.edit);
app.get('/', routes.index);
app.all('/list', routes.list);

app.get('/create', routes.create);
app.get('/delKeys', routes.delKeys);
app.get('/jade', routes.jade);
app.get('/tenjin', routes.tengin);
app.get('/ejs', routes.ejs);

app.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
