var redis = require("redis");
var ip = "127.0.0.1", port = 36379;
var client = redis.createClient(port, ip, null);
client.on("error", function (err) {
    console.log("Error " + err);
});
// redis.debug_mode = true;

exports.index = function(req, res){	
	res.render('index.html');
};

exports.edit = function(req, res){
	res.render('edit.html', {items : [{content : '123'}, {content : '<a href="#">adf</a>'}]});
};

exports.create = function(req, res){
	console.dir(req.body);
//	var client = redis.createClient(port, ip, null);

    //sticker id
	var id;
	var multi = client.multi();

	client.incr('yy:sticker:idgen', function(err, reply){
		if(err) console.error(err);
		id = reply;
		console.log('id=' + id);

        //sticker key
		var tztKey = 'yy:sticker:' + id;
		console.log('sticker Key = ' + tztKey);

		multi.set(tztKey, JSON.stringify({
				id : id,
				src_uid : req.param('src_uid'),
				src_nick : req.param('src_nick'),
				cid : req.param('cid'),
				tar_uid: req.param('tar_uid'),
				tar_nick : req.param('tar_nick'),
				content: req.param('content')
			}));

        //add to the sticker channel list
		multi.rpush("yy:sticker:cid:" + req.param('cid'), id);

        //add the sticker channel to the set
        multi.sadd("yy:sticker:cids", req.param('cid'));


		multi.exec(function(err, replies){
			if(err){
				console.error(err);
			}else{
				console.info(replies);
				res.json({"result": "0"});
			}			
//			client.quit();
		});
	});	
};

exports.list = function(req, res, next){
	var cid = req.param('cid');
    console.info('cid = ' + cid);
	
//	var client = redis.createClient(port, ip, null);

    //get the sticker ids in the channel
	client.lrange("yy:sticker:cid:" + cid, 0, -1, function(err, reply){
        if(err) {
            return console.error('lrange = ' + err);
        }
		console.info("yy:sticker:cid:" + cid + "=" + reply);
		var multi = client.multi();

		for(var i = 0; i < reply.length; i++){
			var tztKey = 'yy:sticker:' + reply[i];
            //get sticker by id
			multi.get(tztKey);
		}

		multi.exec(function(err, replies){
//			client.quit();
			if(err){
				console.error(err);
				return;
			}
			console.info("list = " + replies);
			var re = [];
			for(var i = 0; i < replies.length; i++){
				re.push(JSON.parse(replies[i]));
			}
			res.send(re);
		});		
	});		
};

exports.delete = function(req, res){
    console.dir(req.body);
    var cid = req.param('cid');
    var id = req.param('stickerId');

//    var client = redis.createClient(port, ip, null);
    var multi = client.multi();
    multi.lrem("yy:sticker:cid:" + cid, 0, id);
    multi.del('yy:sticker:' + id);

    multi.exec(function(err, replies){
//        client.quit();
        if(err){
            console.error(err);
            res.json({"result": "1", "message" : err});
            return;
        }
        console.info("delete = " + replies);
        res.json({"result": "0"});
    });
};

exports.delKeys =  function(req, res){
//	var client = redis.createClient(port, ip, null);
	client.keys('*', function(err, reply){
		for(var i=0;i<reply.length;i++){
//            client.del(reply[i]);
            console.info('delete key='+reply[i]);
        }

	});
	res.send('ok');
};


