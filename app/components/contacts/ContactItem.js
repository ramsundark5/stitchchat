import React, { Component, View, Text, PropTypes, TouchableHighlight } from 'react-native';
import {commons, defaultStyle} from '../styles/CommonStyles';
import {contactStyle} from './ContactStyles';

export default class ContactItem extends Component{

    render() {
        const {contact} = this.props;
        return (
            <TouchableHighlight>
                <View>
                    <View style = {contactStyle.contactItemContainer}>
                        <Text style={[contactStyle.title]}>{contact.displayName}</Text>
                    </View>
                    <View style={commons.separator}/>
                </View>
            </TouchableHighlight>
        );
    }
}