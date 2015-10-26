import uuid from 'node-uuid';
import ThreadDao from '../dao/ThreadDao';
import MessageService from './MessageService';
import * as AppConfig from '../config/AppConfig';

class ThreadService{

    async addNewGroup(groupMembers, displayName){
        let groupUid = uuid.v4();
        let newGroupThread = await ThreadDao.createGroupThread(groupUid, displayName);
        let createGroupMessage = {groupId: groupUid, groupMembers: groupMembers, name: displayName};
        MessageService.sendMessageToTopic(AppConfig.CREATE_NEW_GROUP_TOPIC, createGroupMessage);

        return newGroupThread;
    }
}

module.exports = new ThreadService();