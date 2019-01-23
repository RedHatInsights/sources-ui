import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Card, CardHeader, CardBody } from '@patternfly/react-core';
import PropTypes from 'prop-types';

class NodeDetails extends Component {
    static propTypes = {
        node: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.string,
            title: PropTypes.string
        })).isRequired
    }

    constructor(props) {
        super(props);
    }

    render() {
        //{id: 3, title: "Yang", size: 24, fonticon: "fa fa-cloud", depth: 3}
        if (this.props.node === undefined)
        {return <Card><CardHeader>Select a node</CardHeader></Card>;}

        return (
            <Card>
                <CardHeader>Details go <b>here</b></CardHeader>
                <CardBody>
                    <dl>
                        <dt>ID</dt><dd>{this.props.node.id}</dd>
                        <dt>Title</dt><dd>{this.props.node.title}</dd>
                    </dl>
                </CardBody>
            </Card>
        );
    }
}

const mapStateToProps = ({ topology: { activeNode: node } }) => ({ node });

export default connect(mapStateToProps)(NodeDetails);
