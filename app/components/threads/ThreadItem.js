import React, { Component, View, Text, PropTypes, SwitchIOS, TouchableHighlight } from 'react-native';
import {commons, defaultStyle} from '../../styles/Styles';
import {messageStyle} from '../../styles/MessageStyle';
import { Icon } from 'react-native-icons';

class ThreadItem extends Component {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        const {thread, isEditing} = this.props;
        return (
            <TouchableHighlight>
                <View style={[messageStyle.msgItem]}>
                    <Text style={commons.defaultText}>
                        {thread.lastMessageText}
                    </Text>
                </View>
            </TouchableHighlight>
        );
    }
}

ThreadItem.propTypes = {
    thread: PropTypes.object.isRequired,
    selectThread: PropTypes.func.isRequired
};

export default ThreadItem;
