import React, {Component, PropTypes} from 'react';
import {View, Image, Text, TouchableHighlight, StyleSheet, TouchableOpacity} from 'react-native';
import ThreadService from '../../services/ThreadService';
import * as _ from 'lodash';
import {Theme} from '../common/Themes';
import UserAvatar from '../common/UserAvatar';

export default class ContactItem extends Component{

    constructor(props, context) {
        super(props, context);
        this.state = {
            contact: props.contact
        };
    }

     openThreadForContact(contact){
         if(this.props.showInviteButton){
             //don't do anything in invite users page
             return;
         }
        let threadForContact = ThreadService.openThreadForContact(contact);
        this.props.router.toMessageView(threadForContact);
     }

    addToInviteList(contact){
        let contactAfterInvite = _.assign({}, contact, {selected: contact.selected ? false : true})
        this.props.inviteContact(contactAfterInvite);
        this.setState({contact: contactAfterInvite});
    }

    render() {
        const {showInviteButton} = this.props;
        const {contact} = this.state;
        return(
            <TouchableHighlight onPress={() => this.openThreadForContact(contact)}>
                <View>
                    <View style={styles.contactItemContainer}>
                        <UserAvatar
                            size={50}
                            username={contact.displayName}
                            onPressIn={() => {}}
                            onPressOut={() => {}}/>
                        <View style={{marginLeft: 10}}>
                            <Text style={[styles.title]}>{contact.displayName}</Text>
                            {this.renderPhoneNumberOrStatusMessage(contact)}
                        </View>
                        {this.renderInviteButton(contact, showInviteButton)}
                    </View>
                    <View style={styles.contactDivider} />
                </View>
            </TouchableHighlight>
        );
    }

    renderPhoneNumberOrStatusMessage(contact){
        if(contact.isRegisteredUser){
            return(
                <Text style={styles.statusText}>{contact.status}</Text>
            );
        }else{
            let phoneLabel = contact.phoneLabel? contact.phoneLabel: '';
            return(
                <Text style={[styles.phoneNumber]}>{phoneLabel} {contact.phoneNumber}</Text>
            );
        }
    }

    renderInviteButton(contact, showInviteButton){
        if(!showInviteButton){
            return null;
        }
        const selectButtonText  = contact.selected? 'SELECTED' : 'SELECT';
        const selectButtonStyle = contact.selected? styles.selectedButton : styles.unSelectedButton;
        const selectTextStyle = contact.selected? styles.selectedText : styles.unSelectedText;
        return(
            <TouchableOpacity
                onPress={() => {this.addToInviteList(contact)}}
                style={selectButtonStyle}>
                <Text style={selectTextStyle}>
                    {selectButtonText}
                </Text>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    contactItemContainer:{
        flexDirection : 'row',
        margin: 10
    },
    title: {
        fontSize: 14,
        color: '#656565',
        fontWeight: 'bold',
        flex: 1,
        marginBottom: 10
    },
    contactDivider:{
        margin: 10,
        height: 1,
        backgroundColor: '#dddddd'
    },
    selectedButton:{
        position: 'absolute',
        right: 10,
        borderColor: Theme.primaryColor,
        backgroundColor: Theme.primaryColor,
        borderRadius: 5,
        height: 30,
        width: 60,
        justifyContent: 'center',
    },
    unSelectedButton:{
        position: 'absolute',
        right: 10,
        borderColor: Theme.primaryColor,
        borderWidth: 1,
        borderRadius: 5,
        height: 30,
        width: 60,
        justifyContent: 'center',
    },
    selectedText:{
        color: Theme.defaultTextColor,
        fontWeight: 'bold',
        fontSize: 10,
        textAlign: 'center',
    },
    unSelectedText:{
        color: Theme.primaryColor,
        fontSize: 10,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 20,
        backgroundColor: '#dddddd'
    },
    statusText:{
        color: '#9c9393',
        fontSize: 14,
        fontStyle: 'italic',
    },
    phoneNumber:{
        color: '#9c9393',
        fontSize: 12,
        fontStyle: 'italic',
    }
});

ContactItem.propTypes = {
    showInviteButton: PropTypes.bool,
    inviteContact: PropTypes.func,
    contact: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired
};