import ProfileDao from '../dao/ProfileDao';

class ProfileService{

    isAppRegistered(){
        let profile = ProfileDao.getProfile();
        let isRegistered = profile && profile.phoneNumber ? true : false;
        console.log("is app registered? "+isRegistered);
        return isRegistered;
    }

    /*getLastContactSyncTime(){
        let lastSyncTimePref = ProfileDao.getProfile();
        console.log("last contact sync time is "+lastSyncTimePref);
        return lastSyncTimePref;
    }*/

}

export default new ProfileService();