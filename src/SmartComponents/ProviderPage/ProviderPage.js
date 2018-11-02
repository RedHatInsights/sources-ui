import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect, withRouter } from 'react-router-dom';
import asyncComponent from '../../Utilities/asyncComponent';
import './provider-page.scss';
import filter from 'lodash/filter';
import { addProvider, createSource, addAlert, closeAlert, filterProviders } from '../../redux/actions/providers';

import { Donut, PageHeader, PageHeaderTitle, Section } from '@red-hat-insights/insights-frontend-components';
import {  FormRenderer } from '@red-hat-insights/insights-frontend-components/components/Forms';

import { Button, Grid, GridItem } from '@patternfly/react-core';
import { Alert, Card, CardHeader, CardBody, CardFooter, Gallery, Modal } from '@patternfly/react-core';

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
        this.onFilter = this.onFilter.bind(this);
    }

    submitProvider(values, formState) {
        console.log('submitProvider', values, formState);
        //this.props.addProvider(values);
        this.props.createSource(values).then(() => {
            this.props.addAlert('Source added', 'success');
            this.props.history.replace('/sources')
        }).catch(error => {
            console.debug('CATCH:'); console.debug(error);
            this.props.addAlert('Source adding failed', 'danger');
            this.props.history.replace('/sources')
        });
    }

    onFilter(filterColumn, filterValue) {
        console.log('onFilter', filterColumn, filterValue);
        this.props.filterProviders(filterColumn, filterValue);
    }

    render() {
        const filterColumns = filter(providerColumns, c => c.value);

        return (
            <React.Fragment>
                <Modal title='Add New Provider' isOpen={this.props.location.pathname == '/sources/new'} onClose={this.props.history.goBack}>
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
                                  <Link to='/sources/new'>
                                    <Button variant='primary'> Add a New Source </Button>
                                  </Link>
                              </Section>
                          </CardBody>
                      </Card>
                    </Gallery>

                    { this.props.alert && <Alert variant={this.props.alert.type} title={this.props.alert.message} action={<Button onClick={this.props.closeAlert} variant="secondary">Close</Button>}/> }

                    <EntityFilter columns={filterColumns} onFilter={this.onFilter}/>
                    <EntityListView columns={providerColumns}/>
                </Section>
            </React.Fragment>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return {
        addProvider: (formData) => dispatch(addProvider(formData)),
        createSource: (formData) => dispatch(createSource(formData)),

        filterProviders: (filterColumn, filterValue) => dispatch(filterProviders(filterColumn, filterValue)),
        addAlert: (message, type) => dispatch(addAlert(message, type)),
        closeAlert: () => dispatch(closeAlert()),
    }
}

const mapStateToProps = ({providers:{alert}}) => ({alert})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ProviderPage));
