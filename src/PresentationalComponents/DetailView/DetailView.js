import React, { Component } from 'react';
import { Button } from '@patternfly/react-core';
import { Donut } from '@red-hat-insights/insights-frontend-components';

class DetailView extends Component {
    render() {
        return (
          <div>
              <Donut withLegend identifier='orech' values={[['Red Hat', 100], ['Google', 10]]}/>
              <dl>
                <dt>IP Address</dt><dd>192.168.2.1</dd>
                <dt>Location</dt><dd>Brn</dd>
                <dt>Status</dt><dd>Ready for Fredi</dd>
                <dt>Licence</dt><dd>Apache Licence 2.0</dd>
              </dl>
              <div>
                <Button variant='primary'>Tag</Button>
                <Button variant='primary'>Animal</Button>
                <Button variant='primary'>Foobar</Button>
                <Button variant='primary'>Another Tag</Button>
              </div>
          </div>
        )
    }
}

export default DetailView;
