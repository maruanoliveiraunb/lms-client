import React from "react";
import { withRouter } from "react-router-dom";
import {Box, Button, Container, Grid, TextField, Typography} from "@material-ui/core";
import {AddBox} from "@material-ui/icons";
import AuthService from "../services/auth.service";

class LoginPage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            fieldUsername: '',
            fieldPassword: '',
        }
    }

    onChangeModalField = (event) => {
        const { target: { id, value } } = event;
        this.setState({[id]: value});
    }

    submitLogin = async () => {
        const { fieldUsername, fieldPassword } = this.state;

        if (fieldUsername && fieldPassword) {
            const data = {
                username: fieldUsername,
                password: fieldPassword,
            }
            const result = await AuthService.signin(data);
            if (result) {
                const { history } = this.props;
                history.push("/contexts");
            }
        }
    }

    renderLoginForm = () => {
        const { fieldUsername, fieldPassword } = this.state;

        return (
            <Grid style={{marginTop: 20, marginBottom: 20}} container spacing={3}>
                <Grid item xs={12}>
                    <Typography variant={"h2"}>
                        <Box fontWeight="fontWeightMedium">
                            LOGIN
                        </Box>
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="fieldUsername"
                        label="Usuário"
                        fullWidth
                        value={ fieldUsername }
                        onChange={this.onChangeModalField}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="fieldPassword"
                        label="Senha"
                        fullWidth
                        type="password"
                        value={ fieldPassword }
                        onChange={this.onChangeModalField}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Button onClick={this.submitLogin}>Entrar</Button>
                </Grid>
            </Grid>
        )
    }

    render() {
        return (
            <Container>
                { this.renderLoginForm() }
            </Container>
        );
    }
}

export default withRouter(LoginPage);
