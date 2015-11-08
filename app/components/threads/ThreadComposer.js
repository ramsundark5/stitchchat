import React, { Component, PropTypes, View, TouchableHighlight } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {commons, defaultStyle} from '../styles/CommonStyles';
import {threadStyle} from './ThreadStyles';
import ActionButton from 'react-native-action-button';

class ThreadComposer extends Component {

    _addNewThread(){
        this.props.router.toContactsView();
    }

    _addNewGroupThread(){
        this.props.router.toCreateGroupsView();
    }

    _searchThreads(searchText){
        this.props.searchThreads(searchText);
    }

    render() {
        return (
            <ActionButton buttonColor="rgba(231,76,60,1)">
                <ActionButton.Item buttonColor='#1abc9c' onPress={() => this._addNewGroupThread()}>
                    <Icon name="ios-people-outline" style={commons.defaultIcon} />
                </ActionButton.Item>
                <ActionButton.Item buttonColor='#3498db' onPress={() => this._addNewThread()}>
                    <Icon name='ios-compose-outline' style={commons.defaultIcon}/>
                </ActionButton.Item>
            </ActionButton>
        );
    }
}

ThreadComposer.propTypes = {
    searchThreads: PropTypes.func.isRequired
};

export default ThreadComposer;
