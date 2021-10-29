import Dashboard from './questions/dashboard';
import Questions from './questions/questionslist';

let routes = [
    { path: '/dashboard', exact: true, component: Dashboard, name: 'Dashboard' },
    { path: '/questions', exact: true, component: Questions, name: 'Questions' },
];
export default routes;
