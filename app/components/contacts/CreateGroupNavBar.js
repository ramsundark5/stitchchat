import React, { Component, View, Text, TouchableHighlight, TouchableOpacity, PropTypes } from 'react-native';
import styles from '../navbar/styles';
import {commons, defaultStyle} from '../styles/CommonStyles';
import {navBarStyle} from '../navbar/NavBarStyles';
import * as ThreadActions from '../../actions/ThreadActions';
import * as ContactActions from '../../actions/ContactActions';

class CreateGroupNavBar extends Component{

    constructor(props, context) {
        super(props, context);
    }

    createGroup(){

    }

    getTitleElement(title) {

        return (
            <Text
                style={[styles.navBarTitleText, ]}>
                {title}
            </Text>
        );
    }

    getButtonElement(title) {
        return (
            <TouchableOpacity>
                <View style={styles.navBarButton}>
                    <Text style={[styles.navBarButton ]}>{title}</Text>
                </View>
            </TouchableOpacity>
        );
    }

    render(){
        return (
            <View style={[styles.navBarContainer, navBarStyle.stitchNavBar]}>
                <View style={[styles.navBar, this.props.style, ]}>
                    {this.getTitleElement('New Group')}
                    {this.getButtonElement('Cancel', { marginLeft: 8, })}
                    {this.getButtonElement('Next', { marginRight: 8, })}
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
    };
}

function mapDispatchToProps(dispatch) {
    return {
        threadActions: bindActionCreators(ThreadActions, dispatch),
        contactActions: bindActionCreators(ContactActions, dispatch)
    };
}

//export default connect(mapStateToProps, mapDispatchToProps)(CreateGroupButton);
export default CreateGroupNavBar;