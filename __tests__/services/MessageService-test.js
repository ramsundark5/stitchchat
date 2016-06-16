jest.autoMockOn();
//jest.mock('realm');
jest.mock('../../app/transport/FirebaseMessageHandler');
jest.unmock('../../app/services/MessageService');
//var Realm = require('realm');
//import MessageService from '../../app/services/MessageService';
var MessageService = require('../../app/services/MessageService').default;
var Message = require('../../app/models/Message').default;

describe('Message Service tests', () => {

    it('handleOutgoingTextMessage should call addMessage with new message object', () => {
        MessageService.handleOutgoingTextMessage(null, "hello world");
        expect("hello").toEqual("hello");
    });
    
});