var RNContactsManager = require('react-native').NativeModules.RNContactsManager;
//var AddressBook = require('react-native').NativeModules.AddressBook;

class ContactsManger{

    init(countryCode){

        let fetchContactsPromise = RNContactsManager.initializeContacts(countryCode);
        fetchContactsPromise.then(function(res){
            console.log("contacts initialized");
        });

    }
}
module.exports = new ContactsManger();