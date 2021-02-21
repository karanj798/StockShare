import React, { Component } from 'react';
import { Typography, ListItemText, Snackbar, Button, Grid, Paper, Box } from '@material-ui/core';
import { Alert } from '@material-ui/lab';

/**
 * Dashboard component which displays the stocks that were bought and sold.
 */
class Dashboard extends Component {
    constructor(props) {
        if (localStorage.getItem("_id") === null) window.location.replace(`${window.location.protocol + '//' + window.location.host}/login`);
        super(props);
        this.state = {
            bought: [],
            sold: [],
            open: false,
            severity: '',
            message: ''
        }
        this.handleClose = this.handleClose.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    componentDidMount() {
        // Update states by fetching data when page is loaded first
        fetch(`/api/stocks/transactions/buy?_id=${localStorage.getItem('_id')}`)
            .then(res => res.json())
            .then(dat => this.setState({ 'bought': dat }));

        fetch(`/api/stocks/transactions/sell?_id=${localStorage.getItem('_id')}`)
            .then(res => res.json())
            .then(dat => this.setState({ 'sold': dat }));
    }

    handleClose() {
        // Change stateof Snackbar component
        this.setState({ open: false });
    }

    handleClick() {
        // Download CSV file
        fetch(`/api/csv/download?_id=${localStorage.getItem('_id')}`)
        .then(res => res.text())
        .then(data => {
            var hiddenElement = document.createElement('a');
            hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(data);
            hiddenElement.target = '_blank';
            hiddenElement.download = 'Transactions.csv';
            hiddenElement.click();
        })
    }

    render() {
        // JSX denoting this component
        return (
            <div>
                <Grid style={{ padding: 16, margin: 'auto', maxWidth: 400, justifyContent: "center" }}>
                    <Typography variant="h4" align="center" component="h1" gutterBottom>Stocks Bought</Typography>
                    <Paper style={{ padding: 16, justifyContent: "center", display: "block" }}>

                        {this.state.bought.length === 0 && <Typography variant="h5" align="center" component="h4" gutterBottom>No Stocks Bought</Typography>}
                        {
                            this.state.bought.map((item, id) =>
                                <span key={id}>
                                    <ListItemText primary={Object.keys(item)[0] + ' x' + Object.values(item)[0]} />
                                </span>
                            )
                        }
                    </Paper>
                    <Box p={1} />
                    <Typography variant="h4" align="center" component="h1" gutterBottom>Stocks Sold</Typography>
                    <Paper style={{ padding: 16, justifyContent: "center", display: "block" }}>

                        {this.state.sold.length === 0 && <Typography variant="h5" align="center" component="h4" gutterBottom>No Stocks Sold</Typography>}
                        {
                            this.state.sold.map((item, id) =>
                                <span key={id}>
                                    <ListItemText primary={Object.keys(item)[0] + ' x' + Object.values(item)[0]} />
                                </span>
                            )
                        }
                    </Paper>
                    <Box p={1} />
                    <Grid container style={{ margin: 'auto', justifyContent: "center" }}>
                    <Button id="exportToCsv" variant="contained" color="primary" onClick={e => this.handleClick()}>Export to CSV</Button>
                    </Grid>
                </Grid>

                <Snackbar
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                    open={this.state.open}
                    onClose={this.handleClose}
                    autoHideDuration={3500}>
                    <Alert elevation={6} variant="filled" severity={this.state.severity}>{this.state.message}</Alert>
                </Snackbar>
            </div>
        );
    }
}

export default Dashboard;
