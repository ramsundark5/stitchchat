import uuid from 'node-uuid';
import ThreadDao from '../dao/ThreadDao';
import * as ThreadActions from '../actions/ThreadActions';
import MessageService from './MessageService';
import * as AppConfig from '../config/AppConfig';
import store from '../config/ConfigureStore';

class ThreadService{

    async getThreadForContact(contact){
        let threadForPhoneNumber;
        try{
            threadForPhoneNumber = await ThreadDao.getThreadByPhoneNumber(contact.phoneNumber);

            if(!threadForPhoneNumber){
                console.log("no existing thread found for phoneNumber"+contact.phoneNumber);
                threadForPhoneNumber = await ThreadDao.createThreadForContact(contact);
                store.dispatch(ThreadActions.addNewThread(threadForPhoneNumber));
            }
        }catch(err){
            console.log("Error in getting thread for contact. Error is "+ err);
        }

        return threadForPhoneNumber;
    }

    async addNewGroup(groupMembers, displayName){
        let newGroupThread;
        try{
            let groupUid = uuid.v4();
            newGroupThread = await ThreadDao.createGroupThread(groupUid, displayName);
            store.dispatch(ThreadActions.addNewThread(newGroupThread));
            let createGroupMessage = {groupId: groupUid, groupMembers: groupMembers, name: displayName};
            MessageService.sendMessageToTopic(AppConfig.CREATE_NEW_GROUP_TOPIC, createGroupMessage);
        }catch(err){
            console.log("Error in adding new group. Error is "+ err);
        }
        return newGroupThread;
    }

    updateThreadWithNewMessage(newMessage){
        try{
            ThreadDao.updateLastMessageText(newMessage);
            let currentThreadState = store.getState().threadState;
            let currentThread = currentThreadState.currentThread;
            if(currentThread){
                console.log("current thread is "+currentThread.id);
                if(currentThread.id != newMessage.threadId){
                    ThreadDao.updateUnreadCount(newMessage.threadId);
                }
            }
        }catch(err){
            console.log("Error updating thread snippet "+err);
        }

    }
}

export default new ThreadService();