import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { Loader } from '../SourcesTable/loaders';

const ImageWithPlaceholder = ({ src, ...rest }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <React.Fragment>
      {!loaded && <Loader height="40px" width="110px" {...rest} />}
      <img
        src={src}
        data-testid="ImageWithPlaceholder"
        onLoad={() => setLoaded(true)}
        style={{ display: loaded ? 'initial' : 'none' }}
        {...rest}
      />
    </React.Fragment>
  );
};

ImageWithPlaceholder.propTypes = {
  src: PropTypes.string.isRequired,
};

export default ImageWithPlaceholder;
