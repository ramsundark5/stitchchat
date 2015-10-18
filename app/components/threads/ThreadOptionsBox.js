import React, { Component, PropTypes, View, TouchableHighlight } from 'react-native';
import { Icon } from 'react-native-icons';
import {commons, defaultStyle} from '../../styles/CommonStyles';
import {messageStyle} from '../messages/MessageStyles';

class ThreadOptionsBox extends Component {

    render() {
        const { deleteSelected } = this.props;
        return (
            <View style={[messageStyle.msgOptions]}>
                <TouchableHighlight style={commons.defaultIconContainer}
                                    onPress={deleteSelected}>
                    <Icon name='ion|ios-trash'
                          size={defaultStyle.iconSize}
                          color={defaultStyle.iconColor}
                          style={commons.defaultIcon}/>
                </TouchableHighlight>
            </View>
        );
    }
}

ThreadOptionsBox.propTypes = {
    deleteSelected: PropTypes.func.isRequired
};

export default ThreadOptionsBox;
