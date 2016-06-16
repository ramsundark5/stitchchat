import {Component} from 'react';
import {ListView, StyleSheet, Dimensions, View} from 'react-native';
import React from 'react';
const { width, height } = Dimensions.get('window');

export default class  Swiper extends Component{

    static defaultProps = {
            horizontal                       : true,
            pagingEnabled                    : true,
            showsHorizontalScrollIndicator   : false,
            showsVerticalScrollIndicator     : false,
            bounces                          : true,
            scrollsToTop                     : false,
            removeClippedSubviews            : true,
            scrollRenderAheadDistance        : 500,
            automaticallyAdjustContentInsets : false,
            showsPagination                  : true,
            showsButtons                     : false,
            index                            : 0

    };

    /**
     * Init states
     * @return {object} states
     */
    constructor(props,context) {
        super(props, context);
        let initState = this.getNewStateForProps(props);
        this.state = initState;
        console.log('init state is '+JSON.stringify(this.state))
    }

    componentDidMount(){
        this.setPageWithoutAnimation(this.props.index);
    }
    componentWillReceiveProps(nextProps){
        let newState = this.getNewStateForProps(nextProps);
        this.state = newState;
    }

    getNewStateForProps(props){
        let newState = {};

        let total = 0;
        if(props.dataSource){
            total = props.dataSource.getRowCount();
        }

        newState.total = total;

        newState.index = newState.total > 1
            ? Math.min(props.index, newState.total - 1)
            : 0;

        console.log('index is '+newState.index);
        // Default: horizontal
        newState.width = props.width || width;
        newState.height = props.height || height;
        newState.offset = {};

        if(newState.total > 1) {
            let setup = newState.index;
            newState.offset['x'] = newState.width * setup;
        }

        return newState;
    }

    /**
     * Scroll end handle
     * @param  {object} e native event
     */
    onScrollEnd(e) {
        this.updateIndex(e.nativeEvent.contentOffset);
    }

    /**
     * Update index after scroll
     * @param  {object} offset content offset
     */
    updateIndex(offset) {

        let state = this.state;
        let index = state.index;
        let diff = offset['x'] - state.offset['x'];
        let step = state.width;

        // Do nothing if offset no change.
        if(!diff) {
            return;
        }

        // Note: if touch very very quickly and continuous,
        // the variation of `index` more than 1.
        index = index + diff / step;

        this.setState({
            index: index,
            offset: offset
        })
    }

    handleScroll(e) {
        const event = e.nativeEvent;

        // [1] If preview is displayed, adjust position to current image index
        const layoutWidth = event.layoutMeasurement.width;
        const currentIndex = Math.floor((event.contentOffset.x + 0.5 * layoutWidth) / layoutWidth);
    }
    
    handleLayout(event){
        let {width, height} = event.nativeEvent.layout;
        this.setState({width, height});
    };

    setPageWithoutAnimation(index) {
        this.refs.listPagedView.scrollTo({x: this.state.width * index, animated: false});
    }

    renderScrollComponent(props) {
        return React.cloneElement(
            this.props.renderScrollComponent(props),
            {
                horizontal: true,
                pagingEnabled: true,
                maximumZoomScale: 3.0,
                showsVerticalScrollIndicator: false,
                showsHorizontalScrollIndicator: false,
                ...props,
            });
    }

    /**
     * Default render
     * @return {object} react-dom
     */
    render() {
        let state = this.state;
        let props = this.props;

        const currentOffset = {x: state.width * state.index, y: 0};
        return (
            <View style={[styles.container]}>
                <ListView   ref="listPagedView"
                            enableEmptySections={true}
                            renderScrollComponent={this.renderScrollComponent}
                            onLayout={(e) => this.handleLayout(e)}
                            contentContainerStyle={[styles.wrapper, props.style]}
                            contentOffset= {currentOffset}
                            onMomentumScrollEnd={(event) => this.onScrollEnd(event)}
                            >
                </ListView>
                {props.showsPagination && props.renderPagination
                    ? this.props.renderPagination(state.index, state.total, this): null}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'transparent',
        position: 'relative',
    },

    wrapper: {
        backgroundColor: 'transparent',
        overflow: 'hidden'
    },
});

Swiper.propTypes = {
        horizontal                       : React.PropTypes.bool,
        style                            : View.propTypes.style,
        pagingEnabled                    : React.PropTypes.bool,
        showsHorizontalScrollIndicator   : React.PropTypes.bool,
        showsVerticalScrollIndicator     : React.PropTypes.bool,
        bounces                          : React.PropTypes.bool,
        scrollsToTop                     : React.PropTypes.bool,
        removeClippedSubviews            : React.PropTypes.bool,
        automaticallyAdjustContentInsets : React.PropTypes.bool,
        showsPagination                  : React.PropTypes.bool,
        showsButtons                     : React.PropTypes.bool,
        index                            : React.PropTypes.number,
        scrollRenderAheadDistance        : React.PropTypes.number,
        renderPagination                 : React.PropTypes.func,
};
