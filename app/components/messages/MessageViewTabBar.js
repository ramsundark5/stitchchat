import React, {Component, PropTypes} from 'react';
import {View, TouchableOpacity, StyleSheet, Animated, Text} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default class MessageViewTabBar extends Component {

    constructor(props, context){
        super(props, context);
    }

    renderTabOption(name, page) {
        var isTabActive = this.props.activeTab === page;
        var activeTextColor = this.props.activeTextColor || "#43B2A1";
        var inactiveTextColor = this.props.inactiveTextColor || "grey";
        return (
            <TouchableOpacity style={[styles.tab]} key={name} onPress={() => this.props.goToPage(page)}>
                <View>
                    <Icon name={name} style={[{color: isTabActive ? activeTextColor : inactiveTextColor,
            fontWeight: isTabActive ? 'bold' : 'normal'}, styles.icon]}/>
                </View>
            </TouchableOpacity>
        );
    }

    render() {
        var containerWidth = this.props.containerWidth;
        var numberOfTabs = this.props.tabs.length;
        var tabUnderlineStyle = {
            position: 'absolute',
            width: containerWidth / numberOfTabs,
            height: 4,
            backgroundColor: this.props.underlineColor || "#43B2A1",
            bottom: 0,
        };

        var left = this.props.scrollValue.interpolate({
            inputRange: [0, 1], outputRange: [0,  containerWidth / numberOfTabs]
        });

        return (
            <View style={[styles.tabs, {backgroundColor : this.props.backgroundColor || null}]}>
                {this.props.tabs.map((tab, i) => this.renderTabOption(tab, i))}
                <Animated.View style={[tabUnderlineStyle, {left}]} />
            </View>
        );
    }
}


const styles = StyleSheet.create({
    tab: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 10,
    },
    tabs: {
        height: 35,
        flexDirection: 'row',
        paddingTop: 5,
        borderWidth: 1,
        borderTopWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        borderBottomColor: 'rgba(0,0,0,0.05)',
    },
    icon: {
        fontSize : 30
    },
});

MessageViewTabBar.propTypes = {
    goToPage: React.PropTypes.func,
    activeTab: React.PropTypes.number,
    tabs: React.PropTypes.array
}