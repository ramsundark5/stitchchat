import React, {Component} from 'react';
import {View, StyleSheet, TouchableOpacity, Text, InteractionManager, Dimensions} from 'react-native';
import {Theme} from '../components/common/Themes';
import ContactList from '../components/contacts/ContactList';
import ContactsDao from '../dao/ContactsDao';
import LoadingSpinner from '../components/common/LoadingSpinner';

class ContactsPage extends Component{

    constructor(props, context) {
        super(props, context);
        this.state = {contacts: [], isLoading: true};
    }

    componentDidMount(){
        this.loadRegisteredContacts();
    }

    loadRegisteredContacts(){
        let showRegistered = false;
        let contacts = ContactsDao.getContacts(showRegistered);
        this.setState({contacts: contacts, isLoading: false});
    }

    onClickInvite(router){
        router.toInviteContactsView();
    }

    render() {
        const { router } = this.props;
        const { contacts, isLoading } = this.state;
        if(isLoading){
            return(
                <View style={styles.loadingContainer}>
                    <LoadingSpinner size="large"/>
                </View>
            );
        }else{
            return (
                <View style={styles.container}>
                    <ContactList router={router}
                                 showInviteButton={false}
                                 contacts={contacts}/>
                    {this.renderNoContactsMessage(contacts)}
                    <View style={styles.inviteButtonContainer}>
                        <TouchableOpacity
                            onPress={() => {this.onClickInvite(router)}}
                            style={styles.inviteButton}>
                            <Text style={styles.inviteButtonText}>
                                Invite Friends!
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            );
        }
    }

    renderNoContactsMessage(contacts){
        if(contacts.length <= 3){
            return(
                <View style={styles.inviteFriendsMessageContainer}>
                    <Text style={styles.inviteFriendsMessageText}>
                        :( It's no fun without friends. Click below to invite your friends!
                    </Text>
                </View>
            );
        }else{
            return null;
        }

    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        borderRadius: 4,
        borderWidth: 0.5,
        borderColor: '#d6d7da',
        backgroundColor: '#FAFAFA',
    },
    loadingContainer:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: Dimensions.get('window').height,
        width: Dimensions.get('window').width,
    },
    inviteFriendsMessageContainer:{
      flex: 1,
      justifyContent: 'center',
    },
    inviteFriendsMessageText:{
        textAlign: 'center'
    },
    inviteButtonContainer:{
      flexDirection: 'row',
      justifyContent: 'center'
    },
    inviteButton:{
        borderColor: Theme.primaryColor,
        backgroundColor: Theme.primaryColor,
        borderRadius: 5,
        height: 40,
        width: 200,
        margin: 20,
        justifyContent: 'center',
    },
    inviteButtonText:{
        color: Theme.defaultTextColor,
        fontSize: Theme.fontSize,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default ContactsPage;