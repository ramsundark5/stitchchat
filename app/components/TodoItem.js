import React, { Component, View, Text, TextInput, TouchableHighlight, PropTypes, StyleSheet, SwitchIOS } from 'react-native';
import TodoTextInput from './TodoTextInput';

class TodoItem extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      editing: false
    };
  }

  handleDoubleClick() {
    this.setState({ editing: true });
  }

  handleSave(id, text) {
    if (text.length === 0) {
      this.props.deleteTodo(id);
    } else {
      this.props.editTodo(id, text);
    }
    this.setState({ editing: false });
  }

  handleMarkedClick(id) {
    this.props.markTodo(id);
  }

  render() {
    const {todo, markTodo, deleteTodo} = this.props;
    console.log('added text is '+todo.text);
    let element;
    if (this.state.editing) {
      element = (
        <TodoTextInput text={todo.text} style={styles.default}
                       editing={this.state.editing}
                       onSave={(text) => this.handleSave(todo.id, text)} />
      );
    } else {
      element = (
        <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
           <SwitchIOS
              onValueChange={() => this.handleMarkedClick(todo.id)}
              style={{marginBottom: 20}}
              value={todo.marked} />
          <Text onPress={this.handleDoubleClick.bind(this)} style={styles.default}>
            {todo.text}
          </Text>
        </View>
      );
    }

    return (
      <View>
        {element}
      </View>
    );
  }
}

TodoItem.propTypes = {
  todo: PropTypes.object.isRequired,
  editTodo: PropTypes.func.isRequired,
  deleteTodo: PropTypes.func.isRequired,
  markTodo: PropTypes.func.isRequired
};

var styles = StyleSheet.create({
  page: {
    paddingBottom: 300,
  },
  default: {
    height: 20,
    flex: 1,
    fontSize: 13,
    padding: 4,
  }
});

export default TodoItem;
