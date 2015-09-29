import React, { Component, PropTypes, View, TouchableHighlight } from 'react-native';
import ThreadOptionsBox from './ThreadOptionsBox';
import { Icon } from 'react-native-icons';
import {commons, defaultStyle} from '../../styles/CommonStyles';
import {threadStyle} from '../../styles/ThreadStyles';

class ThreadComposer extends Component {

    _addNewThread(recipientContactInfo){
        recipientContactInfo = {};
        recipientContactInfo.phoneNumber = '4444444444';
        this.props.addNewThread(recipientContactInfo);
    }

    _addNewGroupThread(recipientContactInfo){
        recipientContactInfo = {};
        recipientContactInfo.phoneNumber = '5555555555';
        //this.props.addNewGroupThread();
        this.props.addNewThread(recipientContactInfo);
    }

    _searchThreads(searchText){
        this.props.searchThreads(searchText);
    }

    render() {
        const { isEditing } = this.props;
        if(isEditing){
            return(
                <ThreadOptionsBox isEditing={isEditing} actions={actions}/>
            );
        }

        else{
            return (
                <View style={[threadStyle.threadOptions]}>
                    <TouchableHighlight style={commons.defaultIconContainer}
                                        onPress = {() => this._searchThreads(null)}>
                        <Icon name='ion|ios-search'
                              size={defaultStyle.iconSize} color={defaultStyle.iconColor}
                              style={commons.defaultIcon}/>
                    </TouchableHighlight>
                    <TouchableHighlight style={[commons.defaultIconContainer]}
                                        onPress={() => this._addNewThread(null)}>
                        <Icon name='ion|ios-compose-outline'
                              size={defaultStyle.iconSize} color={defaultStyle.iconColor}
                              style={commons.defaultIcon}/>
                    </TouchableHighlight>
                    <TouchableHighlight style={commons.defaultIconContainer}
                                        onPress={() => this._addNewGroupThread(null)}>
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
    addNewThread: PropTypes.func.isRequired,
    addNewGroupThread: PropTypes.func.isRequired,
    searchThreads: PropTypes.func.isRequired
};

export default ThreadComposer;
