/*******************************************************************************
 * © Indra Sistemas, S.A.
 * 2013 - 2014  SPAIN
 * 
 * All rights reserved
 ******************************************************************************/
var mqtt   = require("mqtt");
var Q      = require('q');
// CHECK
//var mqtt   = require("mqtt@0.3.11");
//var Q      = require('q');
//var XXTEA  = require('./XXTEA');
//var Base64 = require('./base64');

var CLIENT_TOPIC                      = "CLIENT_TOPIC";           // Topic to publish messages
var TOPIC_PUBLISH_PREFIX              = '/TOPIC_MQTT_PUBLISH';    // Topic to receive the response
var TOPIC_SUBSCRIBE_INDICATION_PREFIX = '/TOPIC_MQTT_INDICATION'; // Topic to receive notifications


function nop() {}

/**
 * Constructor
 */ 
function KpMQTT() {
	this.notificationCallback = [];
	this.client = null;
	this.subscriptionsPromises = [];
	//this.cipherKey = null;
}


KpMQTT.prototype.createUUID = function () {
    // http://www.ietf.org/rfc/rfc4122.txt
    var s         = [];
    var hexDigits = "0123456789abcdef";
    
    for (var i = 0; i < 23; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8]  = s[13] = s[18] = "-";

    return s.join("");
};

/**
 * Connect to SIB and subscribe to topics
 */
KpMQTT.prototype.connect = function(host, port, keepalive) {
	keepalive = keepalive || 5;

	var clientId = this.createUUID();

	/*
		alentati - 2016-03-23
		Added the following parameters to support MQTT 3.1 broker (Sofia2 version):
			protocolId: 'MQIsdp',
			protocolVersion: 3
		See https://www.npmjs.com/package/mqtt#client for reference
		Original (Sofia2 APIs) version. Deprecated but works
		var opts = {
			clientId  : clientId,
			keepalive : keepalive,
			protocolId: 'MQIsdp',
			protocolVersion: 3
		};
		this.client = mqtt.createClient(port, host, opts);
	*/
	
	// New version, 3.1.1 style:
	var h = host;
	var p = port;
	var opts = {
		port : p,
		host : h,
        clientId  : clientId,
        keepalive : keepalive,
		connectTimeout: 5000,
		clean: true,
		reconnectPeriod: -1,
		protocolId: 'MQIsdp',
		protocolVersion: 3
    };
	this.client = mqtt.connect(opts);
	console.log("MQTT connected on:"+host+":"+port);
	
	var self = this;
	
	this.client.on('connect', function(){
		self.client.subscribe(TOPIC_PUBLISH_PREFIX + clientId, 
			function(){
				console.log("Suscrito a "+TOPIC_PUBLISH_PREFIX + clientId)
			}
		);
		self.client.subscribe(TOPIC_SUBSCRIBE_INDICATION_PREFIX + clientId, 
			function(){
				console.log("Suscrito a "+TOPIC_SUBSCRIBE_INDICATION_PREFIX + clientId)
			}
		);
	});
	
	
	this.client.on('message', function(topic, message) {
		if (topic == TOPIC_PUBLISH_PREFIX + clientId) {
            var deferred = self.subscriptionsPromises.shift();
			
			try {
				deferred.resolve(JSON.parse(message));
			} catch (e) {
				deferred.reject(e);
				console.log("Error:"+e);
			}
            
		} else if (topic == TOPIC_SUBSCRIBE_INDICATION_PREFIX + clientId) {
			var notifMsg = JSON.parse(message);
			console.log("Message:"+notifMsg);
			var sMsgId = notifMsg.messageId;
			console.log("On Message:"+sMsgId);
			self.notificationCallback[sMsgId](notifMsg);
		}
	});
	
	
	
	/*
	return Q.all([
		Q.ninvoke(this.client, "subscribe", TOPIC_PUBLISH_PREFIX + clientId),
		Q.ninvoke(this.client, "subscribe", TOPIC_SUBSCRIBE_INDICATION_PREFIX + clientId)
	]);//.timeout(keepalive * 1000);	// alentati - removed to avoid nodered crashes on connection unreacheable.
	*/
};

KpMQTT.prototype.disconnect = function() {
	this.client.end();
	console.log("MQTT disconnect");
};


KpMQTT.prototype.isConnected = function() {
	return this.client.connected;
};

KpMQTT.prototype.send = function(ssapMessage) {
	/*if (this.cipherKey) {
		var index = ssapMessage.indexOf('instance');
		if (index != -1) {
			var init    = index + 'instance'.length;
			var end     = ssapMessage.length;		
			var kpName  = ssapMessage.substring(init, end).split(':')[1];
			
			kpName      = kpName.replace('\\"', '').trim();
			ssapMessage = kpName.length + "#" + kpName + Base64.encode(XXTEA.encrypt(ssapMessage, this.cipherKey), false);
		} else {
			ssapMessage = Base64.encode(XXTEA.encrypt(ssapMessage, this.cipherKey), false);
		}
	}*/
	var deferred = Q.defer();
	var self = this;
	this.client.publish(CLIENT_TOPIC, ssapMessage, {qos: 1, retain: false}, function() {
		self.subscriptionsPromises.push(deferred);
	});
	
	return deferred.promise;
};

// alentati: modified to manage subscriptionId parameter (in order to store different callbacks for each subscription)
KpMQTT.prototype.setNotificationCallback = function(notificationCallback, subscriptionId) {
	if (typeof notificationCallback !== 'function') {
		throw new Error("notificationCallback must be a function");
	}
	
	this.notificationCallback[subscriptionId] = notificationCallback;
};

/*KpMQTT.prototype.setCipherKey = function(cipherKey) {
	this.cipherKey = cipherKey;
};*/


exports.KpMQTT = KpMQTT;
