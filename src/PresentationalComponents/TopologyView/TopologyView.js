import React, { Component } from 'react';
import { connect } from 'react-redux';
import { TopologyCanvas } from '@manageiq/react-ui-components/dist/topology'
import { PageHeader, PageHeaderTitle, Section } from '@red-hat-insights/insights-frontend-components';
import '@manageiq/react-ui-components/dist/topology.css'

import { loadTopology } from '../../redux/actions/topology';

class TopologyView extends Component {
    constructor(props) {
        super(props);
        this.handleNodeClick = this.handleNodeClick.bind(this);
    }

    handleNodeClick(args) {
        console.log('handleNodeClick', args);
    }

    componentDidMount() {
        this.props.loadTopology();
    }

    render() {
        const { nodes, edges } = this.props;
        return (
            <React.Fragment>
                <TopologyCanvas nodes={nodes} edges={edges} handleNodeClick={this.handleNodeClick}/>
            </React.Fragment>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return {
        loadTopology: () => dispatch(loadTopology()),
    }
}

const mapStateToProps = ({topology:{nodes = [], edges = []}}) => ({nodes, edges})

export default connect(mapStateToProps, mapDispatchToProps)(TopologyView);
