import realm from './Realm';
import Thread from '../models/Thread';
import SequenceDao from './SequenceDao';
import Contact from '../models/Contact';
import GroupInfo from '../models/GroupInfo';

class ThreadDao{

     createThreadForPhoneNumber(phoneNumber, contact){
         let newThread = new Thread(phoneNumber, false, null);
         console.log("threadId created as "+ newThread.id);
         try{
             realm.write(() => {
                 let threadId = SequenceDao.getNextSeqId('ThreadSequence');
                 newThread.id = threadId;
                 let realmThread = realm.create('Thread', newThread);
                 if(contact && contact.phoneNumber){
                     realmThread.contactInfo = contact;
                     newThread.contactInfo = contact;
                     newThread.displayName = contact.displayName;
                 }
                 console.log('Thread created in realm'+ realmThread);
             });
         }catch(err){
             console.error("exception adding thread "+err);
         }
         return newThread;
    }

    createGroupThread(groupInfo){
        let newThread = new Thread(null, true, groupInfo);
        try{
            realm.write(() => {
                let threadId = SequenceDao.getNextSeqId('ThreadSequence');
                newThread.id = threadId;
                let realmThread = realm.create('Thread', newThread);
                console.log('group Thread created in realm'+ realmThread);
            });
        }catch(err){
            console.error("exception adding group thread "+err);
        }
        return newThread;
    }

     getThreadByPhoneNumber(phoneNumber){
         let realmThread = realm.objects('Thread').filtered('recipientPhoneNumber = $0', phoneNumber)[0];
         let threadForPhoneNumber = this.convertFromRealmObject(realmThread);
         return threadForPhoneNumber;
    }

    getThreadByGroupId(groupUid){
        let realmThread = realm.objects('Thread').filtered('groupInfo.uid = $0', groupUid)[0];
        let threadForGroupId = this.convertFromRealmObject(realmThread);
        return threadForGroupId;
    }

    getThreadById(threadId){
        let threadForId;
        let realmThreadForId = realm.objects('Thread').filtered('id = $0', threadId)[0];
        if(realmThreadForId && realmThreadForId.id){
            threadForId = this.convertFromRealmObject(realmThreadForId);
        }
        return threadForId;
    }

     loadRecentThreads(){
        let recentRealmThreads = realm.objects('Thread');
        let recentThreads = [];

        //convert realm object to regular js object
        for(let i=0; i< recentRealmThreads.length; i++){
            let recentRealmThread = recentRealmThreads[i];
            let recentThread = this.convertFromRealmObject(recentRealmThread);
            recentThreads.push(recentThread);
        }
        return recentThreads;
    }

    updateLastMessageTextAndUnreadCount(newMessage, updateUnreadCount){
        try{
            realm.write(() => {
                let realmThread = realm.create('Thread', {'id': newMessage.threadId, 'lastMessageText': newMessage.message,
                    'lastMessageTime': new Date()}, true);
                if(updateUnreadCount){
                    realmThread.unreadCount = realmThread.unreadCount + 1;
                    console.log('updated unread count for thread '+newMessage.threadId);
                }
                console.log('last message text updated for thread '+newMessage.threadId);
            });
        }catch(err){
            console.error("exception updating last message text "+err);
        }
    }

    resetUnreadCount(threadId){
        try{
            realm.write(() => {
                realm.create('Thread', {'id': threadId, 'unreadCount': 0}, true);
                console.log('reset unread count for thread '+threadId);
            });
        }catch(err){
            console.error("exception resetting unread count "+err);
        }
    }

    deleteThreads(threadsToBeDeleted){
        try{
            realm.write(() => {
                for(let i=0; i< threadsToBeDeleted.length; i++){
                    let thread = threadsToBeDeleted[i];
                    let realmThread = realm.objects('Thread').filtered('id = $0', thread.id)[0];
                    if(realmThread){
                        realm.delete(realmThread);
                    }
                }
            });
        }catch(err){
            console.error("exception deleting selected threads "+err);
        }
    }

    muteThread(thread){
        try{
            realm.write(() => {
                realm.create('Thread', {'id': thread.id, 'isMuted': thread.isMuted}, true);
                console.log('updated isMuted flag for thread '+thread.id);
            });
        }catch(err){
            console.error("exception updating muted flag "+err);
        }
    }

    convertFromRealmObject(realmThread){
        if(!(realmThread && realmThread.id)){
            return null;
        }
        let thread = null;
        if (typeof realmThread.snapshot == 'function') {
            thread = realmThread.snapshot();
        } else {
            thread = Object.assign(new Thread(), realmThread);
        }
        if(!thread.isGroupThread && thread.contactInfo){
            let contactInfo = {};
            if (typeof thread.contactInfo.snapshot == 'function') {
                contactInfo = thread.contactInfo.snapshot();
            } else {
                contactInfo = Object.assign(new Contact(), thread.contactInfo);
            }
            let displayName    = contactInfo.displayName;
            thread.displayName = displayName;
        }
        else if(thread.isGroupThread && thread.groupInfo){
            let groupInfo = {};
            if (typeof thread.groupInfo.snapshot == 'function') {
                groupInfo = thread.groupInfo.snapshot();
            } else {
                groupInfo = Object.assign(new GroupInfo(), thread.groupInfo);
            }
            let displayName    = groupInfo.displayName;
            thread.displayName = displayName;
        }
        return thread;
    }
}

export default new ThreadDao();