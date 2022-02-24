// import './db/analytics-dashboard-db-1';
// import './db/analytics-dashboard-db';
import './db/auth-db';
import './db/e-commerce-db';
import './db/search-db';
import history from '@history';

if (module?.hot?.status() === 'apply') {
  const { pathname } = history.location;
  history.push('/loading');
  history.push({ pathname });
}
