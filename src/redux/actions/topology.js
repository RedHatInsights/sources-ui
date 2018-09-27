import { LOAD_TOPOLOGY, NODE_CLICK_TOPOLOGY } from '../action-types-topology';

export const loadTopology = () => ({
    type: LOAD_TOPOLOGY,
    payload: {}
});

export const nodeClick = (node) => ({
    type: NODE_CLICK_TOPOLOGY,
    payload: { node }
});
