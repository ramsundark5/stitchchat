import SocketIOClient from '../transport/SocketIOClient';
let instance = null;

class MessageService{
    constructor() {
        if(!instance){
            instance = this;
            this.socketIO = new SocketIOClient();
        }
        return instance;
    }

    sendMessage(message){
        this.socketIO.publish('MQTTChat', message);
    }
}

module.exports = new MessageService();