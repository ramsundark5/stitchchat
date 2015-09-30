import React, { AsyncStorage } from 'react-native';

class ThreadDao{

    async putMessage(threadId, newMessage:Message){
        let threadMessages = await AsyncStorage.getItem(threadId);
        if(!threadMessages){
            threadMessages = [];
        }
        threadMessages.push(newMessage);
        AsyncStorage.setItem(threadId, threadMessages);
    }

    async getMessages(threadId){
        let threadMessages = await AsyncStorage.getItem(threadId);
        return threadMessages;
    }
}

module.exports = new ThreadDao();