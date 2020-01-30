import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Link,
  Switch,
  Route,
  useParams,
  useRouteMatch,
} from 'react-router-dom';
import { BreadcrumbsProvider, useBreadcrumb, useBreadcrumbs } from '../.';

const sectionStyle = {
  width: 'auto',
  minWidth: '25vw',
};

const Day: React.FC = () => {
  const { day } = useParams<{ day: string }>();
  const { url } = useRouteMatch();
  useBreadcrumb({ label: day, url });

  return (
    <section style={sectionStyle}>
      <h2>Day: {day}</h2>
    </section>
  );
};

const Month: React.FC = () => {
  const { month } = useParams<{ month: string }>();
  const { path, url } = useRouteMatch();
  useBreadcrumb({ label: month, url });

  return (
    <React.Fragment>
      <section style={sectionStyle}>
        <h2>Month: {month}</h2>

        <p>Days</p>
        <ul>
          {Array.from({ length: 30 }).map((_, day) => (
            <li key={day}>
              <Link to={`${url}/${day + 1}`}>{day + 1}</Link>
            </li>
          ))}
        </ul>
      </section>

      <Switch>
        <Route path={`${path}/:day`}>
          <Day />
        </Route>
      </Switch>
    </React.Fragment>
  );
};

const Year: React.FC = () => {
  const { year } = useParams<{ year: string }>();
  const { path, url } = useRouteMatch();
  useBreadcrumb({ label: year, url });

  return (
    <React.Fragment>
      <section style={sectionStyle}>
        <h2>Year: {year}</h2>

        <p>Months</p>
        <ul>
          {Array.from({ length: 12 }).map((_, month) => (
            <li key={month}>
              <Link to={`${url}/${month + 1}`}>{month + 1}</Link>
            </li>
          ))}
        </ul>
      </section>

      <Switch>
        <Route path={`${path}/:month`}>
          <Month />
        </Route>
      </Switch>
    </React.Fragment>
  );
};

const Breadcrumbs = () => {
  const breadcrumbs = useBreadcrumbs();

  return (
    <div>
      <p style={{ fontSize: 24, fontWeight: 700 }}>
        Breadcrumbs:{' '}
        {breadcrumbs.map(({ label, url, id }, index) => (
          <span key={id}>
            <Link to={url}>{label}</Link>{' '}
            {index < breadcrumbs.length - 1 ? '> ' : ''}
          </span>
        ))}
      </p>
    </div>
  );
};

const App = () => {
  return (
    <div style={{ fontFamily: 'sans-serif' }}>
      <BreadcrumbsProvider>
        <Router>
          <Breadcrumbs />

          <div
            style={{
              display: 'flex',
              width: '100%',
              justifyContent: 'flex-start',
            }}
          >
            <section style={sectionStyle}>
              <h2>Home</h2>
              <ul>
                <li>
                  <Link to="/">Home</Link>
                </li>
                {['2020', '2021', '2022'].map(year => (
                  <li key={year}>
                    <Link to={`/${year}`}>{year}</Link>
                  </li>
                ))}
              </ul>
            </section>

            <Switch>
              <Route path="/:year">
                <Year />
              </Route>
            </Switch>
          </div>
        </Router>
      </BreadcrumbsProvider>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
