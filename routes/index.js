// var ip = "172.16.102.46";
var redis = require("redis");
// redis.debug_mode = true;
var ip = "127.0.0.1";
exports.index = function(req, res){
	res.render('index.html', {items : [{content : '123'}, {content : '<a href="#">adf</a>'}]});
};

exports.edit = function(req, res){
	res.render('edit.html', {items : [{content : '123'}, {content : '<a href="#">adf</a>'}]});
};

exports.create = function(req, res){
	console.dir(req.body);
	var client = redis.createClient(6379, ip, null);
	var id;
	var multi = client.multi();
	client.incr('yy:tzt:idgen', function(err, reply){
		if(err) console.error(err);
		id = reply;
		//console.log('id=' + id);
		var tztKey = 'yy:tzt:' + id;
		console.log('tztKey = ' + tztKey);
		multi.set(tztKey, JSON.stringify({
				id : id,
				src_uid : req.param('src_uid'),
				src_nick : req.param('src_nick'),
				cid : req.param('cid'),
				tar_uid: req.param('tar_uid'),
				tar_nick : req.param('tar_nick'),
				content: req.param('content')
			}));
		multi.rpush("yy:tzt:cid:" + req.param('cid'), id);
		multi.exec(function(err, replies){
			if(err){
				console.error(err);
			}else{
				console.info(replies);
				res.json({"result": "0"});
			}			
			client.quit();			
		});
	});	
};

exports.list = function(req, res){
	var cid = req.param('cid');
	var client = redis.createClient(6379, ip, null);
	client.lrange("yy:tzt:cid:" + cid, 0, -1, function(err, reply){
		//console.dir(reply);
		var multi = client.multi();
		//遍历返回的纸条id
		for(var i = 0; i < reply.length; i++){
			var tztKey = 'yy:tzt:' + reply[i];
			multi.get(tztKey);
		}
		multi.exec(function(err, replies){
			client.quit();
			if(err){
				console.error(err);
				return;
			}
			console.dir(replies);
			var re = [];
			for(var i = 0; i < replies.length; i++){
				re.push(JSON.parse(replies[i]));
			}			
			res.send(re);
		});		
	});		
};

exports.delKeys =  function(req, res){
	var client = redis.createClient(6379, ip, null);
	client.del('yy:tzt:12089499', function(err, res){
		console.log('del = ' + res);
	});
	res.send('ok');
};

// exports.jade = function(req, res){
	// res.render('index.jade');
// };

// exports.tengin = function(req, res){
	// console.info('tengin');
	// res.render('index.html', {name : '123'});
// };

exports.ejs = function(req, res){
	// res.render('list', {
	  // names: ['foo', 'bar', 'baz']
	// });
	res.send('ok');
};

