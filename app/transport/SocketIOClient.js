window.navigator.userAgent = 'react-native';
import io from 'socket.io-client/socket.io';
let instance = null;

export default class SocketIOClient{
    constructor() {
        if(!instance){
            instance = this;
            this.init();
        }
        return instance;
    }

    init(){
        this.socket = io('localhost:3000', {jsonp: false});
        this.state = { status: 'Not connected' };
        this.socket.connect();
        this.initListeners();
        this.socket.emit('add user', 'React native');
    }

    initListeners(){
        // An event to be fired on connection to socket
        this.socket.on('connect', () => {
            console.log('Wahey -> connected!');
        });

        // Event called when 'someEvent' it emitted by server
        this.socket.on('new message', (data) => {
            console.log('Some message was sent, check out this data: ', data);
        });

        // Event called when 'someEvent' it emitted by server
        this.socket.on('typing', (data) => {
            console.log('typing event is here: ', data);
        });

    }

    publish(topic, msgObj){
        // Emit an event to server
        var data = { username: 'React native', message: msgObj.text}
        this.socket.emit('new message', msgObj.text);
    }
}



