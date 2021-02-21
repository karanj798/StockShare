import React, { Component } from 'react';
import { TextField, Paper, Typography, Button, Grid, Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';

/**
 * Login component which allows user to login to application. 
 */
class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            open: false,
            severity: '',
            message: ''
        }
        this.handleClick = this.handleClick.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    handleClick() {
        // Exit function if state fields are empty
        if (this.state.username === '' || this.state.password === '') {
            this.setState({ open: true, severity: 'error', message: 'Invalid Login' });
            return;
        }

        // Perform HTTP request send user login
        fetch(`/api/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(this.state)
        })
        .then(res => res.json())
        .then(dat => {
            if (dat.status === 'good') {
                localStorage.setItem('_id', dat['_id']);
                window.location.replace(`${window.location.protocol + '//' + window.location.host}/dashboard`);
            } else {
                this.setState({ open: true, severity: 'error', message: 'Invalid Login' });
            }
        });
    }

    handleClose() {
        this.setState({ open: false });
    }

    render() {
        // JSX denoting this component
        return (
            <Grid style={{ padding: 16, margin: 'auto', maxWidth: 400 }}>
                <Typography variant="h4" align="center" component="h1" gutterBottom>Login</Typography>
                <Paper style={{ padding: 16, justifyContent: "center", display: "flex" }}>
                    <form className="form" noValidate autoComplete="off">
                        <Grid item xs={12}>
                            <TextField label="Username" type="text" value={this.state.username} onChange={e => this.setState({ username: e.target.value })} />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField label="Password" type="password" value={this.state.password} onChange={e => this.setState({ password: e.target.value })} />
                        </Grid>
                        <Grid item style={{ marginTop: 16 }}>
                            <Grid style={{ justifyContent: "center", display: "flex" }}>
                                <Button variant="contained" color="primary" onClick={this.handleClick}>Submit</Button>
                            </Grid>
                        </Grid>
                    </form>
                </Paper>
                <Snackbar
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    open={this.state.open}
                    onClose={this.handleClose}
                    autoHideDuration={3500}>
                    <Alert elevation={6} variant="filled" severity={this.state.severity}>{this.state.message}</Alert>
                </Snackbar>
            </Grid>
        );
    }
}

export default Login;