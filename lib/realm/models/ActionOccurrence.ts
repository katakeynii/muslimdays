import Realm from 'realm';
import { OccurrenceStatus } from '../enums';

export class ActionOccurrence extends Realm.Object<ActionOccurrence> {
    _id!: Realm.BSON.ObjectId;
    action!: Action;
    user!: User;
    scheduledFor?: Date; // when it was expected (for cyclic)
    completedAt?: Date; // when actually done
    status!: OccurrenceStatus;

    static schema: Realm.ObjectSchema = {
        name: 'ActionOccurrence',
        primaryKey: '_id',
        properties: {
            _id: 'objectId',
            action: 'Action',
            user: 'User',
            scheduledFor: 'date?',
            completedAt: 'date?',
            status: { type: 'string', default: 'DONE' },
        },
        // You could add indexes for queries by user/date if needed
    };
}

// Defered imports to bottom to avoid TS circular ref issues
import { Action } from './Action';
import { User } from './User';


