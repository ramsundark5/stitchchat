import React, {Component} from 'react';
import {View, StyleSheet, InteractionManager, Dimensions} from 'react-native';
import ContactList from '../components/contacts/ContactList';
import ContactsDao from '../dao/ContactsDao';
import LoadingSpinner from '../components/common/LoadingSpinner';

class InviteContactsPage extends Component{

    constructor(props, context) {
        super(props, context);
        this.state = {contacts: [], isLoading: true};
    }

    componentDidMount(){
        InteractionManager.runAfterInteractions(() => {
            this.loadUnregisteredContacts();
        });
    }

    loadUnregisteredContacts(){
        let showRegistered = false;
        let contacts = ContactsDao.getContacts(showRegistered);
        this.setState({contacts: contacts, isLoading: false});
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
                                 showInviteButton={true}
                                 contacts={contacts}/>
                </View>
            );
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
});


export default InviteContactsPage;