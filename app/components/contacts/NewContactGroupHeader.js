import React, {Component, PropTypes} from 'react';
import {View, TextInput, Image, StyleSheet} from 'react-native';
import GroupInfoService from '../../services/GroupInfoService';
import NavigationBar from '../navbar/NavigationBar';

class NewContactGroupHeader extends Component{

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

    onFinishGroupCreation(){
        let newGroupThread = GroupInfoService.openNewlyAddedGroup(this.props.selectedContacts, this.state.groupNameText);
        this.props.router.toMessageView(newGroupThread);
    }

    goBackToPrevPage(){
        this.props.router.pop();
    }

    render(){
        return (
            <View>
                <NavigationBar
                    title={{ title: 'New Group', }}
                    leftButton={{ title: 'Cancel', handler: () => this.goBackToPrevPage()}}
                    rightButton={{ title: 'Invite', handler: () => this.onFinishGroupCreation()}} />
                <View style={[styles.horizontalNoWrap, styles.groupContactNameContainer]}>
                    <Image source={require('../../../assets/images/ic_person_outline_white_48pt.png')}
                           style={styles.groupImage}/>
                    <View style={[styles.underline]}>
                        <TextInput
                            style={[styles.defaultTextInput]}
                            onChange={(event) => this.onGroupNameChange(event.nativeEvent.text)}
                            value={this.state.groupNameText}
                            placeholder=" Type group name"
                            clearButtonMode='while-editing'/>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    defaultTextInput: {
        height  : 26,
        fontSize: 14,
        padding : 4,
        flex    : 1,
    },
    horizontalNoWrap:{
        flexDirection : 'row',
        flexWrap      : 'nowrap'
    },
    groupContactNameContainer:{
        margin: 20,
    },
    groupImage:{
        width: 48,
        height: 48,
        borderRadius: 20,
        backgroundColor: '#dddddd'
    },
    underline:{
        borderBottomWidth: 1.5,
        borderColor: '#333',
        margin: 10,
        flex: 1,
    }
});

NewContactGroupHeader.propTypes = {
    router: PropTypes.object.isRequired,
    selectedContacts: PropTypes.array.isRequired,
};

export default NewContactGroupHeader;