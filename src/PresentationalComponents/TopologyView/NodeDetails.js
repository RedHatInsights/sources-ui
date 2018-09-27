import React, { Component } from 'react';
import { connect } from 'react-redux';

class NodeDetails extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        // {id: 3, title: "Yang", size: 24, fonticon: "fa fa-cloud", depth: 3, …}
        if (this.props.node === undefined)
          return <div>Select a node</div>

        return (
            <div>
                <h4>Details go <b>here</b></h4>
                <dl>
                  <dt>ID</dt><dd>{this.props.node.id}</dd>
                  <dt>Title</dt><dd>{this.props.node.title}</dd>
                </dl>
            </div>
        )
    }
}

const mapStateToProps = ({topology:{activeNode:node}}) => ({node})

export default connect(mapStateToProps)(NodeDetails);
