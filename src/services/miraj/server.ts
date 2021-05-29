import { Server, Model, Factory, belongsTo, hasMany, Response } from "miragejs";
 
export const handleErrors = (error: any, message="an error occured") => {
    return new Response(400, undefined, {
        data: {
            message,
            isError: true
        },
    })
}

export const setupServer = (env?: string): Server => {
    return new Server({
        environment: env ?? 'development',

        models: {
            entry: Model.extend({
                diary: belongsTo()
            }),
            diary: Model.extend({
                entry: hasMany(),
            }),
            user: Model.extend({
                diary: hasMany()
            })
        },

        factories: {
            user: Factory.extend({
                username: 'test',
                password: 'password',
                email: 'test@gmail.com',
            }),
        },

        seeds: (server): any => {
            server.create('user');
        },

        routes(): void {
            this.urlPrefix = 'https://diaries.app';
        }
    })
}