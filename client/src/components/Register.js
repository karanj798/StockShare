import React, { Component } from 'react';
import { TextField, Paper, Typography, Button, Grid, Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';

/**
 * Register component which allows users to register in the application.
 */
class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            phone: '',
            open: false,
            severity: '',
            message: ''
        }
        this.handleClick = this.handleClick.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    handleClick() {
        // Exit function if state fields are empty
        if (this.state.username === '' || this.state.password === '' || this.state.phone === '') {
            this.setState({ open: true, severity: 'error', message: 'Invalid Signup Criteria' });
            return;
        }

        // Perform HTTP request send user signup data
        fetch(`/api/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(this.state)
        })
        .then(res => res.json())
        .then(dat => {
            console.log(dat)
            if (dat.status === true) {
                window.location.replace(`${window.location.protocol + '//' + window.location.host}/login`);
            } else {
                this.setState({ open: true, severity: 'error', message: 'Invalid Signup Criteria' });
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
                <Typography variant="h4" align="center" component="h1" gutterBottom>Register</Typography>
                <Paper style={{ padding: 16, justifyContent: "center", display: "flex" }}>
                    <form className="form" noValidate autoComplete="off">
                        <Grid>
                            <TextField label="Username" type="text" value={this.state.username} onChange={e => this.setState({ username: e.target.value })} required />
                        </Grid>
                        <Grid>
                            <TextField label="Phone" type="tel" value={this.state.phone} onChange={e => this.setState({ phone: e.target.value })} required />
                        </Grid>
                        <Grid>
                            <TextField label="Password" type="password" value={this.state.password} onChange={e => this.setState({ password: e.target.value })} required />
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

export default Register;