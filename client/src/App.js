import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import NavBar from './components/NavBar';
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
                        <NavBar status="logged_in" />
                        <Dashboard />
                    </Route>
                    <Route path="/search">
                        <NavBar status="logged_in" />
                        <Search />
                    </Route>
                    <Route path="/login">
                        <NavBar status="home" />
                        <Login />
                    </Route>
                    <Route path="/register">
                        <NavBar status="home" />
                        <Register />
                    </Route>
                    <Route path="/">
                        <NavBar status="home" />
                    </Route>
                </Switch>
            </div>
        </Router>
    );
}

export default App;
