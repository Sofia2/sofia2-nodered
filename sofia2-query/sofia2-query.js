module.exports = function(RED) {
	var ssapMessageGenerator = require('../lib/SSAPMessageGenerator');
	var sofia2Config = require('../sofia2-connection-config/sofia2-connection-config');
	var ssapResourceGenerator = require('../lib/SSAPResourceGenerator');
	var http = require('http');
    function Query(n) {
        RED.nodes.createNode(this,n);
        
		var node = this;
		this.ontology = n.ontology;
		this.query = n.query;
		this.queryType = n.queryType;
		
		// Retrieve the server (config) node
		var server = RED.nodes.getNode(n.server);
        
		this.on('input', function(msg) {
			var ontologia="";
			var queryType="";
			var query="";
			if(this.ontology==""){
			   ontologia = msg.ontology;
			}else{
			   ontologia=this.ontology;
			}
			if(this.queryType==""){
			   queryType = msg.queryType;
			}else{
			   queryType=this.queryType;
			}
			if(this.query==""){
			   query = msg.query;
			}else{
			   query=this.query;
			}
			if (server) {
				var protocol = server.protocol;
				if(protocol.toUpperCase() == "MQTT".toUpperCase()){
					console.log(ontologia);
					var query = ssapMessageGenerator.generateQueryWithQueryTypeMessage(query, ontologia,queryType,null,server.sessionKey);
					var state = server.sendToSib(query);
					
					state.then(function(response){
						
						var body = JSON.parse(response.body);
						if(body.ok){
							console.log("The message is send.");
							msg.payload=body;
							node.send(msg);
						}else{
							console.log("Error sendind the query SSAP message.");
							msg.payload=body.error;
							if(body.errorCode == "AUTENTICATION"){
								console.log("The sessionKey is not valid.");
								server.generateSession();
							}
							node.send(msg);
						}
					});
				}else if(protocol.toUpperCase() == "REST".toUpperCase()){
					query = query.replace(/ /g, "+");
					var instance = server.kp + ':' + server.instance;
					var endpoint = server.endpoint;
					var arr = endpoint.toString().split(":");
					
					var host;
					var port = 80;
					
					if(arr[0].toUpperCase()=="HTTP".toUpperCase()||arr[0].toUpperCase()=='HTTPS'.toUpperCase()){
						host=arr[1].substring(2, arr[1].length);
						if(arr.length>2){
							port = parseInt(arr[arr.length-1]);
						}
					}else{
						host = arr[0];	
						if(arr.length>1){
							port = parseInt(arr[arr.length-1]);
						}
					}
					
					var postheaders = {
						'Accept' : 'application/json'
					};
					var pathUrl = "/sib/services/api_ssap/v01/SSAPResource?$sessionKey=" + server.sessionKey + "&$query="+ query + "&$queryType="+ queryType;
					
					var options = {
					  host: host,
					  port: port,
					  path: pathUrl,
					  method: 'GET',
					  headers: postheaders
					};
					// do the GET call
					var result='';
					var req = http.request(options, function(res) {
						console.log("Status code of the query call: ", res.statusCode);
						if(res.statusCode==400 || res.statusCode==401){
							var queryJoin = ssapResourceGenerator.generateJoinByTokenMessage(server.kp, instance, server.token);
			
							var postheadersJoin = {
								'Content-Type' : 'application/json',
								'Accept' : 'application/json',
								'Content-Length' : Buffer.byteLength(queryJoin, 'utf8')
							};
							
							var optionsJoin = {
							  host: host,
							  port: port,
							  path: '/sib/services/api_ssap/v01/SSAPResource/',
							  method: 'POST',
							  headers: postheadersJoin
							};
							
						// do the JOIN POST call
						var resultJoin='';
						var reqPost = http.request(optionsJoin, function(res) {
							console.log("Status code of the Join call: ", res.statusCode);
							res.on('data', function(d) {
								resultJoin +=d;
							});
							res.on('end', function() {
								resultJoin = JSON.parse(resultJoin);
								server.sessionKey=resultJoin.sessionKey;
								console.log("SessionKey obtained: " + server.sessionKey);
								
								var postheaders = {
									'Accept' : 'application/json'
								};
								var pathUrl = "/sib/services/api_ssap/v01/SSAPResource?$sessionKey=" + server.sessionKey + "&$query="+ query + "&$queryType="+ queryType;
								
								var options = {
								  host: host,
								  port: port,
								  path: pathUrl,
								  method: 'GET',
								  headers: postheaders
								};
								// do the GET call
								var result='';
								var req = http.request(options, function(res) {
									console.log("Status code of the query call: ", res.statusCode);
									res.on('data', function(d) {
										result +=d;
									});
									res.on('end', function() {
										result = JSON.parse(result);
										msg.payload=result;
										node.send(msg);
									});
									
								});
								req.end();
								req.on('error', function(err) {
									console.log(err);
								});
							});
							
						});
						reqPost.write(queryJoin);
						reqPost.end();
						reqPost.on('error', function(err) {
							console.log("There was an error inserting the data: ", err);
						});
						}else if(res.statusCode==200){
							res.on('data', function(d) {
								result +=d;
							});
							res.on('end', function() {
								result = JSON.parse(result);
								msg.payload=result;
								node.send(msg);
							});
						}
					});
					req.end();
					req.on('error', function(err) {
						console.log(err);
					});
					
				}
				
			} else {
				console.log("Error");
			}
        });
		
    }
    RED.nodes.registerType("sofia2-query",Query);
}