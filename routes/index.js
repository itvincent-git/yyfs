
/*
 * GET home page.
 */

exports.index = function(req, res){
	var redis = require("redis"), client = redis.createClient(6379, "172.16.102.46", null);
	client.set("foo:test:1000", "redis");
	client.get("foo:test:1000", function(err, re){
		console.log(re);
		res.render('index', { title: re + "123" })
	});	
	
};