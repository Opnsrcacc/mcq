import './App.css';
import Login from './modules/user/login';
import Register from './modules/user/register';
import routes from './modules/routes';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import Sidebar from './modules/sidebar';
import Header from './modules/header';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
	return (
		<div className="App">
			<ToastContainer autoClose={2000} closeOnClick={true} />
			<Router basename='/user' >
				<Route path='/login' component={Login} exact={true} />
				<Route path='/register' component={Register} exact={true} />
				{
					localStorage.getItem('userAuthToken') ?
						<>
							<Route key='header' component={Header} />
							<Route key='sidebar' component={Sidebar} />
							<Switch>
								{
									routes.map((item, index) => {
										return (
											<Route key={index} path={item.path} component={item.component} exact={item.exact} ></Route>
										)
									})
								}
							</Switch>
						</>
						:
						<Redirect to='/login' />
				}
			</Router>
		</div>
	);
}

export default App;
