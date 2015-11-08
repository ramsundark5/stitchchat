import React, { View, Text, ListView, TouchableHighlight, PropTypes } from 'react-native';
import {commons, defaultStyle} from '../styles/CommonStyles';
import Component from '../PureComponent';
import moment from 'moment';
import ThreadItem from './ThreadItem';
import LoginService from '../../services/LoginService';
import ThreadDao from '../../dao/ThreadDao';

class ThreadList extends Component {
    constructor(props, context) {
        super(props, context);
        let nv = this.props.navigator;
        console.log("nv is "+nv);
    }

    loadMoreThreads(){
        //this.props.loadMoreThreads();
    }

    render() {
        const { threads } = this.props;
        let threadsDS = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2 });
        threadsDS = threadsDS.cloneWithRows(threads);
        return (
            <ListView
                dataSource={threadsDS}
                loadData={this.loadMoreThreads()}
                renderRow={this.renderThreadItem.bind(this)}/>
        );
    }

    renderThreadItem(rowData, sectionID, rowID) {
        return (
            <ThreadItem  key={rowData.id}
                         thread={rowData}
                         router={this.props.router}
                         selectThread={this.props.selectThread}
                         setCurrentThread={this.props.setCurrentThread}
                         isEditing={this.props.isEditing}/>
        );
    }
}

ThreadList.propTypes = {
    threads: PropTypes.array.isRequired,
    loadMoreThreads: PropTypes.func.isRequired,
    selectThread: PropTypes.func.isRequired,
    setCurrentThread: PropTypes.func.isRequired,
    isEditing: PropTypes.bool.isRequired,
    router: PropTypes.object.isRequired
};

export default ThreadList;
