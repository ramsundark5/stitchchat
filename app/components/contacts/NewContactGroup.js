import React, {Component, PropTypes} from 'react';
import {View, Text, TextInput, Image, ListView, TouchableHighlight, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import NewContactGroupHeader from './NewContactGroupHeader';
import MatchingContacts from './MatchingContacts';
import SelectedContacts from './SelectedContacts';

class NewContactGroup extends Component{

    constructor(props, context) {
        super(props, context);
        this.state = {
            searchText: '',
            filteredContacts: props.contacts,
            selectedContacts: [],
            isSearching: false
        };
    }

    handleSearch(changedSearchText) {
        if(changedSearchText && changedSearchText.trim != ''){
            let matchingContacts = this.props.handleSearch(changedSearchText);
            this.setState({
                filteredContacts: matchingContacts,
                isSearching: true,
                searchText: changedSearchText
            });
        }else{
            this.setState({
                filteredContacts: [],
                isSearching: false,
                searchText: changedSearchText
            });
        }
    }

    selectContact(selectedContact){
        let newSelectedContacts = this.state.selectedContacts.concat(selectedContact);
        this.setState({
            searchText: '',
            selectedContacts: newSelectedContacts,
            isSearching: false
        });
    }

    removeSelectedContact(selectedContact){
        let newSelectedContacts = this.state.selectedContacts.filter(contact =>
            contact.phoneNumber !== selectedContact.phoneNumber
        );
        this.setState({selectedContacts: newSelectedContacts});
    }

    render(){
        const { router } = this.props;
        const { searchText, isSearching, selectedContacts, filteredContacts } = this.state;
        return (
            <View style={styles.container}>
                <NewContactGroupHeader
                    selectedContacts={selectedContacts}
                    router={router}/>

                <View style={styles.horizontalNoWrap}>

                    <View style={[styles.underline, styles.groupContactSearchContainer]}>
                        <TextInput
                            style={styles.searchInput}
                            onChange={(event) => this.handleSearch(event.nativeEvent.text)}
                            value={searchText}
                            placeholder=" Type contact name"
                            clearButtonMode='while-editing'/>
                    </View>
                </View>
                <SelectedContacts selectedContacts={selectedContacts}
                                  isSearching={isSearching}
                                  removeSelectedContact={(selectedContact) => this.removeSelectedContact(selectedContact)}/>
                <MatchingContacts isSearching={isSearching}
                                  filteredContacts={filteredContacts}
                                  selectContact={(selectedContact) => this.selectContact(selectedContact)}/>
             </View>
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
    horizontalNoWrap:{
        flexDirection : 'row',
        flexWrap      : 'nowrap'
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
    groupContactSearchContainer:{
        margin: 20,
    },
    underline:{
        borderBottomWidth: 1.5,
        borderColor: '#333',
        margin: 10,
        flex: 1,
    }
});

NewContactGroup.propTypes = {
    contacts: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    handleSearch: PropTypes.func.isRequired
};

export default NewContactGroup;