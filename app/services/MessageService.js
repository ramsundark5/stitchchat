var Paho = require('./mqttws31');
import * as Native from 'NativeModules';

class MessageService{
    constructor(){
        let wsbroker = "test.mosquitto.org";  //mqtt websocket enabled broker
        let wsport = 8080; // port for above
        this.client = new Paho.MQTT.Client(wsbroker, wsport,
            "myclientid_" + parseInt(Math.random() * 100, 10));
        this.client.trace = function(traceMsg){
            console.log(traceMsg);
        };
        this.client.onConnectionLost = function (responseObject) {
            console.log("connection lost: " + responseObject.errorMessage);
        };
        console.log(this.client);
        this.client.onMessageArrived = function (message) {
            console.log(message.destinationName, ' -- ', message.payloadString);
        };
        this.options = {
            timeout: 3,
            onSuccess: function () {
                console.log("mqtt connected");
                // Connection succeeded; subscribe to our topic, you can add multile lines of these
                client.subscribe('/World', {qos: 1});

                //use the below if you want to publish to a topic on connect
                message = new Paho.MQTT.Message("Hello");
                message.destinationName = "/World";
                client.send(message);

            },
            onFailure: function (message) {
                console.log("Connection failed: " + message.errorMessage);
            }
        };
    }
    init(){
        this.client.startTrace();
        this.client.connect(this.options);
        /*console.log('native is '+ Native);
        let randomClientId = "myclientid_" + parseInt(Math.random() * 100, 10);
        CocoaMQTT.initAndConnect(randomClientId, "test.mosquitto.org", 1883);*/
    }
}

export default MessageService;
