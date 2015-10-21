import MessageService from '../services/MessageService';
import ContactsManager from '../services/ContactsManger';
import MigrationManager from '../dao/migration/MigrationManager';
import CacheService from './CacheService';
import * as AppConstants from '../constants/AppConstants';

export default class AppInitService{

    constructor(){
        MessageService.init();
        let migrationPromise = MigrationManager.init();
        migrationPromise.then(this.loadPreferences)
                        .then(this.initContactDBIfRequired);
        global.debugAsyncObject = this.debugAsyncObject;
    }

    loadPreferences(){
        let loadPreferencesPromise = CacheService.init();
        return loadPreferencesPromise;
    }

    initContactDBIfRequired(){
        let isContactInitialized = CacheService.get(AppConstants.IS_CONTACT_DB_INITIALIZED);
        if(isContactInitialized && isContactInitialized == 1){
            let countryCode = CacheService.get(AppConstants.COUNTRY_CODE_PREF);
            ContactsManager.init(countryCode);
        }
    }

    debugAsyncObject(obj){
        console.log("async obj is"+ obj);
    }
}