import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import 'fontsource-roboto';
import UserPage from "./pages/user.page";
import ContextsPage from "./pages/contexts.page";
import ContextPage from "./pages/context.page";

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
                    {/*<Route path="/context">*/}
                    {/*    <Route path="/:id" component={ContextPage}/>*/}
                    {/*</Route>*/}

                    <Route path="/context/:id" exact={true} component={ContextPage} />
                    <Route path="/contexts">
                        <ContextsPage />
                    </Route>
                    <Route path="/users">
                        <UserPage />
                    </Route>
                    <Route path="/">
                        <Home />
                    </Route>
                </Switch>
            </div>
        </Router>
    );
}

function Home() {
    return <h2>Home</h2>;
}

function About() {
    return <h2>About</h2>;
}
