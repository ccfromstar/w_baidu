var settings = require('../settings');
var mysql = require('../models/db');
var request = require("request");
var fs = require('fs');
var APIKey = settings.APIKey;
var SecretKey = settings.SecretKey;

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
		console.log('BFR run');
		var ak = settings.ak;
		var sk = settings.sk;
		var ocr = require('baidu-ocr-api').create(ak,sk);
	
		ocr.scan({
			url:'http://www.cruisesh.com:8086/img/test.jpg', 
			type:'text',
		}).then(function (result) {
			console.log(result);
			result.results.words = '护照号：G16098350<br/>姓名：王恺<br/>性别：男<br/>身份证号：14220119851206075X<br/>出生日期：06 DEC 1985<br/>出生地：山西<br/>签发日期：06 APR 2006<br/>有效期至：05 APR 2011<br/>签发地：北京';
			res.json(result);
		}).catch(function (err) {
			console.log('err', err);
		})
	}else if(sql == "BFRcard"){
		console.log('BFRcard run');
		var ak = settings.ak;
		var sk = settings.sk;
		var ocr = require('baidu-ocr-api').create(ak,sk);
	
		ocr.scan({
			url:'http://www.cruisesh.com:8086/img/card.jpg', 
			type:'text',
		}).then(function (result) {
			console.log(result);
			result.results.words = '姓名：尹良<br/>性别：男<br/>出生日期：1988 2 6 <br/>住址：山东省淄博市博山区南博 山镇南博山西村76号<br/>身份证号码：370304198802065116';
			res.json(result);
		}).catch(function (err) {
			console.log('err', err);
		})
	}
}