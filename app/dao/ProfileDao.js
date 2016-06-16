import realm from '../dao/Realm';
import Profile from '../models/Profile';

class PreferenceDao{

    getProfile(){
        let realmObject =  realm.objects('Profile')[0];
        if(realmObject && realmObject.lastContactSyncTime){
            let profile = this.convertFromRealmObject(realmObject);
            return profile;
        }else{
            let profile = new Profile();
            realm.write(() => {
                realm.create('Profile', profile);
            });
            return profile;
        }
    }

    unregisterUser(){
        try{
            let profile =  realm.objects('Profile')[0];
            realm.write(() => {
                profile.phoneNumber = null;
            });
        }catch(err){
            console.error("exception un-registering user "+err);
        }
    }

    setPhoneNumberAndCountryCode(phoneNumber, countryCode){
        try{
            let profile =  realm.objects('Profile')[0];
            if(phoneNumber && countryCode){
                realm.write(() => {
                    profile.phoneNumber = phoneNumber;
                    profile.countryCode = countryCode;
                });
            }
        }catch(err){
            console.error("exception updating phonenumber and country code "+err);
        }
    }

    updateContactInitializedStatus(){
        try{
            let profile =  realm.objects('Profile')[0];
            realm.write(() => {
                profile.isContactInitialized = true;
            });
        }catch(err){
            console.error("exception updating contact initialized status "+err);
        }
    }

    updateLastSyncTime(value){
        try{
            let profile =  realm.objects('Profile')[0];
            realm.write(() => {
                profile.lastContactSyncTime = value;
            });
        }catch(err){
            console.error("exception updating contact last sync time "+err);
        }
    }

    convertFromRealmObject(realmObject) {
        if(!realmObject){
            return null;
        }
        let profile = new Profile();
        profile.phoneNumber             = realmObject.phoneNumber;
        profile.displayName             = realmObject.displayName;
        profile.countryCode             = realmObject.countryCode;
        profile.isContactInitialized    = realmObject.isContactInitialized;
        profile.statusMessage           = realmObject.statusMessage;
        profile.photo                   = realmObject.photo;
        profile.thumbNailPhoto          = realmObject.thumbNailPhoto;
        profile.lastContactSyncTime     = realmObject.lastContactSyncTime;
        return profile;
    }
}

export default new PreferenceDao();