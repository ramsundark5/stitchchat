import React, {PropTypes} from 'react';
import {View, ListView, Dimensions, StyleSheet} from 'react-native';


const deviceWidth = Dimensions.get('window').width;

export default class ImageCarousell extends React.Component {
  static propTypes = {
    dataSource: PropTypes.instanceOf(ListView.DataSource).isRequired,
    initialIndex: PropTypes.number,
    style: View.propTypes.style,
    imageStyle: View.propTypes.style,
  };

  static defaultProps = {
      initialIndex: 0,
      horizontal: true,
      pagingEnabled: true,
      maximumZoomScale: 3.0,
      showsVerticalScrollIndicator: false,
      showsHorizontalScrollIndicator: false,
      scrollRenderAheadDistance: 500,
      scrollsToTop: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      currentIndex: props.initialIndex
    };
  }

  componentDidMount() {
    const { initialIndex } = this.props;
    this.refs.listView.scrollTo({x: initialIndex * deviceWidth, animated: false});
  }

  handleScroll(e) {
    const event = e.nativeEvent;
    const layoutWidth = event.layoutMeasurement.width;
    const newCurrentIndex = Math.floor((event.contentOffset.x + 0.5 * layoutWidth) / layoutWidth);
    this.setState({currentIndex: newCurrentIndex});
  }

  render() {
    let total = 0;
    if(this.props.dataSource){
      total = this.props.dataSource.getRowCount();
    }
    return (
        <View style={[styles.container, this.props.style]}>
          <ListView
              ref="listView"
              enableEmptySections={true}
              style={styles.listView}
              onScroll={(event)=>this.handleScroll(event)}
              {...this.props}
          />
          {this.props.renderPagination(this.state.currentIndex, total, this)}
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000000',
  },
  listView: {
    flex: 1,
  },
});
