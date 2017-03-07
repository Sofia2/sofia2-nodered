module.exports = function(RED) {
	var ssapMessageGenerator = require('./lib/SSAPMessageGenerator');
	var sofia2Config = require('./sofia2-connection-config');
	var ssapResourceGenerator = require('./lib/SSAPResourceGenerator');
	var http = require('http');
    function Subscribe(n) {
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
				var subscribeId="";
				if(protocol.toUpperCase() == "MQTT".toUpperCase()){
					var query = ssapMessageGenerator.generateSubscribeWithQueryTypeMessage(query, ontologia,queryType,null,server.sessionKey);
					
					var state = server.sendToSib(query);
					
					state.then(function(response){
						
						var body = JSON.parse(response.body);
						if(body.ok){
							console.log("The message is send.");
							msg.payload=body;
							subscribeId = body.data;
							node.send([msg, null]);
							server.setNotification(function notification(msg){
								var data = JSON.parse(msg.body);
								node.send([null, data]);
							}, subscribeId);
						}else{
							console.log("Error sendind the query SSAP message.");
							msg.payload=body.error;
							if(body.errorCode == "AUTENTICATION"){
								console.log("The sessionKey is not valid.");
								server.generateSession();
							}
							node.send([msg, null]);
						}
						
					});
				}else if(protocol.toUpperCase() == "REST".toUpperCase()){
					node.send({payload: "Error, It is not allowed to send a SUBSCRIBE message with REST protocol."})
				}else if(protocol.toUpperCase() == "WEBSOCKET".toUpperCase()){
						//TODO
				}
				
			} else {
				console.log("Error");
			}
        });
		
    }
    RED.nodes.registerType("sofia2-subscribe",Subscribe);
}