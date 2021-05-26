import React from "react";
import { withRouter } from "react-router-dom";
import {Box, Button, Container, Grid, TextField, Typography} from "@material-ui/core";
import AuthService from "../services/auth.service";

class RegisterModeratorPage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            fieldName: '',
            fieldUsername: '',
            fieldEmail: '',
            fieldPassword: '',
            roles: ["user", "moderator"],
        }
    }

    onChangeModalField = (event) => {
        const { target: { id, value } } = event;
        this.setState({[id]: value});
    }

    submitRegisterForm = async () => {
        const {
            fieldName,
            fieldUsername,
            fieldEmail,
            fieldPassword,
            roles,
        } = this.state;

        if (fieldName && fieldUsername && fieldEmail && fieldPassword && roles) {
            const data = {
                name: fieldName,
                username: fieldUsername,
                email: fieldEmail,
                password: fieldPassword,
                roles: roles,
            }
            const result = await AuthService.signup(data);
            if (result) {
                const { history } = this.props;
                history.push("/home");
            }
        }
    }

    renderRegisterForm = () => {
        const {
            fieldName,
            fieldUsername,
            fieldEmail,
            fieldPassword,
        } = this.state;

        return (
            <Grid style={{marginTop: 20, marginBottom: 20}} container spacing={3}>
                <Grid item xs={12}>
                    <Typography variant={"h2"}>
                        <Box fontWeight="fontWeightMedium">
                            CADASTRAR
                        </Box>
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="fieldName"
                        label="Nome"
                        fullWidth
                        value={ fieldName }
                        onChange={this.onChangeModalField}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
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
                        margin="dense"
                        id="fieldEmail"
                        label="E-mail"
                        fullWidth
                        value={ fieldEmail }
                        onChange={this.onChangeModalField}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
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
                    <Button onClick={this.submitRegisterForm}>Cadastrar</Button>
                </Grid>
            </Grid>
        )
    }

    render() {
        return (
            <Container>
                { this.renderRegisterForm() }
            </Container>
        );
    }
}

export default withRouter(RegisterModeratorPage);
