import dayjs from 'dayjs';

import { Response, Request } from 'miragejs';
import { handleErrors } from '../server';
import { Diary } from "../../../interfaces/diary.interface";
import { Entry } from '../../../interfaces/entery.interface';
import { User } from '../../../interfaces/user.interface';

// CREATE DIARY
export const create = (schema: any, req: Request): {user: User, diary: Diary} | Response => {
    try {
        const {title, type, userId} = JSON.parse(req.requestBody) as Partial<Diary>
        const exUser = schema.users.findBy({id: userId});
        
        if(!exUser) return handleErrors(null, 'No such user exists!');

        const now = dayjs().format();
        console.log(now);
        const diary = exUser.createDiary({
            title,
            type,
            createdAt: now,
            updatedAt: now,
        });
        
        return {
          user: {
            ...exUser.attrs,
          },
          diary: diary.attrs,
        };
        
    } catch (err) {
        return handleErrors(err, 'failed to create Diary')
    }
}

// UPDATE DIARY
export const updateDiary = (schema:any, req: Request): Diary | Response => {
    try {
        const diary = schema.diaries.find(req.params.id);
        const data = JSON.parse(req.requestBody) as Partial<Diary>;

        const now = dayjs().format();
        diary.update({
            ...data,
            updatedAt: now,
        })
        return diary.attrs as Diary;
    } catch (err) {
        return handleErrors(err, 'Fialed to update Diary.')
    }
}

// GET EXISTING DIARIES 
export const getDiaries = (schema:any, req: Request): Diary[] | Response => {
    try {
        const user = schema.users.find(req.params.id);
    
        return user.diaries as Diary[];
    } catch (err) {
        return handleErrors(err, 'Could not get Diaries.')
    }
} 

// ADD ENTRY
export const addEntry = (schema:any, req: Request): {diary: Diary, entry: Entry} | Response => {
    try {
        const diary = schema.diaries.find(req.params.id);
        const {title, content} = JSON.parse(req.requestBody) as Partial<Entry>;
        const now = dayjs().format();
        
        const entry = diary.createEntry({
            title,
            content,
            createdAt: now,
            updatedAt: now,
        });
        diary.update({
            ...diary.attrs,
            updatedAT: now,
        })

        return {
            diary: diary.attrs,
            entry: entry.attrs,
        }
    } catch (err) {
        return handleErrors(err,'Failed to save entry!');
    }
}

// GET ENTRIES
export const getEntries = (schema:any, req: Request): {entries: Entry[]} | Response => {
    try {
        const diary = schema.diaries.find(req.params.id);
        return diary.entry;
    } catch (err) {
        return handleErrors(err, 'Failed! to get diary entries')
    }
}

// UPDATE ENTRIES
export const updateEntry = (schema: any, req: Request): Entry | Response => {
    try {
        const entry = schema.entries.find(req.params.id);
        const data = JSON.parse(req.requestBody) as Partial<Entry>;
        const now = dayjs().format();

        entry.update({
            ...data,
            updatedAt: now,
        })

        return entry.attrs as Entry;
    } catch (err) {
        return handleErrors(err, 'Failed! to update entry');
    }
};