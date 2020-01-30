import * as React from 'react';
import { render } from '@testing-library/react';
import { BreadcrumbsProvider, useBreadcrumb, useBreadcrumbs } from '../src';

const ListBreadcrumbs = () => {
  const breadcrumbs = useBreadcrumbs();
  return (
    <ul>
      {breadcrumbs.map(crumb => (
        <li key={crumb.id} data-testid="breadcrumb">
          {crumb.label}
        </li>
      ))}
    </ul>
  );
};

const AddBreadcrumbs = () => {
  useBreadcrumb({ label: 'Crumb 1', url: '' });
  useBreadcrumb({ label: 'Crumb 2', url: '' });
  useBreadcrumb({ label: 'Crumb 3', url: '' });

  return null;
};

const App = () => {
  return (
    <BreadcrumbsProvider>
      <ListBreadcrumbs />
      <AddBreadcrumbs />
    </BreadcrumbsProvider>
  );
};

it('controls a list of breadcrumbs', async () => {
  const { findByText } = render(<App />);

  expect(await findByText('Crumb 1')).toBeInTheDocument();
  expect(await findByText('Crumb 2')).toBeInTheDocument();
  expect(await findByText('Crumb 3')).toBeInTheDocument();
});
