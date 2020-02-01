import { useContext, createContext } from 'react';

export function createNamedContext<V>(name: string, defaultValue: V) {
  const context = createContext(defaultValue);
  context.displayName = name;
  return context;
}

export function useSafeContext<T>(context: React.Context<T | void>): T {
  const value = useContext(context);
  if (!value) {
    throw new Error(
      `You can only use this hook within a ${context.displayName} provider`,
    );
  }

  return value;
}
