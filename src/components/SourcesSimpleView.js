import PropTypes from 'prop-types';
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Table, TableHeader, TableBody, sortable } from '@patternfly/react-table';
import { TextContent, Text, TextVariants } from '@patternfly/react-core';
import { injectIntl } from 'react-intl';

import flatten from 'lodash/flatten';
import filter from 'lodash/filter';
import ContentLoader from 'react-content-loader';
import moment from 'moment';

import SourceExpandedView from './SourceExpandedView';
import { loadEntities, selectEntity, expandEntity, removeSource, sortEntities } from '../redux/actions/providers';
import { endpointToUrl } from '../SmartComponents/ProviderPage/providerForm';

const RowLoader = props => (
    <ContentLoader
        height={20}
        width={480}
        {...props}
    >
        <rect x="30" y="0" rx="3" ry="3" width="250" height="7" />
        <rect x="300" y="0" rx="3" ry="3" width="70" height="7" />
        <rect x="385" y="0" rx="3" ry="3" width="95" height="7" />
        <rect x="50" y="12" rx="3" ry="3" width="80" height="7" />
        <rect x="150" y="12" rx="3" ry="3" width="200" height="7" />
        <rect x="360" y="12" rx="3" ry="3" width="120" height="7" />
        <rect x="0" y="0" rx="0" ry="0" width="20" height="20" />
    </ContentLoader>
);

class SourcesSimpleView extends React.Component {
    constructor(props) {
        super(props);

        this.filteredColumns = filter(this.props.columns, c => c.title);

        this.headers = this.filteredColumns.map(col => ({
            title: col.title,
            transforms: [sortable]
        }));

        this.state = {
            sortBy: {}
        };
    }

    onItemSelect = (_event, key, checked) => this.props.selectEntity(key, checked);

    onSort = (_event, key, direction) => {
        this.props.sortEntities(this.filteredColumns[key].value, direction);
        this.setState({
            sortBy: {
                index: key,
                direction
            }
        });
    };

    /*
     * Uncomment to re-enable row expansion.
     * onCollapse = (_event, i, isOpen) => this.props.expandEntity(this.sourceIndexToId(i), isOpen);
     */

    sourceIndexToId = (i) => this.props.entities[i / 2].id;

    renderActions = () => (
        [
            {
                title: this.props.intl.formatMessage({
                    id: 'sources.edit',
                    defaultMessage: 'Edit'
                }),
                onClick: (_ev, i) => this.props.history.push(`/edit/${this.sourceIndexToId(i)}`)
            },
            {
                style: { color: 'var(--pf-global--danger-color--100)' },
                title: this.props.intl.formatMessage({
                    id: 'sources.delete',
                    defaultMessage: 'Delete'
                }),
                onClick: (_ev, i) => this.props.history.push(`/remove/${this.sourceIndexToId(i)}`)
            }
        ]
    );

    sourceIsOpenShift = source => this.sourceTypeMap.get(source.source_type_id) === 'openshift';
    formatURL = source => source.endpoints && source.endpoints[0] && endpointToUrl(source.endpoints[0]);

    applicationFormatter = apps => apps.map(a => this.appTypeMap.get(a.application_type_id)).join(', ');
    sourceTypeFormatter = sourceType => (this.sourceTypeMap.get(sourceType) || sourceType || '');
    dateFormatter = str => moment(new Date(Date.parse(str))).utc().format('DD MMM YYYY, hh:mm UTC');
    nameFormatter = (name, source) => (
        <TextContent>
            {name}
            <br key={`${source.id}-br`}/>
            <Text key={source.id} component={ TextVariants.small }>
                {this.sourceIsOpenShift(source) && this.formatURL(source)}
            </Text>
        </TextContent>
    )

    itemToCells = item =>
        this.filteredColumns.map(
            col => (col.formatter ?
                this[col.formatter](item[col.value], item) :
                item[col.value] || ''));

    render = () => {
        const { entities, loaded, sourceTypes, sourceTypesLoaded, appTypes } = this.props;
        const rowData = flatten(entities.map((item, index) => (
            [
                { // regular item
                    ...item,
                    isOpen: !!item.expanded,
                    cells: this.itemToCells(item)
                },
                { // expanded content
                    id: item.id + '_detail',
                    parent: index * 2,
                    cells: [
                        item.expanded ?
                            <React.Fragment key={`${item.id}_detail`}>
                                <SourceExpandedView source={item}/>
                            </React.Fragment> :
                            'collapsed content'
                    ]
                }
            ]
        )));

        this.sourceTypeMap = new Map(sourceTypes.map(t => [t.id, t.name]));
        this.appTypeMap = new Map(appTypes.map(t => [t.id, t.display_name]));

        if (loaded && sourceTypesLoaded) {
            return (
                <Table
                    gridBreakPoint='grid-lg'
                    aria-label={this.props.intl.formatMessage({
                        id: 'sources.list',
                        defaultMessage: 'List of Sources'
                    })}
                    onCollapse={this.onCollapse}
                    onSort={this.onSort}
                    sortBy={this.state.sortBy}
                    rows={rowData}
                    cells={this.headers}
                    actions={this.renderActions()}
                >
                    <TableHeader />
                    <TableBody />
                </Table>
            );
        }

        return (
            <table className="sources-placeholder-table pf-m-compact ins-entity-table">
                <tbody>
                    <tr><td><RowLoader /></td></tr>
                    <tr><td><RowLoader /></td></tr>
                </tbody>
            </table>
        );
    };
};

SourcesSimpleView.propTypes = {
    columns: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.string,
        title: PropTypes.string
    })).isRequired,

    loadEntities: PropTypes.func.isRequired,
    selectEntity: PropTypes.func.isRequired,
    expandEntity: PropTypes.func.isRequired,
    removeSource: PropTypes.func.isRequired,
    sortEntities: PropTypes.func.isRequired,

    entities: PropTypes.arrayOf(PropTypes.any),
    numberOfEntities: PropTypes.number.isRequired,
    loaded: PropTypes.bool.isRequired,
    sourceTypes: PropTypes.arrayOf(PropTypes.any),
    sourceTypesLoaded: PropTypes.bool.isRequired,
    appTypes: PropTypes.arrayOf(PropTypes.any),

    history: PropTypes.any.isRequired,

    intl: PropTypes.object.isRequired
};

SourcesSimpleView.defaultProps = {
    entities: [],
    numberOfEntities: 0,
    loaded: false,
    sourceTypesLoaded: false,
    sourceTypes: [],
    appTypes: []
};

const mapDispatchToProps = dispatch => bindActionCreators({
    loadEntities, selectEntity, expandEntity, sortEntities, removeSource }, dispatch);

const mapStateToProps = ({ providers: { entities, loaded, numberOfEntities, sourceTypes, sourceTypesLoaded, appTypes } }) =>
    ({ entities, loaded, numberOfEntities, sourceTypes, sourceTypesLoaded, appTypes });

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(withRouter(SourcesSimpleView)));

