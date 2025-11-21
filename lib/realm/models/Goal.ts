import Realm from 'realm';

// Objective correspond à l'ancien Goal dans l'app
export class Goal extends Realm.Object<Goal> {
    id!: string;
    missionId!: string;
    title!: string;
    description?: string;
    dueDate?: Date;
    termType!: 'court' | 'moyen' | 'long';
    isCompleted!: boolean;
    isActive!: boolean;
    successCriteria?: string;
    createdAt!: Date;
    updatedAt!: Date;

    static schema: Realm.ObjectSchema = {
        name: 'Goal',
        primaryKey: 'id',
        properties: {
            id: 'string',
            missionId: 'string',
            title: 'string',
            description: 'string?',
            dueDate: 'date?',
            termType: 'string',
            isCompleted: { type: 'bool', default: false },
            isActive: { type: 'bool', default: false },
            successCriteria: 'string?',
            createdAt: 'date',
            updatedAt: 'date',
        },
    };
}


