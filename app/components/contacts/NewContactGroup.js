import React, { Component, View, Text, TextInput, Image, ListView, TouchableHighlight, PropTypes } from 'react-native';
import {commons, defaultStyle} from '../styles/CommonStyles';
import {contactStyle} from './ContactStyles';
import Icon from 'react-native-vector-icons/Ionicons';
import ContactItem from './ContactItem';

class NewContactGroup extends Component{

    constructor(props, context) {
        super(props, context);
        this.state = {
            searchText: '',
            isSearching: false
        };
    }

    handleSearch(changedSearchText) {
        let isSearching = true;
        if(!changedSearchText || changedSearchText.length <= 0){
            isSearching = false;
        }
        this.setState({
            searchText: changedSearchText,
            isSearching: isSearching
        });

        this.props.searchContacts(changedSearchText);
    }

    selectContact(contact){
        this.props.selectContact(contact);
        this.state = {
            searchText: '',
            isSearching: false
        };
    }

    render(){
        return (
            <View style={commons.container}>
                <Text style={commons.defaultText}>Add Group Participants</Text>
                <TextInput
                    ref='textInput'
                    style={contactStyle.searchInput}
                    onChange={(event) => this.handleSearch(event.nativeEvent.text)}
                    value={this.state.searchText}
                    placeholder=" Type contact name"
                    clearButtonMode='while-editing'/>
                {this._renderSelectedContactList()}
                {this._renderMatchingContactList()}
             </View>
        );
    }

    _renderSelectedContactList(){
        if(this.state.isSearching) {
            return;
        }
        const { selectedContacts } = this.props;
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
                          style={[contactStyle.contactDeleteIcon]}/>
                 </View>
                <View style={contactStyle.contactDivider}/>
            </View>
        );
    }

    _renderMatchingContactList(){
        if(!this.state.isSearching){
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
    selectedContacts: PropTypes.array.isRequired,
    router: PropTypes.object.isRequired
};

export default NewContactGroup;