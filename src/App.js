import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";
import 'fontsource-roboto';
import UserPage from "./pages/user.page";
import ContextsPage from "./pages/contexts.page";
import ContextPage from "./pages/context.page";
import LineItemPage from "./pages/lineItem.page";
import LoginPage from "./pages/login.page";
import RegisterPage from "./pages/register.page";
import HomePage from "./pages/home.page";
import MainMenu from "./components/mainMenu.component";

export default function App() {

    return (
        <Router>
            <div>
                <MainMenu />

                {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
                <Switch>
                    <Route path="/lineitem/:id" exact={true} component={LineItemPage} />
                    <Route path="/context/:id" exact={true} component={ContextPage} />
                    <Route path="/contexts" component={ContextsPage} />
                    <Route path="/users" component={UserPage} />
                    <Route path="/login" component={LoginPage} />
                    <Route path="/register" component={RegisterPage} />
                    <Route path="/" component={HomePage} />
                </Switch>
            </div>
        </Router>
    );
}
