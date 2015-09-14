import React, { Component, PropTypes, View, TouchableHighlight } from 'react-native';
import { Icon } from 'react-native-icons';
import {commons, defaultStyle} from '../../styles/CommonStyles';
import {messageStyle} from '../../styles/MessageStyles';

class MessageOptionsBox extends Component {

    render() {
        const { actions } = this.props;
        return (
            <View style={[messageStyle.msgOptions]}>
                <TouchableHighlight style={[commons.defaultIconContainer]}
                                    onPress={actions.copySelectedMessages}>
                    <Icon name='ion|ios-copy'
                          size={defaultStyle.iconSize} color={defaultStyle.iconColor}
                          style={commons.defaultIcon}/>
                </TouchableHighlight>
                <TouchableHighlight style={commons.defaultIconContainer}
                                    onPress={actions.forwardSelected}>
                    <Icon name='ion|forward'
                          size={defaultStyle.iconSize} color={defaultStyle.iconColor}
                          style={commons.defaultIcon}/>
                </TouchableHighlight>
                <TouchableHighlight style={commons.defaultIconContainer}
                                    onPress={actions.deleteSelected}>
                    <Icon name='ion|ios-trash'
                          size={defaultStyle.iconSize} color={defaultStyle.iconColor}
                          style={commons.defaultIcon}/>
                </TouchableHighlight>
            </View>
        );
    }
}

MessageOptionsBox.propTypes = {
};

export default MessageOptionsBox;
