import React, {PropTypes} from 'react';
import {View, Text, TextInput, Image, ListView, TouchableHighlight, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Component from '../PureComponent';

export default class SelectedContacts extends Component{

    render(){
        const { isSearching, selectedContacts } = this.props;

        if(isSearching) {
            return null;
        }
        let selectedContactsDS = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2 });
        selectedContactsDS = selectedContactsDS.cloneWithRows(selectedContacts);

        return(
            <ListView
                dataSource={selectedContactsDS}
                renderRow={(matchingContact, sectionID, rowID) => this._renderSelectedContactItem(matchingContact, sectionID, rowID)}/>
        );
    }

    _renderSelectedContactItem(matchingContact, sectionID, rowID){
        return(
            <View>
                <View style={[styles.selectedContactsContainer]}>
                    <Text style={[styles.defaultText]}>{matchingContact.displayName}</Text>
                    <Icon name='md-close'
                          style={[styles.contactDeleteIcon]}
                          onPress={() => this.props.removeSelectedContact(matchingContact)}/>
                </View>
                <View style={styles.contactDivider}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    defaultText: {
        fontSize: 14,
    },
    contactDeleteIcon:{
        fontSize: 20,
        marginRight: 15
    },
    selectedContactsContainer:{
        flex: 1,
        flexDirection : 'row',
        flexWrap      : 'nowrap',
        justifyContent: 'space-between',
        marginTop: 10,
        marginLeft: 15,
        marginRight: 15
    },
    contactDivider:{
        margin: 10,
        height: 1,
        backgroundColor: '#dddddd'
    },
});

SelectedContacts.propTypes = {
    selectedContacts: PropTypes.array.isRequired,
    isSearching: PropTypes.bool.isRequired,
    removeSelectedContact: PropTypes.func.isRequired
};