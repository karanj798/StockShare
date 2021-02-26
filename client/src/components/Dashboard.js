import React, { Component } from 'react';
import { Typography, Snackbar, Button, Grid, Paper, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { withStyles } from '@material-ui/core/styles';

import NavBar from './NavBar';

// Style for modal
const styles = (theme) => ({
    table: {
        maxWidth: 650,
    },
});


/**
 * Dashboard component which displays the stocks that were bought and sold.
 */
class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bought: [],
            sold: [],
            open: false,
            severity: 'warning',
            message: ''
        }
        this.handleClose = this.handleClose.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    componentDidMount() {
        // Update states by fetching data when page is loaded first
        fetch(`/api/stocks/transactions/buy?id=${localStorage.getItem('id')}`)
            .then(res => res.json())
            .then(dat => this.setState({ 'bought': dat }));

        fetch(`/api/stocks/transactions/sell?id=${localStorage.getItem('id')}`)
            .then(res => res.json())
            .then(dat => this.setState({ 'sold': dat }));
    }

    handleClose() {
        // Change stateof Snackbar component
        this.setState({ open: false });
    }

    handleClick() {
        // Download CSV file
        fetch(`/api/csv/download?id=${localStorage.getItem('id')}`)
            .then(res => res.text())
            .then(data => {
                let hiddenElement = document.createElement('a');
                hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(data);
                hiddenElement.target = '_blank';
                hiddenElement.download = 'Transactions.csv';
                hiddenElement.click();
            })
    }

    render() {
        const { classes } = this.props;

        // JSX denoting this component
        return (
            <div>
                <NavBar status="logged_in" />
                <Grid style={{ padding: 16, margin: 'auto', justifyContent: "center" }}>
                    <Typography variant="h4" align="center" component="h1" gutterBottom>Stocks Bought</Typography>
                    {
                        this.state.bought.length !== 0 &&
                        <TableContainer className={classes.table} component={Paper} style={{ padding: 16, margin: 'auto' }}>
                            <Table className={classes.table}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Ticker</TableCell>
                                        <TableCell align="right">Price</TableCell>
                                        <TableCell align="right">Quantity</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {this.state.bought.map((row, id) => (
                                        <TableRow key={id}>
                                            <TableCell>{row.ticker}</TableCell>
                                            <TableCell align="right">{row.price}</TableCell>
                                            <TableCell align="right">{row.qty}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    }
                    <Box p={1} />
                    <Typography variant="h4" align="center" component="h1" gutterBottom>Stocks Sold</Typography>
                    {
                        this.state.sold.length !== 0 &&
                        <TableContainer className={classes.table} component={Paper} style={{ padding: 16, margin: 'auto' }}>
                            <Table className={classes.table}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Ticker</TableCell>
                                        <TableCell align="right">Price</TableCell>
                                        <TableCell align="right">Quantity</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {this.state.sold.map((row, id) => (
                                        <TableRow key={id}>
                                            <TableCell>{row.ticker}</TableCell>
                                            <TableCell align="right">{row.price}</TableCell>
                                            <TableCell align="right">{row.qty}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    }
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

export default withStyles(styles)(Dashboard);
