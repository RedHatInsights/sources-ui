import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Breadcrumbs, PageHeader, PageHeaderTitle, Section } from '@red-hat-insights/insights-frontend-components';
import FilterDropdown from './FilterDropdown';
import { Button, TextInput, DropdownItem } from '@patternfly/react-core';
import PropTypes from 'prop-types';

import ListingView from '../../PresentationalComponents/ListingView/ListingView';
import SimpleKebab from './SimpleKebab';
import { viewDefinitions } from '../../views/viewDefinitions';

class ListingPage extends Component {
    static propTypes = {
        location: PropTypes.any.isRequired,
        history: PropTypes.any.isRequired
    }

    onNavigate = (_event, navigate, _index) => {
        this.props.history.push(navigate);
    }

    loadDefinition = () => viewDefinitions[this.props.location.pathname.split('/').pop()]

    parseSourceId = () => {
        const parts = this.props.location.pathname.split('/');
        return parseInt(parts[parts.length - 2], 10);
    }

    locationToState = () => ({
        viewDefinition: this.loadDefinition(),
        sourceId: this.parseSourceId()
    })

    constructor(props) {
        super(props);
        this.state = this.locationToState();
    }

    componentDidUpdate = (prevProps, _prevState) => {
        if (this.props.location.pathname !== prevProps.location.pathname) {
            this.setState(this.locationToState());
        }
    }

    render = () => (
        <React.Fragment>
            <PageHeader>
                <PageHeaderTitle title='Providers'/>
                {/**<ConnectedBreadcrumbs current="Place" />**/}
                <Breadcrumbs
                    items={[
                        { title: 'Sources', navigate: '/' }
                    ]}
                    current={this.state.viewDefinition.displayName}
                    onNavigate={this.onNavigate}
                />
            </PageHeader>
            <Section type='content'>
                <div className='pf-c-input-group'>
                    <FilterDropdown />
                    <TextInput id='filter_text' value=''/>
                    <Button>Action</Button>
                    <SimpleKebab dropdownItems={
                        [<DropdownItem key='foo' component='div'><Link to={'/'}>Back to Sources</Link></DropdownItem>]
                    }/>
                </div>
                <ListingView viewDefinition={this.state.viewDefinition} sourceId={this.state.sourceId}/>
            </Section>
        </React.Fragment>
    )
};

export default withRouter(ListingPage);
