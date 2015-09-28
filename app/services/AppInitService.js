import MessageService from '../services/MessageService';

export default class AppInitService{

    constructor(){
        MessageService.init();
    }

}