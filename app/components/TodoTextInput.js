
import React, { Component, View, Text, TextInput, TouchableHighlight, PropTypes, StyleSheet } from 'react-native';

class TodoTextInput extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      text: this.props.text || ''
    };
  }

  handleSubmit(text) {
      this.props.onSave(text);
      if (this.props.newTodo) {
        this.setState({ text: '' });
      }
  }

  handleChange(changedtext) {
    this.setState({ text: changedtext });
  }

  handleBlur(text) {
    if (!this.props.newTodo) {
      this.props.onSave(text);
    }
  }

  render() {
    return (
      <View>
        <TextInput 
               placeholder={this.props.placeholder}
               autoFocus='true'
               value={this.state.text}
               style={styles.default}
               onBlur={(event) => this.handleBlur(event.nativeEvent.text)}
               onChange={(event) => this.handleChange(event.nativeEvent.text)}
               onSubmitEditing={(event) => this.handleSubmit(event.nativeEvent.text)}/>
      </View>
    );
  }
}

TodoTextInput.propTypes = {
  onSave: PropTypes.func.isRequired,
  text: PropTypes.string,
  placeholder: PropTypes.string,
  editing: PropTypes.bool,
  newTodo: PropTypes.bool
};

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
export default TodoTextInput;
