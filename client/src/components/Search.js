import React, { Component } from 'react';
import { TextField, Paper, Typography, Grid, InputAdornment, ListItem, ListItemText, List, Divider, Button, Snackbar, Box, Modal, Backdrop, Fade } from '@material-ui/core';
import { Search as SearchIcon } from '@material-ui/icons';
import { Alert } from '@material-ui/lab';
import { withStyles } from '@material-ui/core/styles';

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
});

/**
 * Search component which lets users search for stocks.
 */
class Search extends Component {
    constructor(props) {
        if (localStorage.getItem("_id") === null) window.location.replace(`${window.location.protocol + '//' + window.location.host}/login`);

        super(props);
        this.state = {
            searchQuery: '',
            searchResults: [],
            open: false,
            severity: '',
            message: '',
            modal: false,
            type: '',
            qty: 0,
            selectedItem: ''
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
                .then(dat => {
                    this.setState({ searchResults: dat })
                });
        }
    }

    handleClick(e, item, type) {
        // Exit function if state fields are empty
        if (this.state.searchResults === '') return;
        if (type === 'final') {
            // Perform HTTP request to store transaction
            fetch(`/api/stocks/transactions/${e.target.innerHTML === 'Buy ' ? 'buy' : 'sell'}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    _id: localStorage.getItem('_id'),
                    ticker: this.state.selectedItem.displaySymbol,
                    qty: this.state.qty
                })
            })
                .then(res => res.json())
                .then(dat => {
                    this.setState({modal: false, qty: 0, type: '', open: true})
                    if (dat.msg === 'succ') {
                        this.setState({severity: 'success', message: `Transaction completed.`})
                    } else {
                        this.setState({severity: 'error', message: 'Transaction failed.'})
                    }
                })
        } else {
            this.setState({ modal: true, type: type, selectedItem: item })
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

    render() {
        const { classes } = this.props;

        // JSX denoting this component
        return (
            <div>
                <Grid style={{ padding: 16, margin: 'auto', maxWidth: 400 }}>
                    <Typography variant="h4" align="center" component="h1" gutterBottom>Search Stocks</Typography>
                    <Paper style={{ padding: 16, justifyContent: "center", display: "flex" }}>
                        <Grid item xs={12} style={{ justifyContent: "space-evenly", display: "flex", alignItems: 'baseline', marginBottom: 25 }}>
                            <TextField
                                label="Search"
                                type="text"
                                InputProps={{ endAdornment: <InputAdornment position="end"><SearchIcon htmlColor="gray" /></InputAdornment> }}
                                value={this.state.searchQuery}
                                onChange={e => this.setState({ searchQuery: e.target.value })}
                                onKeyDown={e => this.handleEvent(e)}
                            />
                        </Grid>
                    </Paper>
                </Grid>


                <List>
                    {
                        this.state.searchResults.map((item, id) =>
                            <span key={id}>
                                <ListItem button key={id}>
                                    <ListItemText primary={item.description + ' @ ' + item.displaySymbol} />
                                    <Grid item xs={3}>
                                        <Grid container justify="space-evenly" spacing={2}>
                                            <Button id="Buy" variant="contained" color="primary" onClick={e => this.handleClick(e, item, 'buy')}>Buy</Button>
                                            <Button id="Sell" variant="contained" color="primary" onClick={e => this.handleClick(e, item, 'sell')}>Sell</Button>
                                        </Grid>
                                    </Grid>
                                </ListItem>
                                <Divider />
                            </span>
                        )
                    }
                </List>
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
                                <Typography variant="h6" align="center" component="h6" gutterBottom id="transition-modal-title">Enter Quantity: </Typography>
                                <TextField
                                    label="Quantity"
                                    type="number"
                                    variant="outlined"
                                    value={this.state.qty}
                                    onChange={e => this.setQty(e.target.value)}
                                />
                                <Box p={1} />
                                <Button id={this.state.type === 'buy' ? 'Buy' : 'Sell'} variant="contained" color="primary" onClick={e => this.handleClick(e, this.state.item, 'final')}>{this.state.type === 'buy' ? 'Buy' : 'Sell'} </Button>
                            </div>
                        </Fade>
                    </Modal>
                </div>
            </div>
        );
    }
}
export default withStyles(styles)(Search);