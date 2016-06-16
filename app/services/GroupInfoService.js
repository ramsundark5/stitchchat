import GroupInfo from '../models/GroupInfo';
import GroupInfoDao from '../dao/GroupInfoDao';
import store from '../config/ConfigureStore';
import * as ThreadActions from '../actions/ThreadActions';
import * as AppConstants from '../constants/AppConstants';
import ThreadDao from '../dao/ThreadDao';
import FirebaseInviteHandler from '../transport/FirebaseInviteHandler';

class GroupInfoService{

    acceptInvite(thread){
        let groupId = thread.groupInfo? thread.groupInfo.uid : null;
        GroupInfoDao.updateGroupInfoStatus(groupId, AppConstants.INVITE_ACCEPTED);
        FirebaseInviteHandler.acceptInvite(groupId);
    }

    declineInvite(thread){
        let groupId = thread.groupInfo? thread.groupInfo.uid : null;
        GroupInfoDao.updateGroupInfoStatus(groupId, AppConstants.INVITE_DECLINED);
        FirebaseInviteHandler.declineInvite(groupId);
    }

    getThreadForGroupId(groupId){
        let threadForGroupId = null;
        let groupInfo = GroupInfoDao.getGroupInfoById(groupId);
        if(!groupInfo){
            threadForGroupId = this.getThreadForGroup(groupInfo);
        }
        return threadForGroupId;
    }

    createGroupFromInvite(invite){
        let groupThread;
        try{
            let groupInfo = GroupInfoDao.getGroupInfoById(invite.id);
            if(!groupInfo){
                groupInfo        = new GroupInfo(invite.displayName);
                groupInfo.uid    = invite.id;
                groupInfo.status = 'PENDING';
            }
            groupThread = this.getThreadForGroup(groupInfo);
        }catch(err){
            console.log("Error in adding new group. Error is "+ err);
        }
        return groupThread;
    }

    openNewlyAddedGroup(groupMembers, displayName){
        let threadForGroup = this.addNewGroup(groupMembers, displayName);
        store.dispatch(ThreadActions.setCurrentThread(threadForGroup));
        return threadForGroup;
    }

    getThreadForGroup(groupInfo){
        let threadForGroup = ThreadDao.getThreadByGroupId(groupInfo.uid);
        if(!threadForGroup){
            console.log("no existing thread found for groupId "+groupInfo.uid);
            threadForGroup = ThreadDao.createGroupThread(groupInfo);
            store.dispatch(ThreadActions.addNewThread(threadForGroup));
        }
        return threadForGroup;
    }

    addNewGroup(groupMembers, displayName){
        let newGroupThread;
        try{
            let groupInfo  = new GroupInfo(displayName);
            newGroupThread = ThreadDao.createGroupThread(groupInfo);
            newGroupThread.displayName = displayName;
            store.dispatch(ThreadActions.addNewThread(newGroupThread));
            FirebaseInviteHandler.createNewGroup(groupInfo);
            this.sendInvitesToGroupMembers(groupMembers, groupInfo);
        }catch(err){
            console.log("Error in adding new group. Error is "+ err);
        }
        return newGroupThread;
    }

    sendInvitesToGroupMembers(groupMembers, groupInfo){
        for(let i=0; i < groupMembers.length; i++){
            let recipientPhoneNumber = groupMembers[i].phoneNumber;
            FirebaseInviteHandler.inviteUser(recipientPhoneNumber, groupInfo);
        }
    }

    leaveGroup(thread){
        if(thread.groupInfo){
            GroupInfoDao.updateGroupInfoStatus(thread.groupInfo.uid, AppConstants.LEFT_GROUP);
            store.dispatch(ThreadActions.updateThread(thread));
            FirebaseInviteHandler.leaveGroup(thread.groupInfo.uid);
        }
    }
}
export default new GroupInfoService();