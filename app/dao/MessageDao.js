import React, { AsyncStorage } from 'react-native';

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
    }

    async getMessages(threadId){
        let threadMessages = await AsyncStorage.getItem(threadId);
        return threadMessages;
    }
}

module.exports = new MessageDao();