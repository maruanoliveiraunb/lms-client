import React from "react";
import { Snackbar } from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";

class Alert extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        const { open, msg, onClose, autoHideDuration, severity } = this.props;

        return (
            <Snackbar open={open} autoHideDuration={ autoHideDuration ? autoHideDuration : 6000 } onClose={onClose}>
                <MuiAlert elevation={6} variant="filled" severity={severity}>{ msg }</MuiAlert>
            </Snackbar>
        );
    }
}

export default Alert;
