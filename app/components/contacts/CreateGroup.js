import React, { Component, View, Text, TextInput, ListView, TouchableHighlight, PropTypes } from 'react-native';

class CreateGroup extends Component{

    render(){
        return (
            <View style={commons.container}>
                <TextInput
                    value={this.state.searchText}
                    style={commons.searchInput}
                    placeholder="  Type contact name "
                    onChange={(event) => this.handleSearch(event.nativeEvent.text)}/>
                <View style={commons.listContainer}>
                    <ListView
                        dataSource={contactsDS}
                        renderRow={this.renderContactItem.bind(this)}/>
                </View>
             </View>
        );
    }
}