var settings = require('../settings');
var mysql = require('../models/db');
var request = require("request");
var fs = require('fs');
var APIKey = 'XZ14ldH1day6utemOleMmV1h';
var SecretKey = 'f62e4f13a76413e1806a0e4c37d8aef7';

exports.index = function(req, res) {
	var sql1 = "select * from cruise_port where txtCruiseAreaNo='hq6' limit 0,4";
	mysql.query(sql1, function(err, rows1) {
		res.render("index",{
			ports:rows1
		});
	});
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
	}
}