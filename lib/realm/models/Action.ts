import Realm from 'realm';

export class Action extends Realm.Object<Action> {
    id!: string;
    title!: string;
    description?: string;
    datetime!: Date;
    duration!: number; // minutes
    recurrence!: string; // 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly'
    linkedObjectiveId?: string;
    isCompleted!: boolean;
    createdAt!: Date;
    updatedAt!: Date;

    static schema: Realm.ObjectSchema = {
        name: 'Action',
        primaryKey: 'id',
        properties: {
            id: 'string',
            title: 'string',
            description: 'string?',
            datetime: 'date',
            duration: 'int',
            recurrence: 'string',
            linkedObjectiveId: 'string?',
            isCompleted: { type: 'bool', default: false },
            createdAt: 'date',
            updatedAt: 'date',
        },
    };
}


