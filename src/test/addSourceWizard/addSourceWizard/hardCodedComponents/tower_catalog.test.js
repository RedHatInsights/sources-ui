import React from 'react';
import mount from '../../__mocks__/mount';

import { Text } from '@patternfly/react-core/dist/esm/components/Text/Text';
import { TextContent } from '@patternfly/react-core/dist/esm/components/Text/TextContent';

import * as TowerCatalog from '../../../../components/addSourceWizard/hardcodedComponents/tower/catalog';

describe('Tower Catalog', () => {
  it('Auth description', () => {
    const wrapper = mount(<TowerCatalog.AuthDescription />);

    expect(wrapper.find(TextContent)).toHaveLength(1);
    expect(wrapper.find(Text)).toHaveLength(2);
  });

  it('Endpoint description', () => {
    const wrapper = mount(<TowerCatalog.EndpointDescription />);

    expect(wrapper.find(TextContent)).toHaveLength(1);
    expect(wrapper.find(Text)).toHaveLength(1);
  });

  it('AllFieldsRequired', () => {
    const wrapper = mount(<TowerCatalog.AllFieldAreRequired />);

    expect(wrapper.find(Text)).toHaveLength(1);
  });
});
