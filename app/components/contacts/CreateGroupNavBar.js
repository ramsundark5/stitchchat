import React, { Component, View, Text, TouchableHighlight, TouchableOpacity, PropTypes } from 'react-native';
import styles from '../navbar/styles';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux/native';
import {commons, defaultStyle} from '../styles/CommonStyles';
import {navBarStyle} from '../navbar/NavBarStyles';
import * as ThreadActions from '../../actions/ThreadActions';
import * as ContactActions from '../../actions/ContactActions';
import ThreadService from '../../services/ThreadService';

class CreateGroupNavBar extends Component{

    constructor(props, context) {
        super(props, context);
    }

    async onFinishGroupCreation(){
        let newGroupThread = await ThreadService.addNewGroup(this.props.selectedContacts, 'testgroup');
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
            <View style={[styles.navBarContainer, navBarStyle.stitchNavBar]}>
                <View style={[styles.navBar, this.props.style, ]}>
                    {this.getTitleElement('New Group')}
                    {this.getLeftButtonElement('Cancel', { marginLeft: 8, })}
                    {this.getRightButtonElement('Next', { marginRight: 8, })}
                </View>
            </View>
        );
    }
}

CreateGroupNavBar.propTypes = {
    router: PropTypes.object.isRequired
};

function mapStateToProps(state) {
    return {
        selectedContacts: state.contactState.selectedContacts
    };
}

function mapDispatchToProps(dispatch) {
    return {
        threadActions: bindActionCreators(ThreadActions, dispatch),
        contactActions: bindActionCreators(ContactActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateGroupNavBar);