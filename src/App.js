import React, { Component } from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
// import { renderRoutes } from 'react-router-config';
import './App.scss';

const loading = () => <div className="animated fadeIn pt-3 text-center">Loading...</div>;

// Containers 
const AppLayout = React.lazy(() => import('./containers/Layout'));

// Pages
const Login = React.lazy(() => import('./views/Pages/Login/Login'));
const Register = React.lazy(() => import('./views/Pages/Register/Register'));
const ConfirmRegistration = React.lazy(() => import('./views/Pages/Register/ConfirmRegistration'));
const Page404 = React.lazy(() => import('./views/Pages/Page404/Page404'));
const Page500 = React.lazy(() => import('./views/Pages/Page500/Page500'));
const ForgetPassword = React.lazy(()=>import('./views/Pages/ForgetPassword/ForgetPassword'));
const ResetPassword = React.lazy(()=>import('./views/Pages/ForgetPassword/ResetPassword'));
class App extends Component {

  render() {
    return (
      <HashRouter>
        <React.Suspense fallback={loading()}>
          <Switch>
            <Route exact path="/login" name="Login Page" render={props => <Login {...props} />} /> 
            <Route exact path="/forgetpassword" name="ForgetPassword" render={props => <ForgetPassword {...props} />} />                    
            <Route exact path="/register" name="Register Page" render={props => <Register {...props} />} />
            <Route exact path="/confirm-registration/:token" name="Confirm Registration Page" render={props => <ConfirmRegistration {...props} />} />
            <Route exact path="/404" name="Page 404" render={props => <Page404 {...props} />} />
            <Route exact path="/500" name="Page 500" render={props => <Page500 {...props} />} />
            <Route exact path="/resetpassword" name="ResetPassword" render={props => <ResetPassword {...props} />} />
            <Route path="/" name="Home" render={props => <AppLayout {...props} />} />
            <Route component={404} />
          </Switch>
        </React.Suspense>
      </HashRouter>
    );
  }
}

export default App;

