import React, { Component, Suspense, Fragment } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import * as router from "react-router-dom";
import { Container } from "reactstrap";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { ActionCreators } from "../../redux/actions";
import { RingLoader } from "react-spinners";
import { css } from "@emotion/core";
import Error from "../../views/Pages/Page500/Page500";
import {
  AppAside,
  AppFooter,
  AppHeader,
  AppSidebar,
  AppSidebarFooter,
  AppSidebarForm,
  AppSidebarHeader,
  AppSidebarMinimizer,
  AppBreadcrumb2 as AppBreadcrumb,
  AppSidebarNav2 as AppSidebarNav
} from "@coreui/react";
// sidebar nav config
import * as navigation from "../../_nav";
// routes config
import * as approutes from "../../routes";
import { tsThisType } from "@babel/types";

const DefaultAside = React.lazy(() => import("./Aside"));
const DefaultFooter = React.lazy(() => import("./Footer"));
const DefaultHeader = React.lazy(() => import("./Header"));

class DefaultLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isError: false,
      nav: null,
      routes: null
    };
  }

  componentDidMount() {
    // this.setNavLinksAndRoutes();
    if (!this.props.userSession.authenticated)
      this.props.history.push("/login");

  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.error != this.props.error) {
      this.setState({
        isError: this.props.error
      });
      this.props.spinnerAction(false);
    }
    if (prevProps.userRole != this.props.userRole) {
      console.log("Change in userRole", this.props.userRole)
      this.setNavLinksAndRoutes()
    }
  }
  loading = () => (
    <div className="animated fadeIn pt-1 text-center">Loading...</div>
  );

  signOut(e) {
    e.preventDefault();
    this.props.userlogout();
    this.props.history.push("/login");
  }

  setNavLinksAndRoutes = () => {
    let { roleName } = this.props.user;
    let { userRole } = this.props;
    let nav = null;
    let routes = null;    
    // if (roleName) {
    //   if (roleName[0] === "ROLE_USER") {
    //     nav = navigation.user_navs;
    //     routes = approutes.user_routes;
    //   } else if (roleName[0] === "ROLE_ADMIN") {
    //     nav = navigation.admin_navs;
    //     routes = approutes.admin_routes;
    //   }
    //   else if(roleName[0] === "ROLE_ASSOCIATE") {
    //     nav = navigation.associate_navs;
    //     routes = approutes.associate_routes;
    //   }
    //   this.setState({
    //     nav: nav,
    //     routes: routes
    //   });
    // } else {
    //   setTimeout(() => {
    //     this.setNavLinksAndRoutes();
    //   }, 100);
    // }
    if (userRole === "ROLE_USER") {
      nav = navigation.user_navs;
      routes = approutes.user_routes;
    } else if (userRole === "ROLE_ADMIN") {
      nav = navigation.admin_navs;
      routes = approutes.admin_routes;
    }
    else if (userRole === "ROLE_ASSOCIATE") {
      nav = navigation.associate_navs;
      routes = approutes.associate_routes;
    }
    this.setState({
      nav: nav,
      routes: routes
    });

  };

  render() {
    let { isError, nav, routes } = this.state;
    const override = css`
      display: block;
      margin: 0 auto;
      z-index: 1090;
    `;
    return (
      <Fragment>
        <div className="app">
          {this.props.isLoading && (
            <div className="loading">
              <RingLoader
                css={override}
                sizeUnit={"px"}
                size={150}
                className="loader"
                color={"#005ba1"}
                loading
              />
            </div>
          )}

          <AppHeader fixed>
            <Suspense fallback={this.loading()}>
              <DefaultHeader onLogout={e => this.signOut(e)} />
            </Suspense>
          </AppHeader>
          <div className="app-body">
            <AppSidebar fixed display="lg">
              <AppSidebarHeader />
              <AppSidebarForm />
              {nav && (
                <Suspense>
                  <AppSidebarNav
                    navConfig={nav}
                    {...this.props}
                    router={router}
                  />
                </Suspense>
              )}
              <AppSidebarFooter />
              <AppSidebarMinimizer />
            </AppSidebar>

            {routes && (
              <main className="main">
                <AppBreadcrumb appRoutes={routes} router={router} />
                <Container fluid>
                  {isError && <Error message={isError}></Error>}
                  <Suspense fallback={this.loading()}>
                    <Switch>
                      {this.props.userSession.authenticated ? (
                        routes.map((route, idx) => {
                          return route.component ? (
                            <Route
                              key={idx}
                              path={route.path}
                              exact={route.exact}
                              name={route.name}
                              render={props => <route.component {...props} />}
                            />
                          ) : null;
                        })
                      ) : (
                          <Redirect to="/login" />
                        )}
                      {/* <Redirect from="/" to="/404" /> */}
                    </Switch>
                  </Suspense>
                </Container>
              </main>
            )}

            <AppAside fixed>
              <Suspense fallback={this.loading()}>
                <DefaultAside />
              </Suspense>
            </AppAside>
          </div>
          <AppFooter>
            <Suspense fallback={this.loading()}>
              <DefaultFooter />
            </Suspense>
          </AppFooter>
        </div>
      </Fragment>
    );
  }
}

export const mapStateToProps = state => {
  return {
    isLoading: state.userReducer.isLoading,
    error: state.userReducer.error,
    userSession: state.session,
    user: state.session.user,
    userRole: state.userReducer.userRole
  };
};

export const mapDispatchToProps = dispatch => {
  return bindActionCreators(ActionCreators, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DefaultLayout);
