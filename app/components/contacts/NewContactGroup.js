import React, { Component, View, Text, TextInput, Image, ListView, TouchableHighlight, PropTypes } from 'react-native';
import {commons, defaultStyle} from '../styles/CommonStyles';
import {contactStyle} from './ContactStyles';
import Icon from 'react-native-vector-icons/Ionicons';
import ContactItem from './ContactItem';
import NewContactGroupHeader from './NewContactGroupHeader';

class NewContactGroup extends Component{

    constructor(props, context) {
        super(props, context);
        this.state = {
            searchText: ''
        };
    }

    handleSearch(changedSearchText) {
        if(!changedSearchText || changedSearchText.length <= 0){
            changedSearchText = '';
        }
        this.setState({
            searchText: changedSearchText
        });

        this.props.searchContacts(changedSearchText);
    }

    selectContact(contact){
        this.state = {
            searchText: ''
        };
        this.props.selectContact(contact);
    }

    removeSelectedContact(contact){
        this.props.selectContact(contact);
    }

    render(){
        const { contacts, isSearching, router } = this.props;
        const selectedContacts = contacts.filter(contact =>
            contact.selected === true
        );

        return (
            <View style={commons.container}>
                <NewContactGroupHeader
                    selectedContacts={selectedContacts}
                    setCurrentThread={this.props.setCurrentThread}
                    router={router}/>

                <View style={commons.horizontalNoWrap}>

                    <View style={[contactStyle.underline, contactStyle.groupContactSearchContainer]}>
                        <TextInput
                            style={contactStyle.searchInput}
                            onChange={(event) => this.handleSearch(event.nativeEvent.text)}
                            value={this.state.searchText}
                            placeholder=" Type contact name"
                            clearButtonMode='while-editing'/>
                    </View>
                </View>

                {this._renderSelectedContactList(selectedContacts, isSearching)}
                {this._renderMatchingContactList(isSearching)}
             </View>
        );
    }

    _renderSelectedContactList(selectedContacts, isSearching){
        if(isSearching) {
            return;
        }
        let selectedContactsDS = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2 });
        selectedContactsDS = selectedContactsDS.cloneWithRows(selectedContacts);

        return(
            <ListView
                dataSource={selectedContactsDS}
                renderRow={this._renderSelectedContactItem.bind(this)}/>
        );
    }

    _renderSelectedContactItem(matchingContact, sectionID, rowID){
        return(
            <View>
                <View style={[contactStyle.selectedContactsContainer]}>
                    <Text style={[commons.defaultText]}>{matchingContact.displayName}</Text>
                    <Icon name='android-close'
                          style={[contactStyle.contactDeleteIcon]}
                          onPress={()=>this.removeSelectedContact(matchingContact)}/>
                 </View>
                <View style={contactStyle.contactDivider}/>
            </View>
        );
    }

    _renderMatchingContactList(isSearching){
        if(!isSearching){
            return;
        }
        const { filteredContacts } = this.props;
        let contactsDS = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2 });
        contactsDS = contactsDS.cloneWithRows(filteredContacts);
        return(
            <View style={commons.listContainer}>
                <ListView
                    dataSource={contactsDS}
                    renderRow={this._renderMatchingContactItem.bind(this)}/>
            </View>
        );
    }

    _renderMatchingContactItem(contact, sectionID, rowID) {
        return (
            <TouchableHighlight onPress={() => this.selectContact(contact)}>
                <View style={contactStyle.contactItemContainer}>
                    <View style={commons.horizontalNoWrap}>
                        <Image
                            style={commons.thumbNail}
                            source={{uri: 'something.jpg'}}
                            />
                        <Text style={[contactStyle.title]}>{contact.displayName}</Text>
                    </View>
                    <View style={contactStyle.contactDivider}/>
                </View>
            </TouchableHighlight>
        );
    }
}

NewContactGroup.propTypes = {
    filteredContacts: PropTypes.array.isRequired,
    searchContacts: PropTypes.func.isRequired,
    selectContact: PropTypes.func.isRequired,
    contacts: PropTypes.array.isRequired,
    setCurrentThread: PropTypes.func.isRequired,
    isSearching: PropTypes.bool.isRequired,
    router: PropTypes.object.isRequired
};

export default NewContactGroup;