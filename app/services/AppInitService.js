import SocketIOClient from '../transport/SocketIOClient';

export default class AppInitService{

    constructor(){
        new SocketIOClient();
    }

}