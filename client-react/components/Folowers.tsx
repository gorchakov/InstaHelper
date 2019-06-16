import * as React from "react";
import FolowersService, { IFolower } from '../services/FolowersService';
import { RouteComponentProps } from "react-router";

let folowersService = new FolowersService();

export class Folowers extends React.Component<RouteComponentProps<any>, any> {
    refs: {
        query: HTMLInputElement;
    };

    state = {
        folowers: [] as Array<IFolower>,
        editContact: null as Object,
        isAddMode: false as boolean,
        searchQuery: '' as string
    };

    componentDidMount() {
        this.showAll();
    }

    showAll() {
        folowersService.fetchAll().then((response) => {
            this.setState({ searchQuery: '', contacts: response.content });
        });
    }

    handleSearchQueryChange(event: React.ChangeEvent<HTMLInputElement>) {
        this.setState({ searchQuery: event.target.value });
    }

    handleSeachSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!this.state.searchQuery) {
            this.showAll();
            return;
        }

        folowersService.search(this.state.searchQuery).then((response) => {
            this.setState({ contacts: response.content });
        });
    }

    delete(contact: IFolower) {
        folowersService.delete(contact.id).then((response) => {
            let updatedContacts = this.state.folowers;
            updatedContacts.splice(updatedContacts.indexOf(contact), 1);
            this.setState({ contacts: updatedContacts });
        });
    }

    render() {
        return <div>
            <h1>Contacts </h1>
            </div>
    };
}
