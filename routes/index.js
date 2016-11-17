var settings = require('../settings');
var mysql = require('../models/db');
var request = require("request");
var fs = require('fs');
var APIKey = 'XZ14ldH1day6utemOleMmV1h';
var SecretKey = 'f62e4f13a76413e1806a0e4c37d8aef7';

exports.index = function(req, res) {
	res.render("index");
}

exports.servicedo = function(req, res) {
	res.setHeader("Access-Control-Allow-Origin", "*");
	var sql = req.params.sql;
	if(sql == "TTS") {
		console.log('TTS run');
		
		var url1 = 'https://openapi.baidu.com/oauth/2.0/token';
		request({
		    url: url1,
		    method: 'POST',
		    form: {
		        grant_type: 'client_credentials',
		        client_id: APIKey,
		        client_secret: SecretKey
		    }
		}, function(err, response, body) {
		    if (!err && response.statusCode == 200) {
		        var access_token = JSON.parse(body).access_token;
		        var tex = '文本内容1';
		        var cuid = '192.168.1.2';
		        var url2 = 'http://tsn.baidu.com/text2audio?tex='+tex+'&lan=zh&cuid='+cuid+'&ctp=1&tok='+access_token;
		        console.log(url2);
		        res.send(url2);
		        /*
		        request(url2,function(error,response,body){
				    if(!error && response.statusCode == 200){
				        //输出返回的内容
				        console.log(response.headers['content-type']);
				        console.log(response.headers);
				        res.pipe(response);
				        //console.log(response.body);
				        
				        fs.writeFile('public/upload/1.mp3', response, function (err) {
					        if (err) throw err;
					        console.log("Export Account Success!");
					    });
					   
					   	var savedAudio = fs.createWriteStream('public/upload/1.mp3');
					    savedAudio.on('finish', function(){
					      console.log('savedAudio finished.');
					      process.exit(0);
					    })
					    body.pipe(savedAudio);
					   
				    }
				});*/
		    }
		});
	}
}