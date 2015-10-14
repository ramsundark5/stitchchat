var RNContactsManager = require('react-native').NativeModules.RNContactsManager;
//var AddressBook = require('react-native').NativeModules.AddressBook;

class ContactsManger{

    init(){

        let fetchContactsPromise = RNContactsManager.getAllContactsWithPhoneNumber();
        fetchContactsPromise.then(function(res){
            console.log("contacts initialized");
        });

    }
}
module.exports = new ContactsManger();