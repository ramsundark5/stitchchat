import realm from './Realm';
import GroupInfo from '../models/GroupInfo';

class GroupInfoDao{

    getGroupIdList(){
        let groupIdList = [];
        let groupList = realm.objects('GroupInfo');
        if(groupList && groupList.length > 0) {
            for(let i=0; i< groupList.length; i++){
                let groupId = groupList[i].uid;
                groupIdList.push(groupId);
            }
        }
        return groupIdList;
    }

    getGroupInfoById(id){
        let groupInfoById;
        let realmGroupInfo = realm.objects('GroupInfo').filtered('uid = $0', id)[0];
        if (typeof realmGroupInfo.snapshot == 'function') {
            groupInfoById = realmGroupInfo.snapshot();
        } else {
            groupInfoById = Object.assign(new GroupInfo(), realmGroupInfo);
        }
        return groupInfoById;
    }

    updateGroupInfoStatus(groupId, status){
        try{
            realm.write(() => {
                realm.create('GroupInfo', {'uid': groupId, 'status': status}, true);
            });
        }catch(err){
            console.error("exception updating group info status "+err);
        }
    }

}

export default new GroupInfoDao();