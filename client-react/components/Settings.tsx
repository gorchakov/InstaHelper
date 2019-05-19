import * as React from "react";
import { Link, Redirect } from 'react-router-dom';
import { RoutePaths } from './Routes';
import SettingsService, { IUserSettings } from '../services/SettingsService';
import { RouteComponentProps } from "react-router";

let settingsService = new SettingsService();

export class Settings extends React.Component<RouteComponentProps<any>, any> {
    refs: {
        query: HTMLInputElement;
    };

    state = {
        settings: [] as Array<IUserSettings>,
        editImport: null as Object,
        isAddMode: false as boolean,
        searchQuery: '' as string
    };

    componentDidMount() {
        this.showAll();
    }

    showAll() {
        settingsService.fetchAll().then((response) => {
            this.setState({ searchQuery: '', settings: response.content });
        });
    }


    delete(settings: IUserSettings) {
        settingsService.delete(settings.id).then((response) => {
            let updatedsettings = this.state.settings;
            updatedsettings.splice(updatedsettings.indexOf(settings), 1);
            this.setState({ settings: updatedsettings });
        });
    }

    render() {
        return <div>
            <h1>User settings</h1>
            {this.state.settings && this.state.settings.length > 0 &&
                <table className="table">
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Updated date</th>
                            <th>Bot's username</th>
                            <th>Bot's password</th>
                            <th>Target's username</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.settings.map((settingObj, index) =>
                        <tr key={settingObj.id}>
                            <td>{settingObj.id}</td>
                            <td>{settingObj.updated}</td>
                            <td>{settingObj.botUserName}</td>
                            <td>{settingObj.botPassword}</td>
                            <td>{settingObj.targetUsername}</td>
                            <td>{settingObj.active}</td>
                            <td>
                                <Link to={RoutePaths.Settings.replace(":id", settingObj.id.toString())}>edit</Link>
                                <button type="button" className="btn btn-link" onClick={(e) => this.delete(settingObj)}>delete</button>
                            </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            }

            <Link className="btn btn-success" to={RoutePaths.SettingsNew}>add</Link>

        </div>
    };
}
