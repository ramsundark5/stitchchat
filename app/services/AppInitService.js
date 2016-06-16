import BackgroundService from './BackgroundService';

class AppInitService{
    constructor(){

    }

    init(){
        //do a set timeout to defer this action
        BackgroundService.init();
    }
}

export default new AppInitService();