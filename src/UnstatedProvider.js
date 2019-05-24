import React from 'react';
import { Provider } from 'unstated';

interface UnstatedProviderProps {
  initialState: Map<string, any>,
  children: React.ReactElement,
}

const UnstatedProvider = ({ initialState, children }: UnstatedProviderProps) => {
  let inject;
  if (initialState) {
    const values = Object.values(initialState);
    if (values.length) {
      inject = values;
    }
  }
  return <Provider inject={inject}>{children}</Provider>;
};

export default UnstatedProvider;
