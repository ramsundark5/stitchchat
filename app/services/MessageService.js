import SocketIOClient from '../transport/SocketIOClient';

class MessageService{

    sendMessage(message){
        SocketIOClient.publish('MQTTChat', message);
    }
}

module.exports = new MessageService();