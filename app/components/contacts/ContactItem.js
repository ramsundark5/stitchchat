import React, { Component, View, Text, PropTypes, TouchableHighlight } from 'react-native';
import {commons, defaultStyle} from '../styles/CommonStyles';
import {contactStyle} from './ContactStyles';
import ThreadDao from '../../dao/ThreadDao';

export default class ContactItem extends Component{

    constructor(props, context) {
        super(props, context);
    }

    async openThreadForContact(contact){
        let threadForContact = await ThreadDao.getThreadForContact(contact);
        this.props.setCurrentThread(threadForContact);
        this.props.router.toMessageView(threadForContact);
    }

    render() {
        const {contact} = this.props;
        return (
            <TouchableHighlight onPress={() => this.openThreadForContact(contact)}>
                <View>
                    <View style = {contactStyle.contactItemContainer}>
                        <Text style={[contactStyle.title]}>{contact.displayName}</Text>
                        <Text style={[contactStyle.title]}>{contact.phoneNumber}</Text>
                    </View>
                    <View style={commons.separator}/>
                </View>
            </TouchableHighlight>
        );
    }
}