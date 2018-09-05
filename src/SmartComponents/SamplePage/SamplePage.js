import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import asyncComponent from '../../Utilities/asyncComponent';
import './sample-page.scss';

import { Donut, PageHeader, PageHeaderTitle, Section } from '@red-hat-insights/insights-frontend-components';

import { Button, Grid, GridItem } from '@patternfly/react-core';
import { Card, CardHeader, CardBody, CardFooter, Gallery } from '@patternfly/react-core';

const SampleComponent = asyncComponent(() => import('../../PresentationalComponents/SampleComponent/sample-component'));
//const EntityListView = asyncComponent(() => import('../../PresentationalComponents/EntityListView/entity-list-view'));
import EntityListView from '../../PresentationalComponents/EntityListView/entity-list-view';

/**
 * A smart component that handles all the api calls and data needed by the dumb components.
 * Smart components are usually classes.
 *
 * https://reactjs.org/docs/components-and-props.html
 * https://medium.com/@thejasonfile/dumb-components-and-smart-components-e7b33a698d43
 */
class SamplePage extends Component {

    render() {
        return (
            <React.Fragment>
                <PageHeader>
                    <PageHeaderTitle title='Sample Insights App'/>
                </PageHeader>
                <Section type='content'>
                    <h1> Sample Component </h1>
                    <SampleComponent> Sample Component </SampleComponent>
                    <h1> Cards </h1>
                    <h1> Buttons </h1>
                    <Section type='button-group'>
                        <Button variant='primary'> PF-Next Primary Button </Button>
                        <Button variant='secondary'> PF-Next Secondary Button </Button>
                        <Button variant='tertiary'> PF-Next Tertiary Button </Button>
                        <Button variant='danger'> PF-Next Danger Button </Button>
                    </Section>

                    <Grid>
                      <GridItem span={4}>A</GridItem>
                      <GridItem span={4}>B</GridItem>
                      <GridItem span={4}>C</GridItem>
                      <GridItem span={12}>Table</GridItem>
                    </Grid>

                    <Gallery>
                      <Card>
                        <CardHeader>Karta</CardHeader>
                        <CardBody><Donut identifier='orech' values={[['Red Hat', 100], ['Google', 10]]}/></CardBody>
                        <CardFooter>Footer</CardFooter>
                      </Card>

                      <Card>
                        <CardHeader>Karta</CardHeader>
                        <CardBody>Telo</CardBody>
                        <CardFooter>Footer</CardFooter>
                      </Card>

                      <Card>
                        <CardHeader>Karta</CardHeader>
                        <CardBody>Telo</CardBody>
                        <CardFooter>Footer</CardFooter>
                      </Card>
                    </Gallery>

                </Section>

                <EntityListView />
            </React.Fragment>
        );
       /* Cards: (karty uz jsou nove)
        *  https://rawgit.com/patternfly/patternfly-react/gh-pages/index.html?knob-Match%20Height=true&selectedKind=patternfly-react%2FCards&selectedStory=Base%20Card%20w%2FHeightMatching&full=0&addons=1&stories=1&panelRight=0&addonPanel=storybook%2Fstories%2Fstories-panel
        */

       /* https://rawgit.com/patternfly/patternfly-react/gh-pages/index.html?selectedKind=patternfly-react%2FContent%20Views%2FList%20View&selectedStory=List%20of%20expandable%20items&full=0&addons=1&stories=1&panelRight=0&addonPanel=storybook%2Fstories%2Fstories-panel
        * <ListView>
        *   <ListView.Item>
        *     <Row>
        *       <Col>foobar</Col>
        *     </Row>
        *   </ListView.Item>
        * </ListView>
        */
    }
}

export default withRouter(SamplePage);
