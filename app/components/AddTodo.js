import React, { Component, PropTypes, View, Text, TextInput, TouchableHighlight, StyleSheet } from 'react-native';
import TodoTextInput from './TodoTextInput';

class AddTodo extends Component {
  handleSave(text) {
    if (text.length !== 0) {
      this.props.addTodo(text);
    }
  }

  render() {
    return (
      <View>
          <Text>todos</Text>
          <TodoTextInput newTodo={true}
                         onSave={this.handleSave.bind(this)}
                         placeholder='What needs to be done?' />
          
      </View>
    );
  }
}

var styles = StyleSheet.create({
  default: {
    height: 26,
    borderWidth: 0.5,
    borderColor: '#0f0f0f',
    flex: 1,
    fontSize: 13,
    padding: 4,
  }
});

AddTodo.propTypes = {
  addTodo: PropTypes.func.isRequired
};

export default AddTodo;
