import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Route, Redirect, Switch } from 'react-router-dom';
import { SignIn, Register } from './Auth';
import AuthService from '../services/Auth';
import { ErrorPage } from './Error';
import { Contacts } from './Contacts';
import { ImportList } from './ImportList';
import { Folowers } from './Folowers';
import { ContactForm } from './ContactForm';
import { Header } from './Header';
import { Settings } from './Settings';
import { SettingForm } from './SettingForm';

export class RoutePaths {
    public static Contacts: string = "/contacts";
    public static ContactEdit: string = "/contacts/edit/:id";
    public static ContactNew: string = "/contacts/new";
    public static SignIn: string = "/";
    public static Register: string = "/register/";
    public static ImportList: string = "/importList/";
    public static Folowers: string = "/folowers/";
    public static Settings: string = "/settings/";
    public static SettingsEdit: string = "/settings/edit/:id";
    public static SettingsNew: string = "/settings/new";
}

export default class Routes extends React.Component<any, any> {
    render() {
        return <Switch>
            <Route exact path={RoutePaths.SignIn} component={SignIn} />
            <Route path={RoutePaths.Register} component={Register} />
            <DefaultLayout path={RoutePaths.Folowers} component={Folowers} />
            <DefaultLayout exact path={RoutePaths.ImportList} component={ImportList} />

            <DefaultLayout exact path={RoutePaths.Settings} component={Settings} />
            <DefaultLayout path={RoutePaths.SettingsNew} component={SettingForm} />
            <DefaultLayout path={RoutePaths.SettingsEdit} component={SettingForm} />

            <DefaultLayout exact path={RoutePaths.Contacts} component={Contacts} />
            <DefaultLayout path={RoutePaths.ContactNew} component={ContactForm} />
            <DefaultLayout path={RoutePaths.ContactEdit} component={ContactForm} />
            <Route path='/error/:code?' component={ErrorPage} />
        </Switch>
    }
}

const DefaultLayout = ({ component: Component, ...rest }: { component: any, path: string, exact?: boolean }) => (
    <Route {...rest} render={props => (
        AuthService.isSignedIn() ? (
            <div>
                <Header {...props} />
                <div className="container">
                    <Component {...props} />
                </div>
            </div>
        ) : (
                <Redirect to={{
                    pathname: RoutePaths.SignIn,
                    state: { from: props.location }
                }} />
            )
    )} />
);
