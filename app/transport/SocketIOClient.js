//import SocketIO from 'react-native-swift-socketio';

export default class SocketIOClient{
    constructor(){
       /* this.socket = new SocketIO('localhost:3000', {});
        this.state = { status: 'Not connected' };
        this.socket.connect();
        this.initListeners();*/
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

        // Manually join namespace
        this.socket.joinNamespace()

        // Leave namespace, back to '/'
        this.socket.leaveNamespace()
    }

    send(message){
        // Emit an event to server
        this.socket.emit('new message', {some: 'data'});
    }
}
// Connect!


