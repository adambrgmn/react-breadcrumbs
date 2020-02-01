import { useContext, createContext } from 'react';
import invariant from 'invariant';

export function createNamedContext<V>(name: string, defaultValue: V) {
  const context = createContext(defaultValue);
  context.displayName = name;
  return context;
}

export function useSafeContext<T>(context: React.Context<T | void>): T {
  const value = useContext(context);
  invariant(
    value,
    `You can must wrap any components using ${context.displayName} inside a ${context.displayName}.Provider`,
  );
  return value;
}
