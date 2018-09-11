import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import DetailView from '../../PresentationalComponents/DetailView/DetailView';

class DetailPage extends Component {
    render() {
        return (
            <React.Fragment>
                <h1>Details of a Provider</h1>
                <DetailView />
            </React.Fragment>
        )
    }
};

export default withRouter(DetailPage);
