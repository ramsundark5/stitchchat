import React, { Component, View, StyleSheet } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux/native';
import AddTodo from '../components/AddTodo';
import TodoList from '../components/TodoList';
import * as TodoActions from '../actions/TodoActions';

class TodoApp extends Component {
  render() {
    const { todos, dispatch } = this.props;
    const actions = bindActionCreators(TodoActions, dispatch);

    return (
      <View style={styles.container}>
        <AddTodo addTodo={actions.addTodo} />
        <TodoList todos={todos} actions={actions} />
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    todos: state.todos
  };
}

var styles = StyleSheet.create({
  container: {
    marginTop:40,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: '#d6d7da',
  }
});
export default connect(mapStateToProps)(TodoApp);
