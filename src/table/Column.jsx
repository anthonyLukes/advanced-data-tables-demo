import React, {Component} from 'react';

export default class Column extends Component {
    static propTypes = {

    }

    static defaultProps = {

    }

    constructor(props, context) {
        super(props, context);
        this.state = { };
    }

    render() {
        return (
            <div>{this.props.children}</div>
        );
    }
}