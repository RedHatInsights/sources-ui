/*eslint max-len: 0*/
const topologyData = {
    nodes: [
        { id: 3, title: 'Yang', size: 24, fonticon: 'fa fa-cloud', depth: 3, status: 'valid', highlight: false, x: 600, y: 161.60000000000002 }, { id: 4, title: 'Gray', size: 24, fonticon: 'fa fa-cloud', depth: 3, status: 'valid', highlight: false, x: 600, y: 161.60000000000002 }, { id: 5, title: 'Maddox', size: 24, fileicon: 'https://www.svgrepo.com/show/5386/speedometer.svg', depth: 3, status: 'warning', highlight: false, x: 600, y: 161.60000000000002 }, { id: 0, title: 'Levy', size: 24, fonticon: 'fa fa-cog', depth: 1, status: 'valid', highlight: false, x: 50, y: 161.60000000000002, fx: 61, fy: null }, { id: 1, title: 'Celina', size: 24, fonticon: 'fa fa-cloud', depth: 2, status: 'warning', highlight: false, x: 400, y: 161.60000000000002 }, { id: 2, title: 'Nancy', size: 24, fonticon: 'fa fa-cloud', depth: 2, status: 'critical', highlight: false, x: 400, y: 161.60000000000002 }
    ],

    edges: [
        { source: 1, target: 4 }, { source: 2, target: 5 }, { source: 0, target: 1 }, { source: 0, target: 2 }, { source: 1, target: 3 }
    ]
};

export default topologyData;
