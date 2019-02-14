import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Donut, PageHeader, PageHeaderTitle, Pagination, Section } from '@red-hat-insights/insights-frontend-components';

import './provider-page.scss';
import filter from 'lodash/filter';
import { addProvider, createSource, filterProviders } from '../../redux/actions/providers';

import { Button } from '@patternfly/react-core';
import { Card, CardHeader, CardBody, CardFooter, Gallery, Modal } from '@patternfly/react-core';

import SourcesListView from '../../PresentationalComponents/SourcesListView/SourcesListView';
import SourcesFilter from '../../PresentationalComponents/SourcesListView/SourcesFilter';

import { providerColumns } from '../../SmartComponents/ProviderPage/providerColumns';
import { wizardForm } from './providerForm';
import SourcesFormRenderer from '../../Utilities/SourcesFormRenderer';

import { pageAndSize } from '../../redux/actions/providers';

/**
 * A smart component that handles all the api calls and data needed by the dumb components.
 * Smart components are usually classes.
 *
 * https://reactjs.org/docs/components-and-props.html
 * https://medium.com/@thejasonfile/dumb-components-and-smart-components-e7b33a698d43
 */
class ProviderPage extends Component {
    static propTypes = {
        addProvider: PropTypes.func.isRequired,
        createSource: PropTypes.func.isRequired,
        filterProviders: PropTypes.func.isRequired,
        pageAndSize: PropTypes.func.isRequired,

        numberOfEntities: PropTypes.number.isRequired,

        location: PropTypes.any.isRequired,
        history: PropTypes.any.isRequired
    };

    constructor (props) {
        super(props);

        this.state = {
            itemsPerPage: 10,
            onPage: 1
        };
    }

    submitProvider = (values, formState) => {
        console.log('submitProvider', values, formState);
        //this.props.addProvider(values);
        this.props.createSource(values).then(() => {
            //this.props.addAlert('Source added', 'success');
            this.props.history.replace('/');
        }).catch(error => {
            console.debug('CATCH:'); console.debug(error);
            //this.props.addAlert('Source adding failed', 'danger');
            this.props.history.replace('/');
        });
    }

    onFilter = (filterColumn, filterValue) => {
        console.log('onFilter', filterColumn, filterValue);
        this.props.filterProviders(filterColumn, filterValue);
    }

    onSetPage = (number) => {
        this.setState({
            onPage: number
        });
        this.props.pageAndSize(number, this.state.itemsPerPage);
    }

    onPerPageSelect = (count) => {
        this.setState({
            onPage: 1,
            itemsPerPage: count
        });
        this.props.pageAndSize(1, count);
    }

    render = () => {
        const filterColumns = filter(providerColumns, c => c.value);

        const form = wizardForm;

        return (
            <React.Fragment>
                <Modal
                    className='add-source'
                    isLarge title='Add New Provider'
                    isOpen={this.props.location.pathname === '/new'}
                    onClose={this.props.history.goBack}>

                    <SourcesFormRenderer
                        initialValues={form.initialValues}
                        schemaType={form.schemaType}
                        schema={form.schema}
                        uiSchema={form.uiSchema}
                        showFormControls={form.showFormControls}
                        onSubmit={this.submitProvider}
                    />
                </Modal>
                <PageHeader>
                    <PageHeaderTitle title='Providers'/>
                </PageHeader>
                <Section type='content'>
                    <Gallery>
                        <Card>
                            <CardHeader>Karta</CardHeader>
                            <CardBody>
                                <Donut withLegend identifier='orech' values={[['Red Hat', 100], ['Google', 10]]}/>
                            </CardBody>
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
                                    <Link to='/new'>
                                        <Button variant='primary'> Add a New Source </Button>
                                    </Link>
                                </Section>
                            </CardBody>
                        </Card>
                    </Gallery>

                    <Card>
                        <CardHeader>
                            <SourcesFilter columns={filterColumns} onFilter={this.onFilter}/>
                        </CardHeader>
                        <CardBody>
                            <SourcesListView columns={providerColumns}/>
                        </CardBody>
                        <CardFooter>
                            <Pagination
                                itemsPerPage={this.state.itemsPerPage}
                                page={this.state.onPage}
                                direction='up'
                                onSetPage={this.onSetPage}
                                onPerPageSelect={this.onPerPageSelect}
                                numberOfItems={this.props.numberOfEntities || 0}
                            />
                        </CardFooter>
                    </Card>
                </Section>
            </React.Fragment>
        );
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({ addProvider, createSource, filterProviders, pageAndSize }, dispatch);

const mapStateToProps = ({ providers: { numberOfEntities } }) => ({ numberOfEntities });

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ProviderPage));
