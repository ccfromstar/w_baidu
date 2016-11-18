var settings = require('../settings');
var mysql = require('../models/db');
var request = require("request");
var fs = require('fs');
var APIKey = settings.APIKey;
var SecretKey = settings.SecretKey;

exports.index = function(req, res) {
	res.render("index");
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
			res.json(result);
		}).catch(function (err) {
			console.log('err', err);
		})
	}
}