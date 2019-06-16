import * as React from "react";
import { Link, Redirect } from 'react-router-dom';
import { RoutePaths } from './Routes';
import ImportListService, { IImportList, IChangesSet, IInstaUser } from '../services/ImportListService';
import { RouteComponentProps } from "react-router";

let importListService = new ImportListService();

export class ImportList extends React.Component<RouteComponentProps<any>, any> {
    refs: {
        query: HTMLInputElement;
    };

    state = {
        imports: [] as Array<IImportList>,
        editImport: null as Object,
        isAddMode: false as boolean,
        searchQuery: '' as string,
        openedImportChangesId: 0 as number,
        importChanges: null as IChangesSet
    };

    componentDidMount() {
        this.showAll();
    }

    showAll() {
        importListService.fetchAll().then((response) => {
            this.setState({ searchQuery: '', imports: response.content });
        });
    }


    delete(imports: IImportList) {
        importListService.delete(imports.id).then((response) => {
            let updatedImports = this.state.imports;
            updatedImports.splice(updatedImports.indexOf(imports), 1);
            this.setState({ imports: updatedImports });
        });
    }

    startImport() {
        importListService.startImport().then((response) => {
            if (!response.is_error) {
                this.showAll();
            } else {
                this.setState({ errors: response.error_content });
            }
        });
    }

    loadChanges(importId: number) {
        importListService.loadChanges(importId).then((response) => {
            if (!response.is_error) {
                this.state.openedImportChangesId = importId;
                this.state.importChanges = response.content;
                this.showAll();
            } else {
                this.setState({ errors: response.error_content });
            }
        });
    }

    getInstagramUrlLink(userName: string) {
        return "https://www.instagram.com/" + userName;
    }

    getBoolValue(v: boolean) {
        if (v)
            return "+"
        else
            return ""
    }

    renderTable(followers: IInstaUser[]) {
        return <div className="table-responsive">
            <table className="table table-striped table-hover table-sm">
                <thead>
                    <tr className="text-center">
                        <th scope="col" className="follower-image-preview">Img</th>
                        <th scope="col">Name</th>
                        <th scope="col">User name</th>
                        <th scope="col">priv</th>
                        <th scope="col">verif</th>
                    </tr>
                </thead>
                <tbody>
                    {followers.map((followerObj) =>
                        <tr key={followerObj.pk}>
                            <td className="follower-image-preview col-md-3">
                                <img className="img-fluid" src={followerObj.profilePicture} />
                            </td>
                            <td>{followerObj.fullName}</td>
                            <td>
                                <a href={this.getInstagramUrlLink(followerObj.userName)} target="_blank">{followerObj.userName}</a>
                            </td>
                            <td>{this.getBoolValue(followerObj.isPrivate)}</td>
                            <td>{this.getBoolValue(followerObj.isVerified)}</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    }

    renderTableNew(followers: IInstaUser[]) {
        return <div className="table">
            <div className="row">
                <h6 className="col-2 text-center">Img</h6>
                <h6 className="col-4 text-center">Name</h6>
                <h6 className="col-4 text-center">User name</h6>
                <h6 className="col-1 text-center">P</h6>
                <h6 className="col-1 text-center">V</h6>
            </div>
            {followers.map((followerObj) =>
                <div className="row" key={followerObj.pk}>
                    <div className="col-2 follower-image-preview">
                        <img className="img-fluid" src={followerObj.profilePicture} />
                    </div>
                    <div className="col-4">{followerObj.fullName}</div>
                    <div className="col-4">
                        <a href={this.getInstagramUrlLink(followerObj.userName)} target="_blank">{followerObj.userName}</a>
                    </div>
                    <div className="col-1">{this.getBoolValue(followerObj.isPrivate)}</div>
                    <div className="col-1">{this.getBoolValue(followerObj.isVerified)}</div>
                </div>
            )}
        </div>
    }


    render() {
        return <div>
            <h1>Imports </h1>
            {this.state.imports && this.state.imports.length > 0 &&
                <div className="table">
                    <div className="row">
                        <h5 className="col-1 font-weight-bold">Id</h5>
                        <h5 className="col-3 font-weight-bold">Date</h5>
                        <h5 className="col-3 font-weight-bold">Target name</h5>
                        <h5 className="col-1 font-weight-bold">Count</h5>
                        <div className="col-3"></div>
                        <div className="col-1"></div>
                    </div>
                    {this.state.imports.map((importObj, index) =>
                        <div className="container" key={importObj.id}>
                            <div className="row">
                                <div className="col-1">{importObj.id}</div>
                                <div className="col-3">{importObj.date}</div>
                                <div className="col-3">{importObj.targetName}</div>
                                <div className="col-1">{importObj.count}</div>
                                <div className="col-3">
                                    <button type="button"
                                        className="btn btn-primary"
                                        onClick={(e) => this.loadChanges(importObj.id)}>
                                        Load changes
                                    </button>
                                </div>
                                <div className="col-1"><button type="button" className="btn btn-danger" onClick={(e) => this.delete(importObj)}>delete</button></div>
                            </div>
                            <div className="row">
                                {this.state.openedImportChangesId == importObj.id && this.state.importChanges.newFollowers &&
                                    this.state.importChanges.newFollowers.length > 0 &&
                                    <div className="col-md-6">
                                        <h4>New followers</h4>
                                        {this.renderTableNew(this.state.importChanges.newFollowers)}
                                    </div>
                                }
                                {this.state.openedImportChangesId == importObj.id && this.state.importChanges.pastFollowers &&
                                    this.state.importChanges.pastFollowers.length > 0 &&
                                    <div className="col-md-6">
                                        <h4>Past followers</h4>
                                        {this.renderTableNew(this.state.importChanges.pastFollowers)}
                                    </div>
                                }
                            </div>
                        </div>
                    )}
                </div>
            }
            <button type="button" className="btn btn-success" onClick={(e) => this.startImport()}>Import folowers</button>
        </div>
    };
}
