import '@testing-library/jest-dom';
import * as React from 'react';
import {
  render,
  fireEvent,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import { BreadcrumbsProvider, useBreadcrumb, useTrail } from '../src';

const ListBreadcrumbs = () => {
  const breadcrumbs = useTrail();
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

const Trail: React.FC<{ label: string }> = ({ label }) => {
  useBreadcrumb({ label, url: '' });
  return null;
};

const App = () => {
  const [expectedBreadcrumbs, setExpectedBreadcrumbs] = React.useState(0);
  return (
    <BreadcrumbsProvider>
      <button
        type="button"
        onClick={() => setExpectedBreadcrumbs(expectedBreadcrumbs + 1)}
      >
        Add crumb
      </button>
      <button
        type="button"
        onClick={() =>
          setExpectedBreadcrumbs(
            expectedBreadcrumbs > 0 ? expectedBreadcrumbs - 1 : 0,
          )
        }
      >
        Remove crumb
      </button>

      <ListBreadcrumbs />

      {Array.from({ length: expectedBreadcrumbs }).map((_, idx) => (
        <Trail key={idx} label={`Crumb ${idx + 1}`} />
      ))}
    </BreadcrumbsProvider>
  );
};

it('controls a list of breadcrumbs', async () => {
  const { findByText, getByText } = render(<App />);

  const addBtn = getByText('Add crumb');
  const removeBtn = getByText('Remove crumb');

  fireEvent.click(addBtn);
  expect(await findByText('Crumb 1')).toBeInTheDocument();

  fireEvent.click(addBtn);
  expect(await findByText('Crumb 2')).toBeInTheDocument();

  fireEvent.click(addBtn);
  expect(await findByText('Crumb 3')).toBeInTheDocument();

  fireEvent.click(removeBtn);
  await waitForElementToBeRemoved(() => getByText('Crumb 3'));

  fireEvent.click(removeBtn);
  await waitForElementToBeRemoved(() => getByText('Crumb 2'));

  fireEvent.click(removeBtn);
  await waitForElementToBeRemoved(() => getByText('Crumb 1'));
});

it('will throw an error if you try to render anything outside the provider', () => {
  const ErrorComponent = () => {
    const breadcrumbs = useTrail();
    return (
      <ul>
        {breadcrumbs.map(({ id, label }) => (
          <li key={id}>{label}</li>
        ))}
      </ul>
    );
  };

  const original = console.error;
  console.error = () => {};
  expect(() => render(<ErrorComponent />)).toThrow();

  console.error = original;
});
