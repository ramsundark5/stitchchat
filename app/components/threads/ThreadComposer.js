import React, { Component, PropTypes, View, TouchableHighlight } from 'react-native';
import ThreadOptionsBox from './ThreadOptionsBox';
import Icon from 'react-native-vector-icons/Ionicons';
import {commons, defaultStyle} from '../styles/CommonStyles';
import {threadStyle} from './ThreadStyles';

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
        const { isEditing, deleteSelected } = this.props;
        if(isEditing){
            return(
                <ThreadOptionsBox isEditing={isEditing} deleteSelected={deleteSelected}/>
            );
        }

        else{
            return (
                <View style={[threadStyle.threadOptions]}>
                    <TouchableHighlight style={commons.defaultIconContainer}
                                        onPress = {() => this._searchThreads(null)}>
                        <Icon name='ios-search'
                              style={commons.defaultIcon}/>
                    </TouchableHighlight>
                    <TouchableHighlight style={[commons.defaultIconContainer]}
                                        onPress={() => this._addNewThread()}>
                        <Icon name='ios-compose-outline'
                              style={commons.defaultIcon}/>
                    </TouchableHighlight>
                    <TouchableHighlight style={commons.defaultIconContainer}
                                        onPress={() => this._addNewGroupThread()}>
                        <Icon name='ios-people-outline'
                              style={commons.defaultIcon}/>
                    </TouchableHighlight>
                </View>
            );
        }
    }
}

ThreadComposer.propTypes = {
    searchThreads: PropTypes.func.isRequired,
    deleteSelected: PropTypes.func.isRequired
};

export default ThreadComposer;
