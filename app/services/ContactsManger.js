import {NativeModules} from 'react-native';
var RNContactsManager = require('react-native').NativeModules.RNContactsManager;
import ProfileDao from '../dao/ProfileDao';
import ContactsDao from '../dao/ContactsDao';
import * as _ from 'lodash';

class ContactsManger{

    init(countryCode){
        let profile = ProfileDao.getProfile();
        if(profile && profile.isContactInitialized){
            return;
        }
        let initContactsPromise = RNContactsManager.initializeContacts(countryCode);
        initContactsPromise.then(function(contacts){
            console.log("contacts initialized");
            ProfileDao.updateContactInitializedStatus();
            ContactsDao.updateContacts(contacts);
        });
    }

    syncContacts(){
        try{
            let ContactsSyncer = NativeModules.ContactsSyncer;
            let profile        = ProfileDao.getProfile();
            let countryCode    = profile.countryCode;
            let lastSyncDate   = profile.lastContactSyncTime;
            let lastSyncTime   = 0;
            if(_.isDate(lastSyncDate)){
                lastSyncTime = lastSyncDate.getTime();
            }
            if(countryCode){
                ContactsSyncer.syncContacts(countryCode, lastSyncTime)
                    .then(this.updateChangedContacts);
            }
        }catch(err){
            console.log("Error syncing contacts "+err);
        }
    }

    updateChangedContacts(changedContacts){
        ContactsDao.updateContacts(changedContacts);
        ProfileDao.updateLastSyncTime(new Date());
    }
}
export default new ContactsManger();