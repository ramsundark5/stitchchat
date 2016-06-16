import React, {Component, PropTypes} from 'react';
import {View, TextInput, TouchableOpacity, Text, ListView, StyleSheet} from 'react-native';
import ContactItem from './ContactItem';
import JsSearch from 'js-search';
import {Theme} from '../common/Themes';
var SMSComposer = require('NativeModules').RNMessageComposer;

class ContactList extends Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            searchText: '',
            filteredContacts: props.contacts
        };
        this.searchIndex = new JsSearch.Search('phoneNumber');
        this.searchIndex.searchIndex = new JsSearch.UnorderedSearchIndex();
        this.searchIndex.addIndex('displayName');
        this.searchIndex.addIndex('phoneNumber');
    }

    componentDidMount(){
        this.contacts = this.props.contacts;
        this.searchIndex.addDocuments(this.contacts);
    }

    handleSearch(changedSearchText) {
        this.setState({searchText: changedSearchText});
        if(changedSearchText && changedSearchText.trim != ''){
            let matchingContacts = this.searchIndex.search(changedSearchText);
            this.setState({filteredContacts: matchingContacts});
        }else{
            this.setState({filteredContacts: this.contacts});
        }
    }

    inviteContact(selectedContact){
        for(let i=0; i< this.contacts.length; i++){
            let contact = this.contacts[i];
            if(contact.phoneNumber === selectedContact.phoneNumber){
                this.contacts[i].selected = selectedContact.selected;
            }
        }
    }

    onSendInvite(){
        let contactsToBeInvited = [];
        for(let contact of this.contacts){
            if(contact.selected){
                contactsToBeInvited.push(contact);
            }
        }
        var inviteMessage = 'Hey, I started using StitchChat. Visit http://stitch.chat to download.';
        SMSComposer.composeMessageWithArgs(
            {
                'messageText':inviteMessage,
                'subject':'checkout StichChat app!',
                'recipients': contactsToBeInvited
            },
            (result) => {
                switch(result) {
                    case SMSComposer.Sent:
                        console.log('the message has been sent');
                        break;
                    case SMSComposer.Cancelled:
                        console.log('user cancelled sending the message');
                        break;
                    case SMSComposer.Failed:
                        console.log('failed to send the message');
                        break;
                    case SMSComposer.NotSupported:
                        console.log('this device does not support sending texts');
                        break;
                    default:
                        console.log('something unexpected happened');
                        break;
                }
            }
        );
    }

    render() {
        const { filteredContacts } = this.state;
        let contactsDS = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2 });
        contactsDS = contactsDS.cloneWithRows(filteredContacts);
        return (
            <View style={styles.container}>
                <View style={styles.searchInputContainer}>
                    <TextInput
                        ref='textInput'
                        style={styles.searchInput}
                        onChange={(event) => this.handleSearch(event.nativeEvent.text)}
                        value={this.state.searchText}
                        placeholder="  search contacts"
                        clearButtonMode='while-editing'/>
                </View>
                <View style={styles.listContainer}>
                    <ListView
                        dataSource={contactsDS}
                        renderRow={(rowData, sectionID, rowID) => this._renderContactItem(rowData, sectionID, rowID)}/>
                </View>
                {this._renderInviteButton()}
             </View>

        );
    }

    _renderInviteButton(){
        if(!this.props.showInviteButton){
            return null;
        }else{
            return(
                <View style={styles.inviteButtonContainer}>
                    <TouchableOpacity
                        onPress={() => {this.onSendInvite()}}
                        style={styles.inviteButton}>
                        <Text style={styles.inviteButtonText}>
                            Send Invites
                        </Text>
                    </TouchableOpacity>
                </View>
            );
        }
    }

    _renderContactItem(rowData, sectionID, rowID) {
        if(!rowData){
            return;
        }
        return (
            <ContactItem key={rowData.phoneNumber}
                         contact={rowData}
                         inviteContact={(selectedContact) => this.inviteContact(selectedContact)}
                         showInviteButton={this.props.showInviteButton}
                         router={this.props.router}/>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        borderRadius: 4,
        borderWidth: 0.5,
        borderColor: '#d6d7da',
    },
    listContainer: {
        flex: 1,
    },
    searchInputContainer: {
        backgroundColor: '#C9C9CE',
        height: 44,
        borderTopColor: '#7e7e7e',
        borderBottomColor: '#b5b5b5',
        borderTopWidth: 0.5,
        borderBottomWidth: 0.5,
    },
    searchInput: {
        backgroundColor: '#FFFFFF',
        height: 28,
        borderRadius: 5,
        paddingTop: 4.5,
        paddingBottom: 4.5,
        paddingLeft: 10,
        paddingRight: 10,
        marginTop: 7.5,
        marginLeft: 8,
        marginRight: 8,
        fontSize: 15,
    },
    inviteButtonContainer:{
        flexDirection: 'row',
        justifyContent: 'center',
    },
    inviteButton:{
        borderColor: Theme.primaryColor,
        backgroundColor: Theme.primaryColor,
        borderRadius: 5,
        height: 40,
        width: 200,
        margin: 5,
        justifyContent: 'center',
    },
    inviteButtonText:{
        color: Theme.defaultTextColor,
        fontSize: Theme.fontSize,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

ContactList.propTypes = {
    showInviteButton: PropTypes.bool,
    router: PropTypes.object.isRequired
};

export default ContactList;
