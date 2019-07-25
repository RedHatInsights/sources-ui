import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

import { Section } from '@red-hat-insights/insights-frontend-components';

import DetailView from '../../PresentationalComponents/DetailView/DetailView';

class DetailPage extends Component {
    static propTypes = {
        match: PropTypes.object.isRequired
    };

    render = () =>
        (<React.Fragment>
            <Section type='content'>
                <h1>Details of a Provider</h1>
                <DetailView sourceId={parseInt(this.props.match.params.id, 10)}/>
            </Section>
        </React.Fragment>)
};

export default withRouter(DetailPage);
