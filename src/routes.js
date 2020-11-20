import React from 'react';




const Dashboard = React.lazy(() => import('./views/Dashboard/Dashboard'));
const Upcoming = React.lazy(() => import('./views/Upcoming/upcoming'));
const Past = React.lazy(() => import('./views/Past/past'));
const Schedule = React.lazy(() => import('./views/Schedule/schedule'));
const Search = React.lazy(() => import('./views/Search/search'));
const Profile = React.lazy(() => import('./views/Profile'));
const AdminDashboard = React.lazy(() => import('./views/Dashboard/AdminDashboard'));
const AssociateDashboard = React.lazy(() => import('./views/Associate'));
const InterviewDashboard = React.lazy(() => import('./views/Associate/interview'));
const ProxyComponent = React.lazy(() => import('./containers/Layout/ProxyComponent'));
const Clients =React.lazy(()=> import('./views/Pages/Admin/Clients'));
const Skills =React.lazy(()=> import('./views/Pages/Admin/Skills'));
const Users =React.lazy(()=> import('./views/Pages/Admin/Users'));
const ClientGroups = React.lazy(()=> import('./views/Pages/Admin/ClientGroups'));
const Graph =React.lazy(()=> import('./views/Dashboard/Graph'));
const questionReport =React.lazy(()=> import('./views/QuestionsReport/questionReport'));

export const user_routes = [
  { path: '/', exact: true, name: 'Home', component: ProxyComponent },
  { path: '/statistics', name: 'Statistics', component: Graph },
  // { path: '/dashboard', name: 'Statistics', component: Graph },
  { path: '/upcoming', name: 'Upcoming', component: Upcoming },
  { path: '/past', name: 'Past', component: Past },
  { path: '/schedule', name: 'Schedule', component: Schedule },
  { path: '/search', name: 'Search', component: Search },
  { path: '/user-profile', name: 'User Profile', component: Profile },
  { path: '/user-profile', name: 'User Profile', component: Profile },
  { path: '/all-interviews', name: 'All Interviews', component: Dashboard },
  { path: '/questionReport', name: 'Question Report', component: questionReport }
];

export const admin_routes = [
  { path: '/', exact: true, name: 'Home', component: ProxyComponent },
  { path: '/dashboard', exact: true, name: 'Dashboard', component: AdminDashboard},
  { path: '/admin/clients', exact: true, name: 'Clients', component: Clients },
  { path: '/admin/clientGroups', exact: true, name: 'ClientGroup', component: ClientGroups },
  { path: '/admin/skills', exact: true, name: 'Skills', component: Skills },
  { path: '/admin/users', exact: true, name: 'Users', component: Users },
  { path: '/user-profile', name: 'User Profile', component: Profile }
];

export const associate_routes = [
  { path: '/', exact: true, name: 'Associate Home', component: AssociateDashboard },
  { path: '/interview', name: 'Interview', component: InterviewDashboard },
  { path: '/user-profile', name: 'User Profile', component: Profile }
]
