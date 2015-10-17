var RNContactsManager = require('react-native').NativeModules.RNContactsManager;
import CacheService from './CacheService';
import * as AppConstants from '../constants/AppConstants';

class ContactsManger{

    init(countryCode){
        let initContactsPromise = RNContactsManager.initializeContacts(countryCode);
        initContactsPromise.then(function(res){
            console.log("contacts initialized");
            CacheService.setAndPersist(AppConstants.IS_CONTACT_DB_INITIALIZED, 1);
        });
    }
}
module.exports = new ContactsManger();