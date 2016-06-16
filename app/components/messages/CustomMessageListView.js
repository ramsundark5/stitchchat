'use strict';
import React, {Component, PropTypes} from 'react';
import {ListView, Animated, StyleSheet, Platform, Dimensions, RefreshControl} from 'react-native';

export default class CustomMessageListView extends Component{

    static defaultProps = {
        rows: {},
        maxHeight: Dimensions.get('window').height,
        previousContentLength: 0
    };

    constructor(props,context) {
        super(props, context);
        this.firstDisplay= true;
        let textInputHeight = 44;
        let scrollableTabHeight = 100; //this is 2 times the actual tab size. find out why its 2x
        this.listViewMaxHeight = this.props.maxHeight - textInputHeight - scrollableTabHeight;
        var ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => {
                if(r1 == r2){
                    //do a quick reference equality check and return
                    return false;
                }

                let statusChanged = r1.status !== r2.status;
                let selectionChanged = r1.selected !== r2.selected;
                return r1.id !== r2.id ||
                    statusChanged ||
                    selectionChanged;
            },
            sectionHeaderHasChanged: (s1, s2) => s1 !== s2
        });
        this.state = {
            dataSource: ds.cloneWithRowsAndSections({}),
            height: new Animated.Value(this.listViewMaxHeight),
            appearAnim: new Animated.Value(0),
        };
    }

    componentDidMount() {
        this.scrollResponder = this.refs.listView.getScrollResponder();
        if (this.props.rows) {
            this.appendRows(this.props.rows);
        }
    }

    componentWillReceiveProps(nextProps) {
        this.appendRows(nextProps.rows);
        if (nextProps.scrollToBottom === true) {
            setTimeout(() => {
                // inspired by http://stackoverflow.com/a/34838513/1385109
                this.scrollToBottom(true);
            }, 200);
        }
    }

    appendRows(rows) {
        let newDataSource;
        let dataIsArray = Array.isArray(rows);
        if (dataIsArray) {
            newDataSource = this.state.dataSource.cloneWithRows(rows);
        }else{
            newDataSource = this.state.dataSource.cloneWithRowsAndSections(rows);
        }
        this.setState({
            dataSource: newDataSource,
        });
    }

    onKeyboardWillHide(e) {
        Animated.timing(this.state.height, {
            toValue: this.listViewMaxHeight,
            duration: 150,
        }).start();
    }

    onKeyboardWillShow(e) {
        let newHeight = this.listViewMaxHeight - (e.endCoordinates ? e.endCoordinates.height : e.end.height);
        console.log('newHeight is '+newHeight);
        Animated.timing(this.state.height, {
            toValue: newHeight,
            duration: 200
        }).start();
    }

    onKeyboardDidShow(e) {
        setTimeout(() => {
            this.scrollToBottom(true);
        }, 200);
    }

    onKeyboardDidHide(e) {
        //this.scrollToBottom(true);
        if(Platform.OS == 'android') {
            this.onKeyboardWillHide(e);
        }
        this.scrollToBottom(true);
    }

    handleOnContentSizeChange(width, height){
        if (this.firstDisplay  === true) {
            requestAnimationFrame(() => {
                this.scrollToBottom(false);

                //give enough time for content resize and scroll to bottom
                setTimeout(() => {
                    this.firstDisplay = false;
                }, 1000);
            });
        }

        if(this.props.retainScrollPosition){
            requestAnimationFrame(() => {
                this.gotoPreviousScrollPosition(width, height);
            });
        }
    }

    scrollToBottom(animated = true) {
        if(this.refs.listView){
            let contentLength = this.refs.listView.scrollProperties.contentLength;
            let visibleLength = this.refs.listView.scrollProperties.visibleLength;
            let scrollBottomPosition = contentLength - visibleLength;
            console.log('scrollBottomPosition ' + scrollBottomPosition);
            if(contentLength > visibleLength && scrollBottomPosition > 0){
                this.scrollResponder.scrollTo({x:0, y: scrollBottomPosition, animated: animated});
            }
            if(this.props.resetScrollToBottom){
                this.props.resetScrollToBottom();
            }
        }
    }

    gotoPreviousScrollPosition(width, height){
        let contentLength = this.refs.listView.scrollProperties.contentLength;
        let visibleLength = this.refs.listView.scrollProperties.visibleLength;
        let refreshIndicatorSize = 100;
        console.log('contentLength ' + contentLength);
        console.log('height ' + height);
        if(this.refs.listView ){
            let previousScrollPosition = (contentLength - this.previousContentLength) - refreshIndicatorSize;
            console.log('previousScrollPosition ' + previousScrollPosition);
            if(contentLength > visibleLength && previousScrollPosition > 0){
                this.scrollResponder.scrollTo({x:0, y: previousScrollPosition, animated: false});
            }
        }
    }

    _onLoadOlderMessages(rowCount) {
        if(this.refs.listView){
            this.previousContentLength = this.refs.listView.scrollProperties.contentLength;
            console.log('this.previousContentLength '+this.previousContentLength);
        }
        this.props.loadOlderMessages(rowCount);
    }

    render() {
        let rowCount = this.state.dataSource.getRowCount();
        return (
            <Animated.View
                style={{height: this.state.height}}
                ref='container'>
                    <ListView
                        ref='listView'
                        automaticallyAdjustContentInsets={true}
                        enableEmptySections={true}
                        dataSource={this.state.dataSource}
                        style={styles.listView}
                        initialListSize={10}
                        onKeyboardWillShow={(event) => this.onKeyboardWillShow(event)}
                        onKeyboardDidShow={(event) => this.onKeyboardDidShow(event)}
                        onKeyboardWillHide={(event) => this.onKeyboardWillHide(event)}
                        onKeyboardDidHide={(event) => this.onKeyboardDidHide(event)}
                        keyboardDismissMode='interactive'
                        onContentSizeChange={(width, height)=>this.handleOnContentSizeChange(width, height)}
                        pageSize={rowCount} //apparently this is important for scrollto bottom
                        refreshControl={
                                      <RefreshControl
                                         refreshing={this.props.showLoadingSpinner}
                                         onRefresh={()=>{this._onLoadOlderMessages(rowCount)}}
                                         title="Loading..."
                                       />
                                   }
                        {...this.props}
                    />
            </Animated.View>
        )
    }

}

const styles = StyleSheet.create({
    listView: {
        flex: 1,
    }
});

CustomMessageListView.propTypes = {
    rows: PropTypes.object.isRequired,
    scrollToBottom: PropTypes.bool.isRequired,
    resetScrollToBottom: PropTypes.func.isRequired,
    loadOlderMessages: PropTypes.func.isRequired,
    showLoadingSpinner: PropTypes.bool.isRequired,
    retainScrollPosition: PropTypes.bool.isRequired,
};