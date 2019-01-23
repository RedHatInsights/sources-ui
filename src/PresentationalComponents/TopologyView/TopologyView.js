import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { TopologyCanvas } from '@manageiq/react-ui-components/dist/topology';
import '@manageiq/react-ui-components/dist/topology.css';
import { Split, SplitItem } from '@patternfly/react-core';
import PropTypes from 'prop-types';

import { loadTopology, nodeClick } from '../../redux/actions/topology';
import NodeDetails from './NodeDetails';

class TopologyView extends Component {
    static propTypes = {
        nodes: PropTypes.arrayOf(PropTypes.any).isRequired,
        edges: PropTypes.arrayOf(PropTypes.any).isRequired,
        loadTopology: PropTypes.func.isRequired,
        nodeClick: PropTypes.func.isRequired
    }

    constructor(props) {
        super(props);
    }

    handleNodeClick = (node) => {
        console.log('handleNodeClick', node);
        this.props.nodeClick(node);
    }

    componentDidMount = () => {
        this.props.loadTopology();
    }

    render = () => {
        const { nodes, edges } = this.props;
        if (nodes.length === 0) {
            return <h1>Loading</h1>;
        }

        return (
            <Split>
                <SplitItem isMain>
                    <TopologyCanvas nodes={nodes} edges={edges}
                        handleNodeClick={this.handleNodeClick}
                    />
                </SplitItem>
                <SplitItem>
                    <NodeDetails />
                </SplitItem>
            </Split>
        );
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({ loadTopology, nodeClick }, dispatch);
const mapStateToProps = ({ topology: { nodes = [], edges = [] } }) => ({ nodes, edges });

export default connect(mapStateToProps, mapDispatchToProps)(TopologyView);
