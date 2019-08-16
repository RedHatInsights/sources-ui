import React, { Component } from 'react';
import TopologyView from '../../PresentationalComponents/TopologyView/TopologyView';
import { PageHeader, PageHeaderTitle, Section } from '@red-hat-insights/insights-frontend-components';

class TopologyPage extends Component {
    render = () =>
        (<React.Fragment>
            <PageHeader>
                <PageHeaderTitle title='Topology'/>
            </PageHeader>
            <Section type='content'>
                <TopologyView />
            </Section>
        </React.Fragment>)
}

export default TopologyPage;
