import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Section } from '@red-hat-insights/insights-frontend-components';

import DetailView from '../../PresentationalComponents/DetailView/DetailView';

class DetailPage extends Component {
    render = () =>
        <React.Fragment>
            <Section type='content'>
                <h1>Details of a Provider</h1>
                <DetailView />
            </Section>
        </React.Fragment>
};

export default withRouter(DetailPage);
