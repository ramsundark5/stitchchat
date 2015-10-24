import React, { Component, View, Text, TextInput, Image, ListView, TouchableHighlight, PropTypes } from 'react-native';
import {navbarStyle} from '../navbar/NavBarStyles';
import {commons, defaultStyle} from '../styles/CommonStyles';
import * as ThreadActions from '../../actions/ThreadActions';
import * as ContactActions from '../../actions/ContactActions';

class CreateGroupButton extends Component{

    constructor(props, context) {
        super(props, context);
    }

    createGroup(){

    }

    render(){
        return (
            <TouchableOpacity onPress={() => this.createGroup() }>
                <Text style={navbarStyle.navBarRightButton}>Next</Text>
            </TouchableOpacity>
        );
    }
}

CreateGroupButton.propTypes = {
    router: PropTypes.object.isRequired
};

function mapStateToProps(state) {
    return {
    };
}

function mapDispatchToProps(dispatch) {
    return {
        threadActions: bindActionCreators(ThreadActions, dispatch),
        contactActions: bindActionCreators(ContactActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateGroupButton);