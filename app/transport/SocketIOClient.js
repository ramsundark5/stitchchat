window.navigator.userAgent = 'react-native';
import io from 'socket.io-client/socket.io';

var currentUserId = "+13392247442";
class SocketIOClient{

    init(){
        this.socket = io('localhost:3000', {jsonp: false});
        this.state = { status: 'Not connected' };
        this.socket.connect();
        this.initListeners();
    }

    initListeners(){
        // An event to be fired on connection to socket
        let socketref = this.socket;
        this.socket.on('connect', () => {
            console.log('Wahey -> connected!');

            // Connected, let's sign-up for to receive messages for this room
            socketref.emit('room', currentUserId);
        });

        /*let socketref = this.socket;
        this.socket.on('connect', function() {
            console.log('Wahey -> connected!');
            // Connected, let's sign-up for to receive messages for this room
            socketref.emit('room', currentUserId);
        });*/

        this.socket.on('message', function(data) {
            console.log('Incoming message:', data);
        });

        // Event called when 'someEvent' it emitted by server
        this.socket.on('+13392247442', (data) => {
            console.log('Some message was sent, check out this data: ', data);
        });
    }

    startConversation(recipientId){
        this.socket.join(recipientId);
    }

    publish(recipientId, message){
        this.socket.emit('message', {
            recipientId: recipientId,
            fromId: currentUserId,
            type: 'message',
            data: message
        });
    }
}

module.exports = new SocketIOClient();

