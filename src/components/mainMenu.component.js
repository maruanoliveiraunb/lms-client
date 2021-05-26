import React from "react";
import {Link, withRouter} from "react-router-dom";
import {Typography, AppBar, Toolbar, IconButton, Button, Menu, MenuItem} from "@material-ui/core";
import MenuIcon from '@material-ui/icons/Menu';
import StorageUtils from "../utils/storage.utils";
import RolesUtils from "../utils/roles.utils";

class MainMenu extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            anchorEl: null,
        }
    }

    isLogged = () => {
        const userData = StorageUtils.getUserData();
        return !!userData;
    }

    isAdmin = () => {
        return RolesUtils.hasAdminRole();
    }

    handleClick = (event) => {
        this.setState({ anchorEl: event.currentTarget });
    };

    handleClose = () => {
        this.setState({ anchorEl: null });
    };

    logout = () => {
        StorageUtils.removeUserData();
        StorageUtils.removeAccessToken();
        window.location = "/login";
    }

    renderUserMenu = () => {

        return (
            <>
                <MenuItem component={Link} to="/home">Home</MenuItem>
                <MenuItem component={Link} to="/contexts">Cursos</MenuItem>
            </>
        )
    }

    renderAdminMenu = () => {

        return (
            <>
                <MenuItem component={Link} to="/home">Home</MenuItem>
                <MenuItem component={Link} to="/contexts">Cursos</MenuItem>
                <MenuItem component={Link} to="/register-moderator">Novo Moderador</MenuItem>
            </>
        )
    }

    render() {
        const { anchorEl } = this.state;
        const isLogged = this.isLogged();

        return (
            <div style={{flexGrow: 1}}>
                <AppBar position="static">
                    <Toolbar>
                        {
                            isLogged &&
                                <>
                                    <IconButton edge="start" style={{marginRight: 10}} color="inherit" aria-label="menu" onClick={this.handleClick}>
                                        <MenuIcon />
                                    </IconButton>
                                    <Typography variant="h6" style={{flexGrow: 1}}>
                                        Menu
                                    </Typography>
                                    <Menu
                                        id="simple-menu"
                                        anchorEl={anchorEl}
                                        keepMounted
                                        open={Boolean(anchorEl)}
                                        onClose={this.handleClose}
                                    >
                                        {
                                            this.isAdmin()
                                                ? this.renderAdminMenu()
                                                : this.renderUserMenu()
                                        }
                                    </Menu>
                                    <Button onClick={this.logout}>Sair</Button>
                                </>
                        }


                        {
                            !isLogged &&
                                <>
                                    <Typography variant="h6" style={{flexGrow: 1}}>LMS Client</Typography>
                                    <Button component={Link} to="/login">Login</Button>
                                    <Button component={Link} to="/register">Cadastrar</Button>
                                </>
                        }

                    </Toolbar>
                </AppBar>
            </div>
        );
    }
}

export default withRouter(MainMenu);
