var NativeModules = require('react-native').NativeModules;
var RCTDeviceEventEmitter = require('RCTDeviceEventEmitter');
import {store} from '../containers/App';
import * as MessageActions from '../actions/MessageActions';

class MQTTClient{

    constructor(){
        console.log('native mods are ');
        this.mqttClient = NativeModules.RNMQTTClient;
        //this.mqttClient = new SocketIOClient();
    }

    init(){
        var connectionDetails = {
            host: 'broker.mqttdashboard.com',
            port: 1883,
            tls : false
        }
        if(!this.mqttClient){
            return;
        }

        this.connect(connectionDetails);

        this.subscribeTo('MQTTChatReceive', 1);

        if(RCTDeviceEventEmitter){
            console.log('device event emitter registered from JS');
            RCTDeviceEventEmitter.addListener('onMessageReceived', this.onReceiveMessaged);
            RCTDeviceEventEmitter.addListener( 'onStatusChanged', this.onStatusChanged);
        }

    }

    connect(connectionDetails){
        this.mqttClient.connect(connectionDetails);
    }

    publish(topicName, message, qosLevel = 0, retain = false){
        if(!topicName){
            throw("topic name is required to publish message");
        }
        if(!message || !message.text){
            throw("message is required to publish message");
        }
        this.mqttClient.publish(topicName, message.text, qosLevel, retain);
        //this.subscribeTo('MQTTChatReceive', 1);
    }

    subscribeTo(topicName, qosLevel){
        this.mqttClient.subscribeTo(topicName, qosLevel);
    }

    onStatusChanged(newStatus){
        console.log("new status is "+newStatus);
    }

    onReceiveMessaged(message){
        //store.dispatch(MessageActions.addMessage("message received from mqtt"));
        console.log("received message in UI "+ message);
    }

    onConnected(){

    }

    onDisconnected(){

    }

    disconnect(){

    }


}
module.exports = new MQTTClient();