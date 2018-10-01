import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect, withRouter } from 'react-router-dom';
import asyncComponent from '../../Utilities/asyncComponent';
import './provider-page.scss';
import filter from 'lodash/filter';
import { addProvider } from '../../redux/actions/providers';

import { Donut, PageHeader, PageHeaderTitle, Section } from '@red-hat-insights/insights-frontend-components';
import {  FormRenderer } from '@red-hat-insights/insights-frontend-components/components/Forms';

import { Button, Grid, GridItem } from '@patternfly/react-core';
import { Card, CardHeader, CardBody, CardFooter, Gallery, Modal } from '@patternfly/react-core';

//const EntityListView = asyncComponent(() => import('../../PresentationalComponents/EntityListView/EntityListView'));
import EntityListView from '../../PresentationalComponents/EntityListView/EntityListView';
import EntityFilter from '../../PresentationalComponents/EntityListView/EntityFilter';

import { providerColumns } from '../../SmartComponents/ProviderPage/providerColumns'
import { providerForm } from './providerForm'

/**
 * A smart component that handles all the api calls and data needed by the dumb components.
 * Smart components are usually classes.
 *
 * https://reactjs.org/docs/components-and-props.html
 * https://medium.com/@thejasonfile/dumb-components-and-smart-components-e7b33a698d43
 */
class ProviderPage extends Component {
    constructor (props) {
        super(props);
        this.submitProvider = this.submitProvider.bind(this);
    }

    submitProvider(values, formState) {
        console.log('submitProvider', values, formState);
        this.props.addProvider(values);
        this.props.history.replace('/providers')
    }

    render() {
        console.log('columns', providerColumns);
        const filterColumns = filter(providerColumns, c => c.value);
        console.log('filterColumns', filterColumns);

        return (
            <React.Fragment>
                <Modal title='Add New Provider' isOpen={this.props.location.pathname == '/providers/new'} onClose={this.props.history.goBack}>
                    <FormRenderer schema={providerForm.schema} uiSchema={providerForm.uiSchema} onSubmit={this.submitProvider} />
                </Modal>
                <PageHeader>
                    <PageHeaderTitle title='Providers'/>
                </PageHeader>
                <Section type='content'>
                    <Gallery>
                      <Card>
                        <CardHeader>Karta</CardHeader>
                        <CardBody><Donut withLegend identifier='orech' values={[['Red Hat', 100], ['Google', 10]]}/></CardBody>
                        <CardFooter>Footer</CardFooter>
                      </Card>

                      <Card>
                        <CardBody>
                          <p>5 Cloud</p>
                          <p>2 Virtual Infrastructure</p>
                          <p>1 Physical Infrastructure</p>
                        </CardBody>
                      </Card>

                      <Card>
                        <CardBody>
                          <p>1 Network</p>
                          <p>0 Storage</p>
                          <p>0 Automation</p>
                        </CardBody>
                      </Card>

                      <Card>
                          <CardBody>
                              <Section type='button-group'>
                                  <Link to='/providers/new'>
                                    <Button variant='primary'> Add New Provider </Button>
                                  </Link>
                              </Section>
                          </CardBody>
                      </Card>
                    </Gallery>

                    <EntityFilter columns={filterColumns}/>
                    <EntityListView columns={providerColumns}/>
                </Section>
            </React.Fragment>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return {
        addProvider: (formData) => dispatch(addProvider(formData)),
    }
}

const mapStateToProps = () => ({})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ProviderPage));
