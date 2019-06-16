import RestUtilities from './RestUtilities';

export interface IImportList {
    id?: number,
    date: string;
    targetName: string;
    count: number;
}

export interface IChangesSet {
    newFollowers: IInstaUser[];
    pastFollowers: IInstaUser[];
}

export interface IInstaUser {
    isPrivate: boolean;
    isVerified: boolean;
    pk: string;
    profilePicture: string;
    userName: string;
    fullName: string;
}

export default class ImportListService {
    fetchAll() {
        return RestUtilities.get<Array<IImportList>>('/api/importlist');
    }

    fetch(importId: number) {
        return RestUtilities.get<IImportList>(`/api/importlist/${importId}`);
    }

    startImport() {
        return RestUtilities.get<IImportList>(`/api/importlist/startimport`);
    }

    loadChanges(importId: number) {
        return RestUtilities.get<IChangesSet>(`/api/importlist/loadchanges/${importId}`);
    }

    delete(importId: number) {
        return RestUtilities.delete(`/api/importlist/${importId}`);
    }
}

