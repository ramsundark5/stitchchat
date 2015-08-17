import React, { Component, View, Text, TextInput, TouchableHighlight, PropTypes, StyleSheet } from 'react-native';
import { SHOW_ALL, SHOW_MARKED, SHOW_UNMARKED } from '../constants/TodoFilters';

const FILTER_TITLES = {
  [SHOW_ALL]: 'All',
  [SHOW_UNMARKED]: 'Active',
  [SHOW_MARKED]: 'Completed'
};

class Footer extends Component {
  render() {
    return (
      <View className='footer'>
        {this.renderTodoCount()}
        <View className='filters'>
          {[SHOW_ALL, SHOW_UNMARKED, SHOW_MARKED].map(filter =>
            <View key={filter}>
              {this.renderFilterLink(filter)}
            </View>
          )}
        </View>
        {this.renderClearButton()}
      </View>
    );
  }

  renderTodoCount() {
    const { unmarkedCount } = this.props;
    const itemWord = unmarkedCount === 1 ? 'item' : 'items';

    return (
      <Text className='todo-count'>
        {unmarkedCount || 'No'} {itemWord} left
      </Text>
    );
  }

  renderFilterLink(filter) {
    const title = FILTER_TITLES[filter];
    const { filter: selectedFilter, onShow } = this.props;

    return (
      <TouchableHighlight>
      <Text style={styles.text}
         onPress={() => onShow(filter)}>
        {title}
      </Text>
      </TouchableHighlight>
    );
  }

  renderClearButton() {
    const { markedCount, onClearMarked } = this.props;
    if (markedCount > 0) {
      return (
        <TouchableHighlight
                onPress={onClearMarked} >
          <Text>Clear completed</Text>
        </TouchableHighlight>
      );
    }
  }
}

Footer.propTypes = {
  markedCount: PropTypes.number.isRequired,
  unmarkedCount: PropTypes.number.isRequired,
  filter: PropTypes.string.isRequired,
  onClearMarked: PropTypes.func.isRequired,
  onShow: PropTypes.func.isRequired
};

var styles = StyleSheet.create({
  row: {
    justifyContent: 'center',
    flexDirection: 'row',
  },
  icon: {
    width: 24,
    height: 24,
  },
  image: {
    width: 50,
    height: 50,
  },
  text: {
    fontSize: 16,
  },
  button: {
    color: '#007AFF',
  },
  wrapper: {
    borderRadius: 8,
  },
  wrapperCustom: {
    borderRadius: 8,
    padding: 6,
  },
  textBlock: {
    fontWeight: '500',
    color: 'blue',
  },
});
export default Footer;
