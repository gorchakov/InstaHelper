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

    renderTable(followers: IInstaUser[]) {
        return <table className="table table-striped table-hover">
            <thead>
                <tr>
                    <th className="follower-image-preview">Img</th>
                    <th>Name</th>
                    <th>User name</th>
                    <th>Is private</th>
                    <th>Is verified</th>
                </tr>
            </thead>
            <tbody>
                {followers.map((followerObj) =>
                    <tr key={followerObj.pk}>
                        <td className="follower-image-preview">
                            <img className="img-fluid" src={followerObj.profilePicture} />
                        </td>
                        <td>{followerObj.fullName}</td>
                        <td>
                            <a href={this.getInstagramUrlLink(followerObj.userName)} target="_blank">{followerObj.userName}</a> 
                        </td>
                        <td>{followerObj.isPrivate}</td>
                        <td>{followerObj.isVerified}</td>
                    </tr>
                )}
            </tbody>
        </table>
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
                            {this.state.openedImportChangesId == importObj.id && this.state.importChanges.newFollowers &&
                                this.state.importChanges.newFollowers.length > 0 &&
                                <div>
                                    <h4>New followers</h4>
                                    {this.renderTable(this.state.importChanges.newFollowers)}
                                </div>
                            }
                            {this.state.openedImportChangesId == importObj.id && this.state.importChanges.pastFollowers &&
                                this.state.importChanges.pastFollowers.length > 0 &&
                                <div>
                                    <h4>Past followers</h4>
                                    {this.renderTable(this.state.importChanges.pastFollowers)}
                                </div>
                            }
                        </div>
                    )}
                </div>
            }
            <button type="button" className="btn btn-success" onClick={(e) => this.startImport()}>Import folowers</button>
        </div>
    };
}
