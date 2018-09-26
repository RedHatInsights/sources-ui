import { LOAD_TOPOLOGY } from '../action-types-topology';
import topologyData from '../../api/topology'

function loadTopologyData(state) {
    console.log('loadTopologyData');
    const { nodes, edges } = topologyData; // static example data for now
    return {
        ...state,
        nodes,
        edges
    }
}

export default {
    [LOAD_TOPOLOGY]: loadTopologyData,
}
