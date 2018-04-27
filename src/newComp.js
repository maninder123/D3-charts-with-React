import React, {Component} from 'react';

export class BottomText extends Component {
    constructor(props) {
        super(props);
        this.state = {
            color: props.color,
            data1: props.data1,
            margin: props.margin
        };
    }
    componentDidMount() {
        // this.renderchart(this)
    }

    render() {
        const tooltip = (
            <div
                className='tooltip'
                ref={node => this.node = node}
                id={this.props.id}
                width={this.props.width}
                height={this.props.height}></div>
        );
        return (tooltip);
    }
}