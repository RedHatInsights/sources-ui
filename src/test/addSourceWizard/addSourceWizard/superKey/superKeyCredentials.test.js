import React from 'react';
import mount from '../../__mocks__/mount';

import sourceTypes from '../../helpers/sourceTypes';
import SuperKeyCredentials from '../../../../addSourceWizard/addSourceWizard/superKey/SuperKeyCredentials';
import SourcesFormRenderer from '../../../../utilities/SourcesFormRenderer';

describe('SuperKeyCredentials', () => {
  it('renders for amazon type', () => {
    const wrapper = mount(
      <SourcesFormRenderer
        onSubmit={jest.fn()}
        schema={{
          fields: [
            {
              component: 'description',
              name: 'desc',
              Content: SuperKeyCredentials,
              sourceTypes,
            },
          ],
        }}
        initialValues={{ source_type: 'amazon' }}
      />
    );

    expect(wrapper.find('.pf-c-form__label-text').map((g) => g.text())).toEqual(['Access key ID', 'Secret access key']);
  });
});
