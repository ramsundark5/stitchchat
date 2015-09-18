import SocketIOClient from '../transport/SocketIOClient';
import MQTTClient from '../transport/MQTTClient';

export default class AppInitService{

    constructor(){
        new MQTTClient().init();
    }

}