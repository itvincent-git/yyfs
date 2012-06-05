var util = require('util');
var redis = require("redis");
var path = require("path");
var ip = "127.0.0.1", port = 36379;
var client = redis.createClient(port, ip, null);

var winston = require('winston');
var logger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)({timestamp : true}),
        new (winston.transports.File)({ filename: 'slog.log', timestamp : true, maxsize : 100000000 })
    ]
    ,exceptionHandlers: [
        new winston.transports.File({ filename: 'exceptions.log' })
    ]
    ,exitOnError: false
});
//winston.add(winston.transports.File, { filename: 'slog.log' });
//winston.handleExceptions(new winston.transports.File({ filename: 'exceptions.log' }))

//var poolModule = require('generic-pool');
//var pool = poolModule.Pool({
//    name     : 'redis',
//    create   : function(callback) {
//        var client = redis.createClient(port, ip, null);
//        // parameter order: err, resource
//        // new in 1.0.6
//        callback(null, client);
//    },
//    destroy  : function(client) { client.quit(); },
//    max      : 10,
//    idleTimeoutMillis : 30000,
//    log : false
//});

client.on("error", function (err) {
    logger.error("redis client error " + err);
});
// redis.debug_mode = true;

exports.index = function(req, res){	
//	res.render('index.html');
    res.sendfile(path.resolve(__dirname, '..', 'views/index.html'));
};

//exports.edit = function(req, res){
//	res.render('edit.html', {items : [{content : '123'}, {content : '<a href="#">adf</a>'}]});
//};

exports.create = function(req, res){
    logger.info('create req =' + util.inspect(req.body));

    if(req.param('content').length > 70){
        res.json({"result": "60001"});
        return;
    }
    if(req.param('content').length < 1){
        res.json({"result": "60002"});
        return;
    }

    //sticker id
	var id;
	var multi = client.multi();

	client.incr('yy:sticker:idgen', function(err, reply){
		if(err) logger.error(err);
		id = reply;
        logger.info('idgen=' + id);

        //sticker key
		var tztKey = 'yy:sticker:' + id;
//        logger.info('sticker Key = ' + tztKey);

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
				logger.error(err);
			}else{
				logger.info('create replies=' + replies);
				res.json({"result": "0"});
			}
		});
	});	
};

exports.list = function(req, res, next){
	var cid = req.param('cid');
    logger.debug('cid = ' + cid);

//    pool.acquire(function(err, client) {
    client.sort("yy:sticker:cid:" + cid , 'get',  'yy:sticker:*', 'DESC', function(err, replies){
        if(err){
            logger.error(err);
            return;
        }
        logger.debug("list = " + replies.length);
        var re = [];
        for(var i = 0; i < replies.length; i++){
            re.push(JSON.parse(replies[i]));
        }
        res.send(re);
//            pool.release(client);
    });
//    });
};

exports.notRemind = function(req, res, next){
    var uid = req.param('uid');
    var v = req.param('v');
    logger.debug('uid = ' + uid + ', v = ' + v);

    client.set('yy:sticker:v:' + uid , v, function(err, replies){
        if(err){
            logger.error(err);
            res.json({"result": "1", "message" : err});
            return;
        }
        logger.info("notRemind version = " + replies);
        res.json({"result": "0"});
    });

}

exports.delete = function(req, res){
    logger.info('delete req = ' + util.inspect(req.body));
    var cid = req.param('cid');
    var id = req.param('stickerId');

    var multi = client.multi();
    multi.lrem("yy:sticker:cid:" + cid, 0, id);
    multi.del('yy:sticker:' + id);

    multi.exec(function(err, replies){
        if(err){
            logger.error(err);
            res.json({"result": "1", "message" : err});
            return;
        }
        logger.info("delete = " + replies);
        res.json({"result": "0"});
    });
};

exports.delKeys =  function(req, res){
//	var client = redis.createClient(port, ip, null);
	client.keys('*', function(err, reply){
		for(var i=0;i<reply.length;i++){
//            client.del(reply[i]);
            logger.info('delete key='+reply[i]);
        }

	});
	res.send('ok');
};

exports.userInfo = function(req, res){
    var uid = req.param('uid');
    client.get('yy:sticker:v:' + uid, function(err, replies){
        if(err){
            logger.error(err);
            res.json({"result": "1", "message" : err});
            return;
        }
        logger.debug("userInfo uid = " + uid + " info = " + replies);
        res.json({"v": replies});
    });
};