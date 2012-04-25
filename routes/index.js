
/*
 * GET home page.
 */

exports.index = function(req, res){
	// var redis = require("redis"), client = redis.createClient(6379, "172.16.102.46", null);
	// client.set("foo:test:1000", "redis");
	// client.get("foo:test:1000", function(err, re){
		// console.log(re);
		// res.render('index', { title: re + "123" })
	// });	
	res.redirect('/html/create.html');
};

exports.create = function(req, res){
	var src_uid = req.param('src_uid');
	var content = req.param('content');
	console.dir(req.body);
	//console.info('src_uid = ' + src_uid + ', content = ' + content);
	// res.contentType('application/json');
	res.json({"result": "0"});
	//var redis = require("redis"), client = redis.createClient(6379, "172.16.102.46", null);
	//client.set("jz:uid:", "redis");
		
	
};