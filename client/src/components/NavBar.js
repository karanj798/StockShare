import React, { Component } from 'react';
import { AppBar, Toolbar, Button, Grid } from "@material-ui/core";

/**
 * Navbar component which contains the sitemap. 
 */
class NavBar extends Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        // Remove user session and redirect to login route
        localStorage.removeItem('_id');
        window.location.replace(`${window.location.protocol + '//' + window.location.host}/login`);
    }

    render() {
        // JSX denoting this component
        const { status } = this.props;
        return (
            <Grid>
                <AppBar position="static">
                    <Toolbar>
                        <Grid container justify="flex-start">
                            {
                                status === "logged_in" && 
                                <span>
                                    <Button component="button" color="inherit" href="/dashboard">Dashboard</Button>
                                    <Button component="button" color="inherit" href="/search">Search</Button>
                                </span>
                            }
                        </Grid>
                        <Grid container justify="flex-end">
                            {
                                status === "home" &&
                                <span>
                                    <Button component="button" color="inherit" href="/login">Login</Button>
                                    <Button component="button" color="inherit" href="/register">Register</Button>
                                </span>

                            }
                            {
                                status === "logged_in" &&
                                <Button component="button" color="inherit" onClick={this.handleClick}>Logout</Button>
                                
                            }
                        </Grid>
                    </Toolbar>
                </AppBar>
            </Grid>
        )
    }

}
export default NavBar;