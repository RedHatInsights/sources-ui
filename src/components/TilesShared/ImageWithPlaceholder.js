import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

import { Loader } from '../SourcesTable/loaders';

const ImageWithPlaceholder = ({ src, width = '110px', height = '40px', ...rest }) => {
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    // Check if image is already loaded (cached)
    if (imgRef.current && imgRef.current.complete && imgRef.current.naturalHeight !== 0) {
      setLoaded(true);
    }

    // Fallback timeout for cases where onLoad doesn't fire
    const fallbackTimer = setTimeout(() => {
      setLoaded(true);
    }, 3000);

    return () => clearTimeout(fallbackTimer);
  }, [src]);

  const handleLoad = () => {
    setLoaded(true);
  };

  const handleError = () => {
    // Show image even if there's an error to prevent permanent loading state
    setLoaded(true);
  };

  return (
    <React.Fragment>
      {!loaded && <Loader height={height} width={width} {...rest} />}
      <img
        ref={imgRef}
        src={src}
        data-testid="ImageWithPlaceholder"
        onLoad={handleLoad}
        onError={handleError}
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
