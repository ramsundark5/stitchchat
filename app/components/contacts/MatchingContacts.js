import React, {PropTypes} from 'react';
import {View, Text, TextInput, Image, ListView, TouchableHighlight, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Component from '../PureComponent';

export default class MatchingContacts extends Component{
    render(){
        const { isSearching, filteredContacts } = this.props;

        if(!isSearching){
            return null;
        }
        let contactsDS = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2 });
        contactsDS = contactsDS.cloneWithRows(filteredContacts);
        return(
            <View style={styles.listContainer}>
                <ListView
                    dataSource={contactsDS}
                    renderRow={(contact, sectionID, rowID) => this._renderMatchingContactItem(contact, sectionID, rowID)}/>
            </View>
        );
    }

    _renderMatchingContactItem(contact, sectionID, rowID) {
        let phoneLabel = contact.phoneLabel? contact.phoneLabel: '';
        return (
            <TouchableHighlight onPress={()=> this.props.selectContact(contact)} key={contact.phoneNumber}>
                <View style={styles.contactItemContainer}>
                    <View style={styles.horizontalNoWrap}>
                        <Text style={[styles.title]}>{contact.displayName}</Text>
                    </View>
                    <Text style={[styles.phoneNumber]}>{phoneLabel} {contact.phoneNumber}</Text>
                    <View style={styles.contactDivider}/>
                </View>
            </TouchableHighlight>
        );
    }
}

const styles = StyleSheet.create({
    listContainer: {
        flex: 1,
    },
    horizontalNoWrap:{
        flexDirection : 'row',
        flexWrap      : 'nowrap'
    },
    title: {
        fontSize: 14,
        color: '#656565',
        fontWeight: 'bold',
        flex: 1
    },
    contactItemContainer: {
        margin: 5,
        paddingLeft: 20
    },
    contactDivider:{
        margin: 10,
        height: 1,
        backgroundColor: '#dddddd'
    },
    phoneNumber:{
        color: '#9c9393',
        fontSize: 12,
        fontStyle: 'italic',
    }
});
MatchingContacts.propTypes = {
    isSearching: PropTypes.bool.isRequired,
    selectContact: PropTypes.func.isRequired
};