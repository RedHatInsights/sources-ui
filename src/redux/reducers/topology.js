import { LOAD_TOPOLOGY, NODE_CLICK_TOPOLOGY } from '../action-types-topology';
import topologyData from '../../api/topology';

function loadTopologyData(state) {
    console.log('R: loadTopologyData');
    const { nodes, edges } = topologyData; // static example data for now
    return {
        ...state,
        nodes,
        edges
    };
}

function nodeClickTopology(state, { payload: { node } }) {
    console.log('R: nodeClickTopology', node);
    return {
        ...state,
        activeNode: node
    };
}

export default {
    [LOAD_TOPOLOGY]: loadTopologyData,
    [NODE_CLICK_TOPOLOGY]: nodeClickTopology
};
