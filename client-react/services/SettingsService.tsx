import RestUtilities from './RestUtilities';

export interface IUserSettings {
    id?: number,
    updated: string,
    botUserName: string,
    botPassword: string,
    targetUsername: string,
    active: boolean
}

export default class SettingsService {
    fetchAll() {
        return RestUtilities.get<Array<IUserSettings>>('/api/settings');
    }

    fetch(id: number) {
        return RestUtilities.get<IUserSettings>(`/api/settings/${id}`);
    }

    update(setting: IUserSettings) {
        return RestUtilities.put<IUserSettings>(`/api/settings/${setting.id}`, setting);
    }

    create(setting: IUserSettings) {
        return RestUtilities.post<IUserSettings>('/api/settings', setting);
    }

    save(setting: IUserSettings) {
        if (setting.id) {
            return this.update(setting);
        } else {
            return this.create(setting);
        }
    }

    delete(id: number) {
        return RestUtilities.delete(`/api/settings/${id}`);
    }


}
