import BackgroundService from '../services/BackgroundService';
import ContactsManager from '../services/ContactsManger';
import MigrationManager from '../dao/migration/MigrationManager';
import CacheService from './CacheService';
import * as AppConstants from '../constants/AppConstants';
import Polyfills from './Polyfills';

export default class AppInitService{

    constructor(){
        //BackgroundService.init();
        let migrationPromise = MigrationManager.init();
        migrationPromise.then(this.loadPreferences)
                        .then(this.initContactDBIfRequired);
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
}