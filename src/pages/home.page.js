import React from "react";
import { withRouter } from "react-router-dom";
import {Container, Typography} from "@material-ui/core";

class HomePage extends React.Component {


    render() {
    const envTeste = process.env;
        return (
            <Container>
                <Typography variant="h2">LMS CLIENT</Typography>
                { JSON.stringify(envTeste) }
            </Container>
        );
    }
}

export default withRouter(HomePage);
