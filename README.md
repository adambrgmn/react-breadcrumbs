# React Breadcrumbs

A small library to manage breadcrumbs in a React app.

## Installation

```sh
npm i @fransvilhelm/react-breadcrumbs
# or
yarn add @fransvilhelm/react-breadcrumbs
```

## Usage

The way this works is that you place a crumb in every place along the trail you
are walking. This is especially powerful in apps that uses sub routes with for
example `react-router-dom` or `@reach/router`.

In every component that should leave a trail:

```jsx
import React from 'react';
import { useParams, useRouteMatch } from 'react-router-dom';
import { useBreadcrumb } from '@fransvilhelm/react-breadcrumbs';

export const Page = () => {
  const { label } = useParams();
  const { url } = useRouteMatch();
  useBreadcrumb({ label, url });

  return <div>{label}</div>;
};
```

And then anywhere else:

```jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useTrail } from '@frasnvilhelm/react-breadcrumbs';

export const Breadcrumbs = () => {
  const trail = useTrail();

  return (
    <ul>
      {trail.map(({ label, url, id }) => (
        <li key={id}>
          <Link to={url}>{label}</Link>
        </li>
      ))}
    </ul>
  );
};
```

And last but not least, wrap it all in `BreadcrumbsProvider`:

```jsx
import React from 'react';
import { BreadcrumbsProvider } from '@fransvilhel/react-breadcrumbs';

export const App = () => {
  return (
    <BreadcrumbsProvider>
      <Breadcrumbs />
      <Page />
    </BreadcrumbsProvider>
  );
};
```
