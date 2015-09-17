import SocketIOClient from '../utils/SocketIOClient';

export default class AppInitService{

    constructor(){
        this.initSocketIOConnection();
    }

    initSocketIOConnection(){
        new SocketIOClient();
    }
}