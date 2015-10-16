import MessageService from '../services/MessageService';
import ContactsManager from '../services/ContactsManger';
import MigrationManager from '../dao/migration/MigrationManager';

export default class AppInitService{

    constructor(){
        //MessageService.init();
        //ContactsManager.init();
        let migrationPromise = MigrationManager.init();
        migrationPromise.then(function onComplete(res){
            //ContactsManager.init();
        });

    }

}