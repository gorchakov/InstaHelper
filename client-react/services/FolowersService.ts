import RestUtilities from './RestUtilities';

export interface IFolower {
    id?: number,
    lastName: string;
    firstName: string;
    phone: string;
    email: string;
}

export default class FolowersService {
    fetchAll() {
        return RestUtilities.get<Array<IFolower>>('/api/contacts');
    }

    fetch(contactId: number) {
        return RestUtilities.get<IFolower>(`/api/contacts/${contactId}`);
    }

    search(query: string) {
        return RestUtilities.get<Array<IFolower>>(`/api/contacts/search/?q=${query}`);
    }

    update(contact: IFolower) {
        return RestUtilities.put<IFolower>(`/api/contacts/${contact.id}`, contact);
    }

    create(contact: IFolower) {
        return RestUtilities.post<IFolower>('/api/contacts', contact);
    }

    save(contact: IFolower) {
        if (contact.id) {
            return this.update(contact);
        } else {
            return this.create(contact);
        }
    }

    delete(contactId: number) {
        return RestUtilities.delete(`/api/contacts/${contactId}`);
    }
}

