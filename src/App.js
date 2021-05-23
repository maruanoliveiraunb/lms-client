import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import 'fontsource-roboto';
import StorageUtils from "./utils/storage.utils";
import UserPage from "./pages/user.page";
import ContextsPage from "./pages/contexts.page";
import ContextPage from "./pages/context.page";
import LineItemPage from "./pages/lineItem.page";
import LoginPage from "./pages/login.page";

export default function App() {

    return (
        <Router>
            <div>
                <nav>
                    <ul>
                        <li>
                            <Link to="/">Home</Link>
                        </li>
                        <li>
                            <Link to="/login">Login</Link>
                        </li>
                        <li>
                            <Link to="/contexts">Contexts</Link>
                        </li>
                        <li>
                            <Link to="/users">Users</Link>
                        </li>
                    </ul>
                </nav>

                {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
                <Switch>
                    <Route path="/lineitem/:id" exact={true} component={LineItemPage} />
                    <Route path="/context/:id" exact={true} component={ContextPage} />
                    <Route path="/contexts" component={ContextsPage} />
                    <Route path="/users" component={UserPage} />
                    <Route path="/login" component={LoginPage} />
                    <Route path="/" component={Home} />
                </Switch>
            </div>
        </Router>
    );
}

function Home() {
    return <h2>Home</h2>;
}

