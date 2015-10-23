import React, { Component, View, Text, TextInput, Image, ListView, TouchableHighlight, PropTypes } from 'react-native';
import {navbarStyle} from '../navbar/NavBarStyles';
import {commons, defaultStyle} from '../styles/CommonStyles';
import Icon from 'react-native-vector-icons/Ionicons';
import ContactItem from './ContactItem';

class CreateGroupButton extends Component{

    constructor(props, context) {
        super(props, context);
    }

    render(){
        return (
            <TouchableOpacity onPress={() => alert('next') }>
                <Text style={navbarStyle.navBarRightButton}>Next</Text>
            </TouchableOpacity>
        );
    }
}

CreateGroupButton.propTypes = {
    router: PropTypes.object.isRequired
};

export default CreateGroupButton;