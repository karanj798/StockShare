import React, { Component } from 'react';
import { TextField, Paper, Typography, Grid, InputAdornment, Button, Snackbar, Box, Modal, Backdrop, Fade, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Menu, MenuItem } from '@material-ui/core';
import { Search as SearchIcon } from '@material-ui/icons';
import { Alert } from '@material-ui/lab';
import { withStyles } from '@material-ui/core/styles';

import NavBar from './NavBar';

// Style for modal
const styles = (theme) => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
        outline: 0
    },
    table: {
        maxWidth: 650,
    },
});

/**
 * Search component which lets users search for stocks.
 */
class Search extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchQuery: '',
            searchResults: [],
            open: false,
            severity: 'warning',
            message: '',
            modal: false,
            type: '',
            qty: 0,
            selectedItem: '',
            progressValue: 'determinate',
            currentPrice: 0,
            anchorEl: null
        }

        this.handleEvent = this.handleEvent.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleModalClose = this.handleModalClose.bind(this);
        this.setQty = this.setQty.bind(this);
    }

    handleEvent(e) {
        // If enter key is received perform HTTP request to search stocks
        if (e.keyCode === 13) {
            fetch(`/api/stocks/info/symbol?q=${this.state.searchQuery}`)
                .then(res => res.json())
                .then(dat => this.setState({ searchResults: dat, progressValue: 'determinate' }))
            this.setState({ progressValue: 'indeterminate' })
        }
    }

    handleClick(e, item, type) {
        if (type === 'final') {
            // Handling Invalid Input
            if (parseInt(this.state.qty) <= 0) {
                this.setState({ modal: false, open:true, severity: 'error', message: 'Invalid input.', qty: 0 })
                return;
            }
            // Perform HTTP request to store transaction
            fetch(`/api/stocks/transactions/${this.state.type}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: localStorage.getItem('id'),
                    ticker: this.state.selectedItem.displaySymbol,
                    qty: this.state.qty,
                    price: this.state.currentPrice
                })
            })
                .then(res => res.json())
                .then(dat => {
                    this.setState({ modal: false, qty: 0, type: '', open: true })
                    if (dat.msg === 'succ') {
                        this.setState({ severity: 'success', message: `Transaction completed.` })
                    } else {
                        this.setState({ severity: 'error', message: 'Transaction failed.' })
                    }
                })

        } else if (type === 'menu') {
            // Open menu button
            this.setState({ selectedItem: item, anchorEl: e.currentTarget })
        } else {
            // Perform HTTP request to get stock price
            fetch(`/api/stocks/info/quote?q=${this.state.selectedItem.displaySymbol}`)
                .then(res => res.json())
                .then(dat => this.setState({ modal: true, type: type.includes('buy') ? 'buy' : 'sell', currentPrice: dat.c, anchorEl: null }))
        }
    }

    handleClose() {
        // Change state of Snackbar component
        this.setState({ open: false });
    }

    handleModalClose() {
        // Change state of Modal component
        this.setState({ modal: false, qty: 0 })
    }

    setQty(val) {
        // Set stock quantity based on user input
        this.setState({ qty: val })
    }

    handleMenuClose() {
        // Set anchor to null to hide it
        this.setState({ anchorEl: null })
    }

    render() {
        const { classes } = this.props;

        // JSX denoting this component
        return (
            <div>
                <NavBar status="logged_in" />
                <Grid style={{ padding: 16, margin: 'auto', maxWidth: 400 }}>
                    <Typography variant="h4" align="center" component="h1" gutterBottom>Search Stocks</Typography>
                    <Paper style={{ padding: 16, justifyContent: "center", display: "flex" }}>
                        <Grid item xs={12} style={{ justifyContent: "space-evenly", display: "flex", alignItems: 'baseline', marginBottom: 25 }}>
                            <TextField
                                label="Search"
                                type="text"
                                color="primary"
                                InputProps={{ endAdornment: <InputAdornment position="end"><SearchIcon htmlColor="gray" /></InputAdornment> }}
                                value={this.state.searchQuery}
                                onChange={e => this.setState({ searchQuery: e.target.value })}
                                onKeyDown={e => this.handleEvent(e)}
                            />
                        </Grid>
                    </Paper>
                </Grid>

                <Grid style={{ justifyContent: "space-evenly", display: "flex" }}>
                    <CircularProgress color="primary" variant={this.state.progressValue} />
                </Grid>

                {
                    this.state.searchResults.length !== 0 &&
                    <TableContainer className={classes.table} component={Paper} style={{ padding: 16, margin: 'auto' }}>
                        <Table className={classes.table}>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Company Name</TableCell>
                                    <TableCell align="right">Display Symbol</TableCell>
                                    <TableCell align="right">Ticker</TableCell>
                                    <TableCell align="right">Type</TableCell>
                                    <TableCell align="right">Selection</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {this.state.searchResults.map((row, id) => (
                                    <TableRow key={id}>
                                        <TableCell> {row.description} </TableCell>
                                        <TableCell align="right">{row.displaySymbol}</TableCell>
                                        <TableCell align="right">{row.symbol}</TableCell>
                                        <TableCell align="right">{row.type}</TableCell>
                                        <TableCell align="right">
                                            <Button id="Buy" variant="contained" color="primary" onClick={e => this.handleClick(e, row, 'menu')}>Open Menu</Button>
                                            <Menu
                                                id="simple-menu"
                                                anchorEl={this.state.anchorEl}
                                                keepMounted
                                                open={Boolean(this.state.anchorEl)}
                                                onClose={e => this.handleMenuClose()}
                                            >
                                                <MenuItem onClick={e => this.handleClick(e, null, 'buyModal')}>Buy</MenuItem>
                                                <MenuItem onClick={e => this.handleClick(e, null, 'sellModal')}>Sell</MenuItem>
                                            </Menu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                }
                <Snackbar
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                    open={this.state.open}
                    onClose={this.handleClose}
                    autoHideDuration={3500}>
                    <Alert elevation={6} variant="filled" severity={this.state.severity}>{this.state.message}</Alert>
                </Snackbar>

                <div>
                    <Modal
                        aria-labelledby="transition-modal-title"
                        aria-describedby="transition-modal-description"
                        className={classes.modal}
                        open={this.state.modal}
                        onClose={this.handleModalClose}
                        closeAfterTransition
                        BackdropComponent={Backdrop}
                        BackdropProps={{ timeout: 500 }}>
                        <Fade in={this.state.modal}>
                            <div className={classes.paper} justify="space-evenly" style={{ padding: 16, justifyContent: "center", display: "grid" }}>
                                <Typography variant="h6" align="center" component="h6" gutterBottom id="transition-modal-title">Current Price: ${this.state.currentPrice} </Typography>
                                <Typography variant="h6" align="center" component="h6" gutterBottom id="transition-modal-title">Enter Quantity: </Typography>
                                <TextField
                                    label="Quantity"
                                    type="number"
                                    variant="outlined"
                                    value={this.state.qty}
                                    onChange={e => this.setQty(e.target.value)}
                                />
                                <Box p={1} />
                                <Button variant="contained" color="primary" onClick={e => this.handleClick(e, this.state.item, 'final')}>{this.state.type === 'buy' ? 'Buy' : 'Sell'}</Button>
                            </div>
                        </Fade>
                    </Modal>
                </div>
            </div>
        );
    }
}
export default withStyles(styles)(Search);