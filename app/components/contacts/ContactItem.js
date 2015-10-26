import React, { Component, View, Image, Text, PropTypes, TouchableHighlight } from 'react-native';
import {commons, defaultStyle} from '../styles/CommonStyles';
import {contactStyle} from './ContactStyles';
import ThreadService from '../../services/ThreadService';

export default class ContactItem extends Component{

    constructor(props, context) {
        super(props, context);
    }

    async openThreadForContact(contact){
        let threadForContact = await ThreadService.getThreadForContact(contact);
        this.props.setCurrentThread(threadForContact);
        this.props.router.toMessageView(threadForContact);
    }

    render() {
        const {contact} = this.props;
        let contactStatusMsg = contact.status && contact.status.length > 0 ? contact.status : "Hey there! I'm using stitchchat";
        return (
            <TouchableHighlight onPress={() => this.openThreadForContact(contact)}>
                <View style={contactStyle.contactItemContainer}>
                    <View style={commons.horizontalNoWrap}>
                        <Image
                            style={commons.thumbNail}
                            source={{uri: 'something.jpg'}}
                            />
                            <Text style={[contactStyle.title]}>{contact.displayName}</Text>
                    </View>
                    <Text style={[commons.defaultText, {marginLeft: 20}]}>{contactStatusMsg}</Text>
                    <View style={contactStyle.contactDivider}/>
                </View>
            </TouchableHighlight>
        );
    }
}