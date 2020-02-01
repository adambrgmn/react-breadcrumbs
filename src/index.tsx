import * as React from 'react';
import { debounce } from 'lodash';
import nanoid from 'nanoid';
import { createNamedContext, useSafeContext } from './utils';

export interface BreadcrumbItem {
  id: string;
  label: React.ReactNode;
  url: string;
}

interface BreadcrumbsContextType {
  breadcrumbs: BreadcrumbItem[];
  addBreadcrumb: (crumb: BreadcrumbItem) => void;
  removeBreadcrumb: (crumb: BreadcrumbItem) => void;
}

const BreadcrumbsContext = createNamedContext<BreadcrumbsContextType | void>(
  'BreadcrumbsContext',
  undefined,
);

export const BreadcrumbsProvider: React.FC = ({ children }) => {
  const [breadcrumbs, setBreadcrumbs] = React.useState<BreadcrumbItem[]>([]);
  const proxy = React.useRef<BreadcrumbItem[]>([]);

  const forceDebouncedUpdate = React.useMemo(
    () => debounce(() => setBreadcrumbs([...proxy.current])),
    [],
  );

  const addBreadcrumb = React.useCallback(
    (breadcrumb: BreadcrumbItem) => {
      const exists = proxy.current.includes(breadcrumb);
      if (!exists) {
        proxy.current.push(breadcrumb);
        forceDebouncedUpdate();
      }
    },
    [forceDebouncedUpdate],
  );

  const removeBreadcrumb = React.useCallback(
    (breadcrumb: BreadcrumbItem) => {
      const idx = proxy.current.findIndex(crumb => crumb === breadcrumb);
      proxy.current.splice(idx, 1);
      forceDebouncedUpdate();
    },
    [forceDebouncedUpdate],
  );

  const context = React.useMemo(
    () => ({
      breadcrumbs,
      addBreadcrumb,
      removeBreadcrumb,
    }),
    [breadcrumbs, addBreadcrumb, removeBreadcrumb],
  );

  React.useEffect(() => () => forceDebouncedUpdate.cancel(), [
    forceDebouncedUpdate,
  ]);

  return (
    <BreadcrumbsContext.Provider value={context}>
      {children}
    </BreadcrumbsContext.Provider>
  );
};

export const useBreadcrumb = ({ label, url }: Omit<BreadcrumbItem, 'id'>) => {
  const { addBreadcrumb, removeBreadcrumb } = useSafeContext(
    BreadcrumbsContext,
  );
  const crumb = React.useMemo(() => ({ label, url, id: nanoid() }), [
    label,
    url,
  ]);

  addBreadcrumb(crumb);
  React.useEffect(() => {
    return () => removeBreadcrumb(crumb);
  }, [addBreadcrumb, removeBreadcrumb, crumb]);
};

export const useTrail = (): BreadcrumbItem[] => {
  return useSafeContext(BreadcrumbsContext).breadcrumbs;
};
