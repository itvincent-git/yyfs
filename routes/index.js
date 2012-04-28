
/*
 * GET home page.
 */
// var ip = "172.16.102.46";
var ip = "127.0.0.1";
exports.index = function(req, res){
	// var redis = require("redis"), client = redis.createClient(6379, "172.16.102.46", null);
	// client.set("foo:test:1000", "redis");
	// client.get("foo:test:1000", function(err, re){
		// console.log(re);
		// res.render('index', { title: re + "123" })
	// });
	//var cid = req.param('cid');
	
	
	res.redirect('/html/create.html');
};

exports.create = function(req, res){
	var src_uid = req.param('src_uid');
	var cid = req.param('cid');
	var tar_uid = req.param('tar_uid');
	var content = req.param('content');
	console.dir(req.body);
	var redis = require("redis"), client = redis.createClient(6379, ip, null);
	var id;
	client.incr('yy:tzt:idgen', function(err, res){
		if(err) console.error(err);
		id = res;
		console.log('id=' + id);
		var tztKey = 'yy:tzt:' + id;
		console.log('tztKey = ' + tztKey);
		client.set(tztKey, JSON.stringify({src_uid : src_uid, cid : cid, tar_uid: tar_uid, content: content}), function(err1, res1){
			if(err1) console.error(err1);
			console.log('set =' + res1);
		});
		client.rpush("yy:tzt:cid:" + cid, id, function(err, res){
			console.log('rpush = ' + res);
		});
	});
	
	res.json({"result": "0"});
		
	
};

exports.list = function(req, res){
	var cid = '12089499';
	var redis = require("redis"), client = redis.createClient(6379, ip, null);
	client.lrange("yy:tzt:cid:" + cid, 0, -1, function(err, reply){
		
		//var list = JSON.parse(reply);
		console.dir(reply);
		res.send(reply);
	});	
	
}

exports.delKeys =  function(req, res){
	var redis = require("redis"), client = redis.createClient(6379, ip, null);
	client.del('yy:tzt:12089499', function(err, res){
		console.log('del = ' + res);
	});
	res.send('ok');
}

