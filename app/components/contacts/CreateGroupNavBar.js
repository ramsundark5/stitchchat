import React, { Component, View, Text, TextInput, TouchableOpacity, PropTypes } from 'react-native';
import styles from '../navbar/styles';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux/native';
import {commons, defaultStyle} from '../styles/CommonStyles';
import {contactStyle} from './ContactStyles';
import {navBarStyle} from '../navbar/NavBarStyles';
import * as ThreadActions from '../../actions/ThreadActions';
import * as ContactActions from '../../actions/ContactActions';
import ThreadService from '../../services/ThreadService';

class CreateGroupNavBar extends Component{

    constructor(props, context) {
        super(props, context);
        this.state = {
            groupNameText: ''
        };
    }

    onGroupNameChange(changedGroupNameText){
        this.setState({
            groupNameText: changedGroupNameText
        });
    }

    async onFinishGroupCreation(){
        let newGroupThread = await ThreadService.addNewGroup(this.props.selectedContacts, this.state.groupNameText);
        this.props.setCurrentThread(newGroupThread);
        this.props.router.toMessageView(newGroupThread);
    }

    goBackToPrevPage(){
        this.props.router.pop();
    }

    getTitleElement(title) {
        return (
            <Text
                style={[styles.navBarTitleText, ]}>
                {title}
            </Text>
        );
    }

    getLeftButtonElement(title) {
        return (
            <TouchableOpacity onPress={() => this.goBackToPrevPage()}>
                <View style={styles.navBarButton}>
                    <Text style={[styles.navBarButtonText ]}>{title}</Text>
                </View>
            </TouchableOpacity>
        );
    }

    getRightButtonElement(title) {
        return (
            <TouchableOpacity onPress={() => this.onFinishGroupCreation()}>
                <View style={styles.navBarButton}>
                    <Text style={[styles.navBarButtonText ]}>{title}</Text>
                </View>
            </TouchableOpacity>
        );
    }

    render(){
        return (
            <View>
                <View style={[styles.navBarContainer, navBarStyle.stitchNavBar]}>
                    <View style={[styles.navBar, this.props.style, ]}>
                        {this.getTitleElement('New Group')}
                        {this.getLeftButtonElement('Cancel', { marginLeft: 8, })}
                        {this.getRightButtonElement('Next', { marginRight: 8, })}
                    </View>
                </View>
                <TextInput
                    style={contactStyle.searchInput}
                    onChange={(event) => this.onGroupNameChange(event.nativeEvent.text)}
                    value={this.state.groupNameText}
                    placeholder=" Type group name"
                    clearButtonMode='while-editing'/>
            </View>
        );
    }
}

CreateGroupNavBar.propTypes = {
    router: PropTypes.object.isRequired,
    selectedContacts: PropTypes.array.isRequired,
    setCurrentThread: PropTypes.func.isRequired
};

export default CreateGroupNavBar;