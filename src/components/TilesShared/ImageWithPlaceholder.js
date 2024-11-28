import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { Loader } from '../SourcesTable/loaders';

const ImageWithPlaceholder = ({ src, width = '110px', height = '40px', ...rest }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <React.Fragment>
      {!loaded && <Loader height={height} width={width} {...rest} />}
      <img
        src={src}
        data-testid="ImageWithPlaceholder"
        onLoad={() => setLoaded(true)}
        style={{ display: loaded ? 'initial' : 'none' }}
        width={width}
        height={height}
        {...rest}
      />
    </React.Fragment>
  );
};

ImageWithPlaceholder.propTypes = {
  src: PropTypes.string.isRequired,
  width: PropTypes.string,
  height: PropTypes.string,
};

export default ImageWithPlaceholder;
