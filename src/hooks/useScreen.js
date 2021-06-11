import { useEffect, useRef, useState } from 'react';

export const variants = ['xs', 'sm', 'md', 'lg', '2xl'];

export const getVariant = () => {
  const width = window.innerWidth;

  if (width <= 576) {
    return variants[0];
  }

  if (width <= 768) {
    return variants[1];
  }

  if (width <= 992) {
    return variants[2];
  }

  if (width <= 1200) {
    return variants[3];
  }

  return variants[4];
};

const useScreen = () => {
  const [variant, setVariant] = useState(() => getVariant());
  const prev = useRef(variant);

  useEffect(() => {
    function handleResize() {
      const newVariant = getVariant();
      if (newVariant !== prev.current) {
        prev.current = newVariant;
        setVariant(newVariant);
      }
    }

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return variant;
};

export default useScreen;
