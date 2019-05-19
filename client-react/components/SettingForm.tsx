import 'object-assign';
import * as React from 'react';
import { Link, Redirect, RouteComponentProps } from 'react-router-dom';
import SettingsService, { IUserSettings } from '../services/SettingsService'
import { RoutePaths } from './Routes';


let settingsService = new SettingsService();

export class SettingForm extends React.Component<RouteComponentProps<any>, any> {
    state = {
        setting: null as IUserSettings,
        errors: {} as { [key: string]: string }
    }

    componentDidMount() {
        if (this.props.match.path == RoutePaths.SettingsEdit) {
            settingsService.fetch(this.props.match.params.id).then((response) => {
                this.setState({ setting: response.content });
            });
        } else {
            let newSetting: IUserSettings = {
                botUserName: '', botPassword: '', targetUsername: '', active: false, updated: ''
            };
            this.setState({ setting: newSetting });
        }
    }

    handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        this.saveSetting(this.state.setting);
    }

    handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        let settingUpdates = {
            [name]: value
        };

        this.setState({
            setting: Object.assign(this.state.setting, settingUpdates)
        });
    }

    saveSetting(setting: IUserSettings) {
        this.setState({ errors: {} as { [key: string]: string } });
        settingsService.save(setting).then((response) => {
            if (!response.is_error) {
                this.props.history.push(RoutePaths.Settings);
            } else {
                this.setState({ errors: response.error_content });
            }
        });
    }

    _formGroupClass(field: string) {
        var className = "form-group ";
        if (field) {
            className += " has-danger"
        }
        return className;
    }

    render() {
        if (!this.state.setting) {
            return <div>Loading...</div>;
        }
        else {
            return <fieldset className="form-group">
                <legend>{this.state.setting.id ? "Edit Setting" : "New Setting"}</legend>
                <form onSubmit={(e) => this.handleSubmit(e)}>
                    <div className={this._formGroupClass(this.state.errors.botUserName)}>
                        <label htmlFor="inputBotUserName" className="form-control-label">Bot's username</label>
                        <input type="text" autoFocus name="botUserName" id="inputBotUserName" value={this.state.setting.botUserName} onChange={(e) => this.handleInputChange(e)} className="form-control form-control-danger" required />
                        <div className="form-control-feedback">{this.state.errors.botUserName}</div>
                    </div>
                    <div className={this._formGroupClass(this.state.errors.botPassword)}>
                        <label htmlFor="inputBotPassword" className="form-control-label">Bot's password</label>
                        <input type="text" name="botPassword" id="inputBotPassword" value={this.state.setting.botPassword} onChange={(e) => this.handleInputChange(e)} className="form-control form-control-danger" required />
                        <div className="form-control-feedback">{this.state.errors.botPassword}</div>
                    </div>
                    <div className={this._formGroupClass(this.state.errors.targetUsername)}>
                        <label htmlFor="inputTargetUsername" className="form-control-label">Target's username</label>
                        <input type="text" name="targetUsername" id="inputTargetUsername" value={this.state.setting.targetUsername} onChange={(e) => this.handleInputChange(e)} className="form-control form-control-danger" required />
                        <div className="form-control-feedback">{this.state.errors.targetUsername}</div>
                    </div>
                    <div>
                        <label htmlFor="inputActive" className="form-control-label">Active</label>
                        <input type="checkbox" name="active" id="inputActive" checked={this.state.setting.active} onChange={(e) => this.handleInputChange(e)} className="form-control form-control-danger" />
                    </div>
                    <button className="btn btn-lg btn-primary btn-block" type="submit">Save</button>
                    <Link className="btn btn-lg btn-light btn-block" to="/settings">Cancel</Link>
                </form>
            </fieldset>
        }
    }
}
