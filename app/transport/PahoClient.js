var Paho = require('../services/mqttws31');

class PahoClient{

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
    }

    ab2str(buf) {
        return String.fromCharCode.apply(null, new Uint16Array(buf));
    }

     str2ab(str) {
        var buf = new ArrayBuffer(str.length*2); // 2 bytes for each char
        var bufView = new Uint16Array(buf);
        for (var i=0, strLen=str.length; i<strLen; i++) {
            bufView[i] = str.charCodeAt(i);
        }
        return buf;
    }
}
export default new PahoClient();