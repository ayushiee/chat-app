import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import { Dashboard, SignUp, Login } from './pages';
import { AuthProvider } from './context/auth';
import { ROUTES } from './utils/constants';
import { PrivateRoute, PublicRoute } from './components';

function App(): React.ReactElement {
  return (
    <Router>
      <AuthProvider>
        <Switch>
          <PublicRoute path={[ROUTES.SIGNUP, ROUTES.HOME]} component={SignUp} exact />
          <PublicRoute restricted path={ROUTES.LOGIN} component={Login} exact />
          <PrivateRoute path={ROUTES.DASHBOARD} component={Dashboard} exact />
        </Switch>
      </AuthProvider>
    </Router>
  );
}

export default App;
