import React from 'react';
import { Provider } from 'unstated';

interface UnstatedProviderProps {
  initialState: Map<string, any>,
  children: React.ReactElement,
}

const UnstatedProvider = ({ initialState, children }: UnstatedProviderProps) => {
  const injected = [];
  injected.push(...Object.values(initialState));
  return <Provider inject={injected}>{children}</Provider>;
};

export default UnstatedProvider;
