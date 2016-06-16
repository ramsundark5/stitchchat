import React, {Component, PropTypes} from 'react';
import {View, TouchableHighlight, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import ActionButton from '../common/ActionButton';

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
                    <Icon name="ios-people-outline" style={styles.actionButtonIcon} />
                </ActionButton.Item>
                <ActionButton.Item buttonColor='#3498db' onPress={() => this._addNewThread()}>
                    <Icon name='ios-create-outline' style={styles.actionButtonIcon}/>
                </ActionButton.Item>
            </ActionButton>
        );
    }
}

const styles = StyleSheet.create({
    actionButtonIcon: {
        fontSize : 30,
        color: 'white',
        fontWeight: 'bold',
    },
});

ThreadComposer.propTypes = {
    searchThreads: PropTypes.func.isRequired
};

export default ThreadComposer;
