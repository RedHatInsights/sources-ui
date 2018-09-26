import React, { Component } from 'react';
import { connect } from 'react-redux';

import { TopologyCanvas } from '@manageiq/react-ui-components/dist/topology'
import { PageHeader, PageHeaderTitle, Section } from '@red-hat-insights/insights-frontend-components';
import '@manageiq/react-ui-components/dist/topology.css'
import topologyData from './topologyData.js'

class TopologyView extends Component {
    constructor(props) {
        super(props);
        this.handleNodeClick = this.handleNodeClick.bind(this);
    }

    handleNodeClick(args) {
        console.log('handleNodeClick', args);
    }

    componentDidMount() {
        //this.props.loadTopologyData();
    }

    render() {
        const { nodes, edges } = topologyData;
        return (
            <React.Fragment>
                <TopologyCanvas nodes={nodes} edges={edges} handleNodeClick={this.handleNodeClick}/>
            </React.Fragment>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return {
        loadTopologyData: () => dispatch(loadTopologyData()),
    }
}

//const mapStateToProps = ({inventory:{listingRows = [], rawRows = []}}) => ({listingRows, rawRows})
const mapStateToProps = () => ({})

export default connect(mapStateToProps, mapStateToProps)(TopologyView);
