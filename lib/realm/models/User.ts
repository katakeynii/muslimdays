import Realm from 'realm';

export class User extends Realm.Object<User> {
    id!: string; // external auth id
    deviceId!: string;
    name?: string;
    email?: string;

    static schema: Realm.ObjectSchema = {
        name: 'User',
        primaryKey: 'id',
        properties: {
            id: { type: 'string', indexed: true },
            deviceId: { type: 'string', indexed: true },
            name: 'string?',
            email: { type: 'string', indexed: true },
        },
    };
}


