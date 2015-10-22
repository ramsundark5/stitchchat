import React, { Component, PropTypes, View, TouchableHighlight } from 'react-native';
import ThreadOptionsBox from './ThreadOptionsBox';
import Icon from 'react-native-vector-icons/Ionicons';
import {commons, defaultStyle} from '../styles/CommonStyles';
import {threadStyle} from './ThreadStyles';

class ThreadComposer extends Component {

    _addNewThread(){
        let newThreadProps = {threadCreationType: "addNewThread"};
        this.props.router.toContactsView(newThreadProps);
    }

    _addNewGroupThread(){
        let newGroupThreadProps = {threadCreationType: "addNewGroupThread"};
        this.props.router.toContactsView(newGroupThreadProps);
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
    addNewThread: PropTypes.func.isRequired,
    addNewGroupThread: PropTypes.func.isRequired,
    searchThreads: PropTypes.func.isRequired
};

export default ThreadComposer;
