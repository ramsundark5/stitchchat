import React, { Component, View, Text, ListView, TouchableHighlight, PropTypes } from 'react-native';
import TodoItem from './TodoItem';
import Footer from './Footer';
import { SHOW_ALL, SHOW_MARKED, SHOW_UNMARKED } from '../constants/TodoFilters';

const TODO_FILTERS = {
  [SHOW_ALL]: () => true,
  [SHOW_UNMARKED]: todo => !todo.marked,
  [SHOW_MARKED]: todo => todo.marked
};

class TodoList extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = { filter: SHOW_ALL };
    this.actions = props.actions;
  }

  handleClearMarked() {
    const atLeastOneMarked = this.props.todos.some(todo => todo.marked);
    if (atLeastOneMarked) {
      this.props.actions.clearMarked();
    }
  }

  handleShow(filter) {
    this.setState({ filter });
  }

  render() {
    const { todos, actions } = this.props;
    const { filter } = this.state;
    const filteredTodos = todos.filter(TODO_FILTERS[filter]);
    const markedCount = todos.reduce((count, todo) =>
      todo.marked ? count + 1 : count,
      0
    );

    let todoListDS = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    todoListDS = todoListDS.cloneWithRows(filteredTodos);

    return (
     <View>
        <ListView
          dataSource={todoListDS}
          renderRow={(rowData) => <TodoItem key={rowData.id} todo={rowData} {...actions}/>}/>
        {this.renderFooter(markedCount)}
      </View>
    );
  }

  renderTodoRow(rowData, sectionID, rowID) {
    return(
         <TodoItem key={rowData.id} todo={rowData}/>
    );
  }

  renderFooter(markedCount) {
    const { todos } = this.props;
    const { filter } = this.state;
    const unmarkedCount = todos.length - markedCount;

    if (todos.length) {
      return (
        <Footer markedCount={markedCount}
                unmarkedCount={unmarkedCount}
                filter={filter}
                onClearMarked={this.handleClearMarked.bind(this)}
                onShow={this.handleShow.bind(this)} />
      );
    }
  }
}

TodoList.propTypes = {
  todos: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired
};

export default TodoList;
