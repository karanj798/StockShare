import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";

import Login from './components/Login';
import Register from './components/Register';
import Dashboard from "./components/Dashboard";
import Search from "./components/Search";

import './App.css';

/**
 * Main function of the Frontend app
 */
function App() {
    return (
        <Router>
            <div>
                <Switch>
                    <Route path="/dashboard">
                        {
                            localStorage.getItem("id") === null ? <Redirect to="/login" /> : <Dashboard />
                        }
                    </Route>
                    <Route path="/search">
                        {
                            localStorage.getItem("id") === null ? <Redirect to="/login" /> : <Search />
                        }
                    </Route>
                    <Route path="/login">
                        <Login />
                    </Route>
                    <Route path="/register">
                        <Register />
                    </Route>
                    <Route path="/">
                        <Redirect to="/login" />
                    </Route>
                </Switch>
            </div>
        </Router>
    );
}

export default App;
