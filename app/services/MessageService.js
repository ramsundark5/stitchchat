import MQTTClient from '../transport/MQTTClient';

class MessageService{

    init(){
        MQTTClient.init();
    }

    sendMessage(message){
        sendMessage('stitchchat/messages',message);
    }

    sendMessage(topic, message){
        try{
            MQTTClient.publish(topic, message);
        }catch(err){
            console.log("error publishing message" +err);
        }
    }
}

module.exports = new MessageService();