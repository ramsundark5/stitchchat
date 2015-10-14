import MessageService from '../services/MessageService';
import ContactsManager from '../services/ContactsManger';

export default class AppInitService{

    constructor(){
        MessageService.init();
        ContactsManager.init();
    }

}