import React, { AsyncStorage } from 'react-native';
import DBHelper from './DBHelper';

class MessageDao{

    async putMessage(threadId, newMessage){
        let threadMessagesStr = await AsyncStorage.getItem(threadId);
        let threadMessages = JSON.parse(threadMessagesStr);
        if(!threadMessages || threadMessages.constructor != Array){
            threadMessages = [];
        }
        threadMessages.push(newMessage);
        let stringMsg = JSON.stringify(threadMessages);
        AsyncStorage.setItem(threadId, stringMsg);
        this.addMessage();
    }

    async getMessages(threadId){
        let threadMessages = await AsyncStorage.getItem(threadId);
        return threadMessages;
    }

    addMessage(){
        try{
            DBHelper.open();
            DBHelper.executeSQL();
        }catch(err){
            console.log("error with db operation"+ err);
        }

    }
}

module.exports = new MessageDao();