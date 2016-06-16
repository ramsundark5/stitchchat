import ThreadDao from '../dao/ThreadDao';
import ContactDao from '../dao/ContactsDao';
import * as ThreadActions from '../actions/ThreadActions';
import store from '../config/ConfigureStore';
import FirebaseUserPreferenceHandler from '../transport/FirebaseUserPreferenceHandler';

class ThreadService{

     openThreadForContact(contact){
         let threadForContact = this.getThreadForContact(contact);
         store.dispatch(ThreadActions.setCurrentThread(threadForContact));
         return threadForContact;
     }

     getThreadForContact(contact){
         let threadForContact = this.getThreadForPhoneNumber(contact.phoneNumber, contact);
         return threadForContact;
     }

     getThreadForPhoneNumber(phoneNumber, contact){
        let threadForPhoneNumber;
        try{
            threadForPhoneNumber = ThreadDao.getThreadByPhoneNumber(phoneNumber);

            if(!threadForPhoneNumber){
                console.log("no existing thread found for phoneNumber"+phoneNumber);
                threadForPhoneNumber = ThreadDao.createThreadForPhoneNumber(
                                                phoneNumber, contact);

                store.dispatch(ThreadActions.addNewThread(threadForPhoneNumber));
            }
        }catch(err){
            console.log("Error in getting thread for contact. Error is "+ err);
        }

        return threadForPhoneNumber;
    }

    updateThreadWithNewMessage(threadToBeUpdated, newMessage){
        try{
            let updateUnreadCount = false;
            let currentThreadState = store.getState().threadState;
            let currentThread = currentThreadState.currentThread;
            if(currentThread){
                console.log("current thread is "+currentThread.id);
                if(currentThread.id != threadToBeUpdated.id){
                    updateUnreadCount = true;
                    threadToBeUpdated.unreadCount = threadToBeUpdated.unreadCount + 1;
                }
            }else{
                updateUnreadCount = true;
                threadToBeUpdated.unreadCount = threadToBeUpdated.unreadCount + 1;
            }
            threadToBeUpdated.lastMessageText = newMessage.message;
            store.dispatch(ThreadActions.updateThread(threadToBeUpdated));
            ThreadDao.updateLastMessageTextAndUnreadCount(newMessage, updateUnreadCount);
        }catch(err){
            console.log("Error updating thread snippet "+err);
        }
    }

    deleteThread(thread){
        store.dispatch(ThreadActions.deleteThread(thread));
        ThreadDao.deleteThreads([thread]);
    }

    muteThread(thread){
        store.dispatch(ThreadActions.updateThread(thread));
        ThreadDao.muteThread(thread);
        if(thread.isGroupThread){
            FirebaseUserPreferenceHandler.muteUser(thread.groupInfo.uid, thread.isMuted);
        }else{
            FirebaseUserPreferenceHandler.muteUser(thread.recipientPhoneNumber, thread.isMuted);
        }
    }
    
    blockUser(thread, contact){
        ContactDao.blockContact(contact);
        FirebaseUserPreferenceHandler.blockUser(contact.phoneNumber, !contact.isBlocked);
        store.dispatch(ThreadActions.updateThread(thread));
    }

}

export default new ThreadService();