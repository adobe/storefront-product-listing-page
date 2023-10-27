/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import { createContext, FunctionComponent, useContext } from 'preact/compat';
import { useEffect, useState } from 'preact/hooks';

import { PRODUCT_COLUMNS } from '../utils/constants';

interface DisplayChange {
  mobile: boolean;
  tablet: boolean;
  desktop: boolean;
  columns: number;
}

interface DisplayChangeContext {
  screenSize: DisplayChange | null;
}

const DefaultScreenSizeObject: DisplayChange = {
  mobile: false,
  tablet: false,
  desktop: false,
  columns: PRODUCT_COLUMNS.desktop,
};

const useSensor = () => {
  const { screenSize } = useContext(ResizeChangeContext);

  const [result, setResult] = useState(DefaultScreenSizeObject);

  useEffect(() => {
    const size = screenSize ? screenSize : DefaultScreenSizeObject;
    setResult(size);
  }, [screenSize]);

  return { screenSize: result };
};

export const ResizeChangeContext = createContext({} as DisplayChangeContext);

const getColumn = (screenSize: DisplayChange): number => {
  if (screenSize.desktop) {
    return PRODUCT_COLUMNS.desktop;
  }
  if (screenSize.tablet) {
    return PRODUCT_COLUMNS.tablet;
  }
  if (screenSize.mobile) {
    return PRODUCT_COLUMNS.mobile;
  }
  // Fallback just incase
  return PRODUCT_COLUMNS.desktop;
};

const Resize: FunctionComponent = ({ children }) => {
  const detectDevice = () => {
    const result = DefaultScreenSizeObject;

    result.mobile = window.matchMedia('screen and (max-width: 767px)').matches;
    result.tablet = window.matchMedia(
      'screen and (min-width: 768px) and (max-width: 960px)'
    ).matches;
    result.desktop = window.matchMedia('screen and (min-width: 961px)').matches;
    result.columns = getColumn(result);
    return result;
  };

  const [screenSize, setScreenSize] = useState(detectDevice());
  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  });

  const handleResize = () => {
    setScreenSize({ ...screenSize, ...detectDevice() });
  };

  return (
    <ResizeChangeContext.Provider value={{ screenSize }}>
      {children}
    </ResizeChangeContext.Provider>
  );
};

export default Resize;

export { useSensor };
