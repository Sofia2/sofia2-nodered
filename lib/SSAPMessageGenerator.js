
function addQuotesToData(data){
	if (data.indexOf("{")!=0)
		data="{"+data+"}";
		
	return data;
}

function escapeJSONObject(datos){
	return datos.replace(/\"/g, "\\\"").replace(/\\\\\"/g, "\\\\\\\"");
}

var SSAPMessageGenerator = {

	/**
	 * CONFIG operation
	 * (EXPERIMENTAL BY ALENTATI)
	 * AS PER http://about.sofia2.com/2014/04/14/conociendo-el-protocolo-de-interoperabilidad-de-sofia2-ssap/
	 */
	generateConfigMessage : function(token, kpinstance, kp) {
		var queryJoin = '{"body":"{\\"instance\\":\\"'
			+ kpinstance
			+ '\\",\\"kp\\":\\"'
			+ kp
			+ '\\",\\"token\\":\\"'
			+ token
			+ '\\"}","direction":"REQUEST","ontology":null,"messageType":"CONFIG","messageId":null,"sessionKey":null}';
		
		return queryJoin;
	},


	/**
	 * JOIN operation
	 */
	generateJoinMessage : function(user, pass, instance) {
		var queryJoin = '{"body":"{\\"instance\\":\\"'
				+ instance
				+ '\\",\\"password\\":\\"'
				+ pass
				+ '\\",\\"user\\":\\"'
				+ user
				+ '\\"}","direction":"REQUEST","ontology":null,"messageType":"JOIN","messageId":null,"sessionKey":null}';
		
		return queryConfig;
	},
	
	/**
	 * JOIN By Token
	 */
	generateJoinByTokenMessage : function(token, instance) {
		var queryJoin = '{"body":"{\\"instance\\":\\"'
			+ instance
			+ '\\",\\"token\\":\\"'
			+ token
			+ '\\"}","direction":"REQUEST","ontology":null,"messageType":"JOIN","messageId":null,"sessionKey":null}';
		
		return queryJoin;
	},
	
	/**
	 * JOIN By Token
	 */
	generateJoinRenovateByTokenMessage : function(token, instance, sessionkey) {
		var queryJoin = '{"body":"{\\"instance\\":\\"'
			+ instance
			+ '\\",\\"token\\":\\"'
			+ token
			+ '\\"}","direction":"REQUEST","ontology":null,"messageType":"JOIN","messageId":null,"sessionKey":"'
			+sessionkey
			+'"}';
		
		return queryJoin;
	},

	/**
	 * LEAVE Operation
	 */
	generateLeaveMessage : function(sessionKey) {
		var queryLeave = '{"body":null,"direction":"REQUEST","ontology":null,"messageType":"LEAVE","messageId":null,"sessionKey":"'
				+ sessionKey + '"}';
		
		return queryLeave;
	},
	
	/**
	 * INSERT Message
	 */
	generateInsertMessage : function(data, ontology, sessionKey) {
		data = escapeJSONObject(data);
		if(ontology===undefined || ontology==null){
			ontology='null'
		}else{
			ontology='"'+ontology+'"';
		}
		var queryInsert = '{"body":"{\\"data\\":\\"'
				+ data	
				+ '\\",\\"query\\":null}","direction":"REQUEST","messageId":null,"messageType":"INSERT","ontology":'
				+ ontology + ',"sessionKey":"' + sessionKey + '"}';
				
		return queryInsert;
	},

	/**
	 * INSERT Operation
	 */
	generateInsertWithQueryTypeMessage : function(data, ontology, queryType, sessionKey) {
		var queryInsert = '';
		
		if(ontology===undefined || ontology==null){
			ontology='null'
		}else{
			ontology='"'+ontology+'"';
		}
		
		data = escapeJSONObject(data);
		if(queryType=="NATIVE"){
			queryInsert = '{"body":"{\\"data\\":\\"'
					+ data
					+ '\\",\\"query\\":null,\\"queryType\\":\\"'+queryType+'\\"}","direction":"REQUEST","messageId":null,"messageType":"INSERT","ontology":'
					+ ontology + ',"sessionKey":"' + sessionKey + '"}';
		}else{
			queryInsert = '{"body":"{\\"query\\":\\"'
						+ data
						+ '\\",\\"data\\":null,\\"queryType\\":\\"'+queryType+'\\"}","direction":"REQUEST","messageId":null,"messageType":"INSERT","ontology":'
						+ ontology + ',"sessionKey":"' + sessionKey + '"}';
		}
		
		return queryInsert;
	},	
	
	/**
	 * UPDATE Operation
	 */
	generateUpdateMessage : function(data, query, ontology, sessionKey) {
		if(ontology===undefined || ontology==null){
			ontology='null'
		}else{
			ontology='"'+ontology+'"';
		}
		
		var queryUpdate = '{"body":"{\\"data\\":\\"'
				+ data
				+ '\\",\\"query\\":\\"'
				+ query
				+ '\\"}","direction":"REQUEST","messageId":null,"messageType":"UPDATE","ontology":'
				+ ontology + ',"sessionKey":"' + sessionKey + '"}';
		
		return queryUpdate;
	},
	
	/**
	 * UPDATE Operation
	 */
	generateUpdateWithQueryTypeMessage : function(data, query, ontology, queryType, sessionKey) {
		if(ontology===undefined || ontology==null){
			ontology='null'
		}else{
			ontology='"'+ontology+'"';
		}
		
		var queryUpdate = '{"body":"{\\"data\\":\\"'
				+ data
				+ '\\",\\"query\\":\\"'
				+query
				+'\\",\\"queryType\\":\\"'
				+queryType+
				'\\"}","direction":"REQUEST","messageId":null,"messageType":"UPDATE","ontology":'
				+ ontology + ',"sessionKey":"' + sessionKey + '"}';
		
		return queryUpdate;
	},	
	
	/**
	 * REMOVE Operation
	 */
	generateDeleteMessage : function(query, ontology, sessionKey) {
		if(ontology===undefined || ontology==null){
			ontology='null'
		}else{
			ontology='"'+ontology+'"';
		}
		var queryRemove = '{"body":"{\\"data\\":null,\\"query\\":\\"'
				+ query
				+ '\\"}","direction":"REQUEST","messageId":null,"messageType":"DELETE","ontology":'
				+ ontology + ',"sessionKey":"' + sessionKey + '"}';
		
		return queryRemove;
	},	
	
	/**
	 * REMOVE Operation
	 */
	generateDeleteWithQueryTypeMessage : function(query, ontology, queryType, sessionKey) {
		if(ontology===undefined || ontology==null){
			ontology='null'
		}else{
			ontology='"'+ontology+'"';
		}
		var queryRemove = '{"body":"{\\"data\\":null,\\"query\\":\\"'
				+query
				+'\\",\\"queryType\\":\\"'
				+queryType+
				'\\"}","direction":"REQUEST","messageId":null,"messageType":"DELETE","ontology":'
				+ ontology + ',"sessionKey":"' + sessionKey + '"}';
		
		return queryRemove;
	},	
	
	/**
	 * QUERY Operation
	 */
	generateQueryMessage : function(query, ontology, sessionKey) {
		if(ontology===undefined || ontology==null){
			ontology='null'
		}else{
			ontology='"'+ontology+'"';
		}
		var querySib = '{"body":"{\\"query\\":\\"' + query
				+ '\\"}","direction":"REQUEST","ontology":' + ontology
				+ ',"messageType":"QUERY","messageId":null,"sessionKey":"'
				+ sessionKey + '"}';
		
		return querySib
	},	
	
	/**
	 * QUERY with queryType Operation
	 */
	generateQueryWithQueryTypeMessage : function(query, ontology, queryType, queryParams, sessionKey) {
		if(ontology===undefined || ontology==null){
			ontology='null'
		}else{
			ontology='"'+ontology+'"';
		}
		var querySib='';
		
		if(queryParams==null){
			var querySib = '{"body":"{\\"query\\":\\"' 
				+ query
				+ '\\",\\"queryType\\":\\"'
				+ queryType+'\\",\\"queryParams\\": null}","direction":"REQUEST","ontology":' 
				+ ontology
				+ ',"messageType":"QUERY","messageId":null,"sessionKey":"'
				+ sessionKey + '"}';
			
		
		}else{
			var querySib = '{"body":"{\\"query\\":\\"' 
				+ query
				+ '\\",\\"queryType\\":\\"'
				+ queryType+'\\",\\"queryParams\\":'
				+ JSON.stringify(queryParams)+'}","direction":"REQUEST","ontology":' 
				+ ontology
				+ ',"messageType":"QUERY","messageId":null,"sessionKey":"'
				+ sessionKey + '"}';
		}

		return querySib
		
	},	
	
	/**
	 * SUBSCRIBE Operation
	 */
	generateSubscribeMessage : function(suscription, ontology, refresh, sessionKey) {
		if(ontology===undefined || ontology==null){
			ontology='null'
		}else{
			ontology='"'+ontology+'"';
		}
		var queryMongo = suscription;
		var querySubscribe = '{"body":"{\\"query\\":\\"' + queryMongo
				+ '\\",\\"msRefresh\\":\\"' + refresh
				+ '\\"}","direction":"REQUEST","ontology":' + ontology
				+ ',"messageType":"SUBSCRIBE","messageId":null,"sessionKey":"'
				+ sessionKey + '"}';
				
		return querySubscribe;		
	},		

	/**
	 * SUBSCRIBE Operation
	 */
	generateSubscribeWithQueryTypeMessage : function(suscription, ontology, queryType, refresh, sessionKey) {
		if(ontology===undefined || ontology==null){
			ontology='null'
		}else{
			ontology='"'+ontology+'"';
		}
		var queryMongo = suscription;
		var querySubscribe = '{"body":"{\\"query\\":\\"' + queryMongo
				+ '\\",\\"msRefresh\\":\\"' + refresh
				+ '\\",\\"queryType\\":\\"'+queryType+'\\"}","direction":"REQUEST","ontology":' + ontology
				+ ',"messageType":"SUBSCRIBE","messageId":null,"sessionKey":"'
				+ sessionKey + '"}';
				
		return querySubscribe;
	},

	/**
	 * UNSUBSCRIBE Operation
	 */
	generateUnsubscribeMessage : function(subscriptionId, ontology, sessionKey) {	
	if(ontology===undefined || ontology==null){
			ontology='null'
		}else{
			ontology='"'+ontology+'"';
		}
		var queryUnsubscribe = '{"body":"{\\"idSuscripcion\\":\\"'
				+ subscriptionId
				+ '\\"}","direction":"REQUEST","ontology":'
				+ ontology
				+ ',"messageType":"UNSUBSCRIBE","messageId":null,"sessionKey":"'
				+ sessionKey + '"}';
		
		return queryUnsubscribe;	
	},	
	
}
exports.generateConfigMessage = SSAPMessageGenerator.generateConfigMessage;
exports.generateJoinMessage = SSAPMessageGenerator.generateJoinMessage;
exports.generateJoinByTokenMessage = SSAPMessageGenerator.generateJoinByTokenMessage;
exports.generateJoinRenovateByTokenMessage = SSAPMessageGenerator.generateJoinRenovateByTokenMessage;
exports.generateLeaveMessage = SSAPMessageGenerator.generateLeaveMessage;
exports.generateInsertMessage = SSAPMessageGenerator.generateInsertMessage;
exports.generateInsertWithQueryTypeMessage = SSAPMessageGenerator.generateInsertWithQueryTypeMessage;
exports.generateUpdateMessage = SSAPMessageGenerator.generateUpdateMessage;
exports.generateUpdateWithQueryTypeMessage = SSAPMessageGenerator.generateUpdateWithQueryTypeMessage;
exports.generateDeleteMessage = SSAPMessageGenerator.generateDeleteMessage;
exports.generateDeleteWithQueryTypeMessage = SSAPMessageGenerator.generateDeleteWithQueryTypeMessage;
exports.generateQueryMessage = SSAPMessageGenerator.generateQueryMessage;
exports.generateQueryWithQueryTypeMessage = SSAPMessageGenerator.generateQueryWithQueryTypeMessage;
exports.generateSubscribeMessage = SSAPMessageGenerator.generateSubscribeMessage;
exports.generateSubscribeWithQueryTypeMessage = SSAPMessageGenerator.generateSubscribeWithQueryTypeMessage;
exports.generateUnsubscribeMessage = SSAPMessageGenerator.generateUnsubscribeMessage;

