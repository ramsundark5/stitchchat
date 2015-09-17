import React, { Component, PropTypes, View, Text, TextInput } from 'react-native';
import MessageTextInput from './MessageTextInput';
import MessageOptionsBox from './MessageOptionsBox';
import { Icon } from 'react-native-icons';
import {commons} from '../../styles/CommonStyles';
import MQTTClient from '../../utils/MQTTClient';

class MessageComposer extends Component {
    constructor(props, context) {
        super(props, context);
        let mqtt = new MQTTClient();
        mqtt.init();
    }

    handleSave(text) {
        if (text.length !== 0) {
            this.props.addMessage(text);
        }
    }

    render() {
        const { isEditing, actions } = this.props;
        if(isEditing){
            return(
                <MessageOptionsBox isEditing={isEditing} actions={actions}/>
            );
        }
       else{
            return (
                <MessageTextInput newMessage={true}
                                  style={commons.defaultTextInput}
                                  onSave={this.handleSave.bind(this)}
                                  placeholder='Type here'/>
            );
        }
    }
}

MessageComposer.propTypes = {
    addMessage: PropTypes.func.isRequired
};

export default MessageComposer;
