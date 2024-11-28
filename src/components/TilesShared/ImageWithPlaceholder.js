import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { Loader } from '../SourcesTable/loaders';

const ImageWithPlaceholder = ({ src, width = 110, height = 40, ...rest }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <React.Fragment>
      {!loaded && <Loader height={`${height}px`} width={`${width}px`} {...rest} />}
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
  width: PropTypes.number,
  height: PropTypes.number,
};

export default ImageWithPlaceholder;
