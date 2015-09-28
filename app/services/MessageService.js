//import SocketIOClient from '../transport/SocketIOClient';
import MQTTClient from '../transport/MQTTClient';

class MessageService{

    init(){
        MQTTClient.init();
    }

    sendMessage(topic, message){
        try{
            MQTTClient.publish('MQTTChat', message);
        }catch(err){
            console.log(err);
        }

    }
}

module.exports = new MessageService();