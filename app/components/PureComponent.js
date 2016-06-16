import React from 'react';
import shallowCompare from 'react-addons-shallow-compare';

export default class Component extends React.Component {

    shouldComponentUpdate(nextProps, nextState) {
        const shouldUpdate = shallowCompare(this, nextProps, nextState);
        return shouldUpdate;
    }
}