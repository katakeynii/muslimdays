import Realm from 'realm';

export class Mission extends Realm.Object<Mission> {
    id!: string;
    title!: string;
    description?: string;
    vision?: string;
    createdAt!: Date;
    updatedAt!: Date;
    isActive!: boolean;

    static schema: Realm.ObjectSchema = {
        name: 'Mission',
        primaryKey: 'id',
        properties: {
            id: 'string',
            title: 'string',
            description: 'string?',
            vision: 'string?',
            createdAt: 'date',
            updatedAt: 'date',
            isActive: { type: 'bool', default: true },
        },
    };
}


