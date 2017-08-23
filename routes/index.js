var settings = require('../settings');
var mysql = require('../models/db');
var request = require("request");
var fs = require('fs');
var APIKey = settings.APIKey;
var SecretKey = settings.SecretKey;
var APPCODE = settings.APPCODE;
var url = require('url');
var crypto = require('crypto');
var http = require('http');

exports.index = function(req, res) {
	res.render("index");
}

exports.sr = function(req, res) {
	res.render("sr");
}

exports.port = function(req, res) {
	var sql1 = "select * from cruise_port where txtCruiseAreaNo='hq6'";
	mysql.query(sql1, function(err, rows1) {
		res.render("port",{
			ports:rows1
		});
	});
}

exports.face = function(req, res) {
	res.render("face");
}

exports.words = function(req, res) {
	res.render("words");
}

exports.card = function(req, res) {
	res.render("card");
}

exports.leader = function(req, res) {
	res.render("leader");
}

exports.robot = function(req, res) {
	res.render("robot");
}

exports.servicedo = function(req, res) {
	res.setHeader("Access-Control-Allow-Origin", "*");
	var sql = req.params.sql;
	if(sql == "TTS") {
		console.log('TTS run');
		var id = req.param("id");
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
		        var sql1 = 'select txtPortCityInfo from cruise_port where id = '+id;
		        mysql.query(sql1, function(err, rows1) {
					var tex = rows1[0].txtPortCityInfo;
			        var cuid = '192.168.1.2';
			        var url2 = 'http://tsn.baidu.com/text2audio?tex='+tex+'&lan=zh&cuid='+cuid+'&ctp=1&tok='+access_token;
			        res.send(url2);
				});
		    }
		});
	}else if(sql == "SR"){
		console.log('SR run');
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
		        var url2 = 'http://vop.baidu.com/server_api?lan=zh&cuid=baidu_workshop&token='+access_token;
		        var formData = {
		        	"format":"wav",
				    "rate":8000,
				    "channel":1,
				    "token":access_token,
				    "cuid":"baidu_workshop",
				    "url":"http://www.cruisesh.com:8086/upload/1.wav",
				    "callback":""
		        };
		        request({
				    url: url2,
				    method: 'POST',
				    body: formData
				}, function(err, response, body) {
				    if (!err && response.statusCode == 200) {
				        console.log(body);
				    }
				});
		    }
		});
	}else if(sql == "BFR"){
		var imgurl = req.param("img2");  //一张网络图片
		//var imgurl = 'http://ov0jz16b6.bkt.clouddn.com/hz2.jpg';  //一张网络图片

		http.get(imgurl,function(res1){
		　　var chunks = []; //用于保存网络请求不断加载传输的缓冲数据
		　　var size = 0;　　 //保存缓冲数据的总长度

		　　res1.on('data',function(chunk){
		　　　　chunks.push(chunk);　 //在进行网络请求时，会不断接收到数据(数据不是一次性获取到的)，

		　　　　　　　　　　　　　　　　//node会把接收到的数据片段逐段的保存在缓冲区（Buffer），

		　　　　　　　　　　　　　　　　//这些数据片段会形成一个个缓冲对象（即Buffer对象），

		　　　　　　　　　　　　　　　　//而Buffer数据的拼接并不能像字符串那样拼接（因为一个中文字符占三个字节），

		　　　　　　　　　　　　　　　　//如果一个数据片段携带着一个中文的两个字节，下一个数据片段携带着最后一个字节，

		　　　　　　　　　　　　　　　　//直接字符串拼接会导致乱码，为避免乱码，所以将得到缓冲数据推入到chunks数组中，

		　　　　　　　　　　　　　　　　//利用下面的node.js内置的Buffer.concat()方法进行拼接

		　　　　　　　　　
		　　　　size += chunk.length;　　//累加缓冲数据的长度
		　　});

		　　

		　　res1.on('end',function(err){

		　　　　var data = Buffer.concat(chunks, size);　　//Buffer.concat将chunks数组中的缓冲数据拼接起来，返回一个新的Buffer对象赋值给data

		　　　　//console.log(Buffer.isBuffer(data));　　　　//可通过Buffer.isBuffer()方法判断变量是否为一个Buffer对象

		　　　　

		　　　　var base64Img = data.toString('base64');　　//将Buffer对象转换为字符串并以base64编码格式显示

		　　　　//console.log(base64Img);　　 //进入终端terminal,然后进入index.js所在的目录，

		　　　　　　　　　　　　　　　　　　　//在终端中输入node index.js

		　　　　　　　　　　　　　　　　　　　//打印出来的就是图片的base64编码格式，格式如下　
				/*调用阿里云护照识别接口*/
				var date = new Date().toUTCString();
				var url1 = 'http://ocrhz.market.alicloudapi.com/rest/160601/ocr/ocr_passport.json';

				var options = {
				  url : url1,
				  method: 'POST',
				  body: '{"inputs": [{"image": {"dataType": 50,"dataValue": "'+base64Img+'"}}]}',
				  headers: {
				    'accept': 'application/json',
				    'content-type': 'application/json',
				    'date': date,
				    'Authorization': 'APPCODE '+APPCODE
				  }
				};
				
				request(options, function(err, response, body) {
				    if (!err && response.statusCode == 200) {
				    	console.log("----------------------------->"+body);
				        res.json(body);
				    }else{
				    	console.log(err);
				    	console.log(response.statusCode);
				    }
				});　　　
				/*End*/
		　　});

		});

		/*百度OCR
		console.log('BFR run');
		var ak = settings.ak;
		var sk = settings.sk;
		var ocr = require('baidu-ocr-api').create(ak,sk);
	
		ocr.scan({
			url:'http://www.cruisesh.com:8086/img/test.jpg', 
			type:'text',
		}).then(function (result) {
			console.log(result);
			//result.results.words = '护照号：G16098350<br/>姓名：王恺<br/>性别：男<br/>身份证号：14220119851206075X<br/>出生日期：06 DEC 1985<br/>出生地：山西<br/>签发日期：06 APR 2006<br/>有效期至：05 APR 2011<br/>签发地：北京';
			res.json(result);
		}).catch(function (err) {
			console.log('err', err);
		})*/
	}else if(sql == "BFRcard"){
		/*身份证信息*/
		console.log('BFRcard run');
		var imgurl = req.param("img1");  //一张网络图片
	    //var imgurl = "http://www.cruisesh.com:8086/upload/7822-1h2h0op.jpg";

		http.get(imgurl,function(res1){
		　　var chunks = []; //用于保存网络请求不断加载传输的缓冲数据
		　　var size = 0;　　 //保存缓冲数据的总长度

		　　res1.on('data',function(chunk){
		　　　　chunks.push(chunk);　 //在进行网络请求时，会不断接收到数据(数据不是一次性获取到的)，

		　　　　　　　　　　　　　　　　//node会把接收到的数据片段逐段的保存在缓冲区（Buffer），

		　　　　　　　　　　　　　　　　//这些数据片段会形成一个个缓冲对象（即Buffer对象），

		　　　　　　　　　　　　　　　　//而Buffer数据的拼接并不能像字符串那样拼接（因为一个中文字符占三个字节），

		　　　　　　　　　　　　　　　　//如果一个数据片段携带着一个中文的两个字节，下一个数据片段携带着最后一个字节，

		　　　　　　　　　　　　　　　　//直接字符串拼接会导致乱码，为避免乱码，所以将得到缓冲数据推入到chunks数组中，

		　　　　　　　　　　　　　　　　//利用下面的node.js内置的Buffer.concat()方法进行拼接

		　　　　　　　　　
		　　　　size += chunk.length;　　//累加缓冲数据的长度
		　　});

		　　

		　　res1.on('end',function(err){

		　　　　var data = Buffer.concat(chunks, size);　　//Buffer.concat将chunks数组中的缓冲数据拼接起来，返回一个新的Buffer对象赋值给data

		　　　　//console.log(Buffer.isBuffer(data));　　　　//可通过Buffer.isBuffer()方法判断变量是否为一个Buffer对象

		　　　　

		　　　　var base64Img = data.toString('base64');　　//将Buffer对象转换为字符串并以base64编码格式显示

		　　　　//console.log(base64Img);　　 //进入终端terminal,然后进入index.js所在的目录，

		　　　　　　　　　　　　　　　　　　　//在终端中输入node index.js

		　　　　　　　　　　　　　　　　　　　//打印出来的就是图片的base64编码格式，格式如下　
				/*调用阿里云身份证识别接口*/
				var date = new Date().toUTCString();
				var url1 = 'http://dm-51.data.aliyun.com/rest/160601/ocr/ocr_idcard.json';

				var options = {
				  url : url1,
				  method: 'POST',
				  body: '{"inputs": [{"image": {"dataType": 50,"dataValue": "'+base64Img+'"},"configure": {"dataType": 50,"dataValue": "{\\\"side\\\":\\\"face\\\"}"}}]}',
				  headers: {
				    'accept': 'application/json',
				    'content-type': 'application/json',
				    'date': date,
				    'Authorization': 'APPCODE '+APPCODE
				  }
				};
				
				request(options, function(err, response, body) {
				    if (!err && response.statusCode == 200) {
				    	console.log("----------------------------->"+body);
				        res.send(body);
				    }else{
				    	console.log(err);
				    	console.log(response);
				    	console.log(response.statusCode);
				    }
				});　　　
				/*End*/
		　　});

		});
		/**百度OCR
		var ak = settings.ak;
		var sk = settings.sk;
		var ocr = require('baidu-ocr-api').create(ak,sk);
	
		ocr.scan({
			url:'http://www.cruisesh.com:8086/img/card.jpg', 
			type:'text',
		}).then(function (result) {
			console.log(result);
			//result.results.words = '姓名：尹良<br/>性别：男<br/>出生日期：1988 2 6 <br/>住址：山东省淄博市博山区南博 山镇南博山西村76号<br/>身份证号码：370304198802065116';
			res.json(result);
		}).catch(function (err) {
			console.log('err', err);
		})**/
	}else if(sql == "BFRcardback"){
		/*身份证信息*/
		console.log('BFRcard run');
		var imgurl = req.param("img1");  //一张网络图片
		//var imgurl = "http://www.cruisesh.com:8086/upload/7822-1xoby1r.jpg";

		http.get(imgurl,function(res1){
		　　var chunks = []; //用于保存网络请求不断加载传输的缓冲数据
		　　var size = 0;　　 //保存缓冲数据的总长度

		　　res1.on('data',function(chunk){
		　　　　chunks.push(chunk);　 //在进行网络请求时，会不断接收到数据(数据不是一次性获取到的)，

		　　　　　　　　　　　　　　　　//node会把接收到的数据片段逐段的保存在缓冲区（Buffer），

		　　　　　　　　　　　　　　　　//这些数据片段会形成一个个缓冲对象（即Buffer对象），

		　　　　　　　　　　　　　　　　//而Buffer数据的拼接并不能像字符串那样拼接（因为一个中文字符占三个字节），

		　　　　　　　　　　　　　　　　//如果一个数据片段携带着一个中文的两个字节，下一个数据片段携带着最后一个字节，

		　　　　　　　　　　　　　　　　//直接字符串拼接会导致乱码，为避免乱码，所以将得到缓冲数据推入到chunks数组中，

		　　　　　　　　　　　　　　　　//利用下面的node.js内置的Buffer.concat()方法进行拼接

		　　　　　　　　　
		　　　　size += chunk.length;　　//累加缓冲数据的长度
		　　});

		　　

		　　res1.on('end',function(err){

		　　　　var data = Buffer.concat(chunks, size);　　//Buffer.concat将chunks数组中的缓冲数据拼接起来，返回一个新的Buffer对象赋值给data

		　　　　//console.log(Buffer.isBuffer(data));　　　　//可通过Buffer.isBuffer()方法判断变量是否为一个Buffer对象

		　　　　

		　　　　var base64Img = data.toString('base64');　　//将Buffer对象转换为字符串并以base64编码格式显示

		　　　　//console.log(base64Img);　　 //进入终端terminal,然后进入index.js所在的目录，

		　　　　　　　　　　　　　　　　　　　//在终端中输入node index.js

		　　　　　　　　　　　　　　　　　　　//打印出来的就是图片的base64编码格式，格式如下　
				/*调用阿里云身份证识别接口*/
				var date = new Date().toUTCString();
				var url1 = 'http://dm-51.data.aliyun.com/rest/160601/ocr/ocr_idcard.json';

				var options = {
				  url : url1,
				  method: 'POST',
				  body: '{"inputs": [{"image": {"dataType": 50,"dataValue": "'+base64Img+'"},"configure": {"dataType": 50,"dataValue": "{\\\"side\\\":\\\"back\\\"}"}}]}',
				  headers: {
				    'accept': 'application/json',
				    'content-type': 'application/json',
				    'date': date,
				    'Authorization': 'APPCODE '+APPCODE
				  }
				};
				
				request(options, function(err, response, body) {
				    if (!err && response.statusCode == 200) {
				    	console.log("----------------------------->"+body);
				        res.send(body);
				    }else{
				    	console.log(err);
				    	console.log(response);
				    	console.log(response.statusCode);
				    }
				});　　　
				/*End*/
		　　});

		});
		/**百度OCR
		var ak = settings.ak;
		var sk = settings.sk;
		var ocr = require('baidu-ocr-api').create(ak,sk);
	
		ocr.scan({
			url:'http://www.cruisesh.com:8086/img/card.jpg', 
			type:'text',
		}).then(function (result) {
			console.log(result);
			//result.results.words = '姓名：尹良<br/>性别：男<br/>出生日期：1988 2 6 <br/>住址：山东省淄博市博山区南博 山镇南博山西村76号<br/>身份证号码：370304198802065116';
			res.json(result);
		}).catch(function (err) {
			console.log('err', err);
		})**/
	}else if(sql == "BFRleader"){
		console.log('BFRleader run');
		var ak = settings.ak;
		var sk = settings.sk;
		var ocr = require('baidu-ocr-api').create(ak,sk);
	
		ocr.scan({
			url:'http://www.cruisesh.com:8086/img/leader.jpg', 
			type:'text',
		}).then(function (result) {
			console.log(result);
			res.json(result);
		}).catch(function (err) {
			console.log('err', err);
		})
	}else if(sql == "turing"){
		console.log('turing run');
		var info = req.param("info");
		//console.log(info);
		var url1 = 'http://apis.baidu.com/turing/turing/turing?key=879a6cb3afb84dbf4fc84a1df2ab7319&info='+info+'&userid=eb2edb736';
		request({
		    url: url1,
		    method: 'GET',
		    headers: {
		    	apikey: '4a1ac1f0434f91ac7c6064489512551c'
		    }
		}, function(err, response, body) {
		    if (!err && response.statusCode == 200) {
		    	console.log(body);
		        res.json(body);
		    }
		});
	}else if(sql == "uploadbuydo"){
		res.setHeader("Access-Control-Allow-Origin", "*");
		var fname = req.files.fileUpbuy.path.replace("public\\upload\\", "").replace("public/upload/", "");
		res.writeHead(200, {'Content-type' : 'text/html'});
		res.write('<script>');
		res.write('window.parent.postMessage("buy@'+fname+'","*");');
		res.end('</script>');
	}else if(sql == "uploaddo"){
		res.setHeader("Access-Control-Allow-Origin", "*");
		var fname = req.files.fileUp.path.replace("public\\upload\\", "").replace("public/upload/", "");
		res.writeHead(200, {'Content-type' : 'text/html'});
		res.write('<script>');
		res.write('window.parent.postMessage("supply@'+fname+'","*");');
		res.end('</script>');
	}else if(sql == "face_verify"){
		var ak_id = settings.ak_id;
		var ak_secret = settings.ak_secret;
		var img1 = req.param("img1");
		var img2 = req.param("img2");
		var date = new Date().toUTCString();
		var url1 = 'https://dtplus-cn-shanghai.data.aliyuncs.com/face/verify';

		var options = {
		  url : url1,
		  method: 'POST',
		  body: '{"type":0,"image_url_1":"'+img1+'","content_1":"","image_url_2":"'+img2+'","content_2":""}',
		  headers: {
		    'accept': 'application/json',
		    'content-type': 'application/json',
		    'date': date,
		    'Authorization': ''
		  }
		};
		/********/
		// 这里填写AK和请求
		md5 = function(buffer) {
		  var hash;
		  hash = crypto.createHash('md5');
		  hash.update(buffer);
		  return hash.digest('base64');
		};
		sha1 = function(stringToSign, secret) {
		  var signature;
		  return signature = crypto.createHmac('sha1', secret).update(stringToSign).digest().toString('base64');
		};
		// step1: 组stringToSign [StringToSign = #{method}\\n#{accept}\\n#{data}\\n#{contentType}\\n#{date}\\n#{action}]
		var body = options.body || '';
		var bodymd5;
		if(body === void 0 || body === ''){
		  bodymd5 = body;
		} else {
		  bodymd5 = md5(new Buffer(body));
		}
		console.log(bodymd5)
		var stringToSign = options.method + "\n" + options.headers.accept + "\n" + bodymd5 + "\n" + options.headers['content-type'] + "\n" + options.headers.date + "\n" + url.parse(options.url).path;
		console.log("step1-Sign string:", stringToSign);
		// step2: 加密 [Signature = Base64( HMAC-SHA1( AccessSecret, UTF-8-Encoding-Of(StringToSign) ) )]
		var signature = sha1(stringToSign, ak_secret);
		// console.log("step2-signature:", signature);
		// step3: 组authorization header [Authorization =  Dataplus AccessKeyId + ":" + Signature]
		var authHeader = "Dataplus " + ak_id + ":" + signature;
		console.log("step3-authorization Header:", authHeader);
		options.headers.Authorization = authHeader;
		/********/
		
		request(options, function(err, response, body) {
		    if (!err && response.statusCode == 200) {
		    	console.log(body);
		        res.json(body);
		    }
		});
	}
}