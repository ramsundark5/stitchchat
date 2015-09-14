import React, { Component, PropTypes, View, TouchableHighlight } from 'react-native';
import ThreadOptionsBox from './ThreadOptionsBox';
import { Icon } from 'react-native-icons';
import {commons, defaultStyle} from '../../styles/CommonStyles';
import {threadStyle} from '../../styles/ThreadStyles';

class ThreadComposer extends Component {

    render() {
        const { isEditing, actions } = this.props;
        if(isEditing){
            return(
                <ThreadOptionsBox isEditing={isEditing} actions={actions}/>
            );
        }
        else{
            return (
                <View style={[threadStyle.threadOptions]}>
                    <TouchableHighlight style={commons.defaultIconContainer}
                                        onPress={actions.deleteSelected}>
                        <Icon name='ion|ios-search'
                              size={defaultStyle.iconSize} color={defaultStyle.iconColor}
                              style={commons.defaultIcon}/>
                    </TouchableHighlight>
                    <TouchableHighlight style={[commons.defaultIconContainer]}
                                        onPress={actions.copySelectedMessages}>
                        <Icon name='ion|ios-compose-outline'
                              size={defaultStyle.iconSize} color={defaultStyle.iconColor}
                              style={commons.defaultIcon}/>
                    </TouchableHighlight>
                    <TouchableHighlight style={commons.defaultIconContainer}
                                        onPress={actions.forwardSelected}>
                        <Icon name='ion|ios-people-outline'
                              size={defaultStyle.iconSize} color={defaultStyle.iconColor}
                              style={commons.defaultIcon}/>
                    </TouchableHighlight>
                </View>
            );
        }
    }
}

ThreadComposer.propTypes = {
    //addNewThread: PropTypes.func.isRequired,
    //addNewGroupThread: PropTypes.func.isRequired
};

export default ThreadComposer;
