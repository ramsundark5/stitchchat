//import SocketIOClient from '../transport/SocketIOClient';
import MQTTClient from '../transport/MQTTClient';

class MessageService{

    init(){
        MQTTClient.init();
    }

    sendMessage(message){
        //SocketIOClient.publish('MQTTChat', message);
        MQTTClient.publish('MQTTChat', message);
    }
}

module.exports = new MessageService();