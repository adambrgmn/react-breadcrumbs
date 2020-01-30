import { useContext } from 'react';

export function useSafeContext<T>(context: React.Context<T | void>): T {
  const value = useContext(context);
  if (!value) {
    throw new Error(
      `You can only use this hook within a ${context.displayName} provider`,
    );
  }

  return value;
}
