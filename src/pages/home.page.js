import React from "react";
import { withRouter } from "react-router-dom";
import {Container, Typography} from "@material-ui/core";

class HomePage extends React.Component {

    render() {
        return (
            <Container>
                <Typography variant="h2">LMS CLIENT</Typography>
            </Container>
        );
    }
}

export default withRouter(HomePage);
