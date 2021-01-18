import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import { Dashboard, SignUp, Login } from './pages';
import { AuthProvider } from './context/auth';
import { ROUTES } from './utils/constants';

function App(): React.ReactElement {
  return (
    <Router>
      <AuthProvider>
        <Switch>
          <Route path={ROUTES.SIGNUP} component={SignUp} exact />
          <Route path={ROUTES.LOGIN} component={Login} exact />
          <Route path={ROUTES.DASHBOARD} component={Dashboard} exact />
        </Switch>
      </AuthProvider>
    </Router>
  );
}

export default App;
