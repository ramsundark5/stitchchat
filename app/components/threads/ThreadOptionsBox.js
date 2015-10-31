import React, { Component, PropTypes, View, TouchableHighlight } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {commons, defaultStyle} from '../styles/CommonStyles';
import {threadStyle} from './ThreadStyles';

class ThreadOptionsBox extends Component {

    render() {
        const { deleteSelected } = this.props;
        return (
            <View style={[threadStyle.threadOptions]}>
                <TouchableHighlight style={commons.defaultIconContainer}
                                    onPress={deleteSelected}>
                    <Icon name='ios-trash'
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
