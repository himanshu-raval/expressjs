import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
 
import { Avatar } from './avatar.model';
 
@Injectable()
export class AvatarService {
    constructor(private http: Http) { }
 
    getAll() {
        return this.http.get('/Shop/Avatar/api/').map((response: Response) => response.json());
    }
 
    getById(_id: string) {
        return this.http.get('/Shop/Avatar/api/' + _id).map((response: Response) => response.json());
    }
 
    create(avatar: Avatar) {
        return this.http.post('/Shop/Avatar/api/', avatar).map((response: Response) => response.json());
    }
 
    update(avatar: Avatar) {
        console.log("Avatart Upadte Called");
        return this.http.put('/Shop/Avatar/api/' + avatar.id, avatar).map((response: Response) => response.json());
    }
 
    delete(_id: string) {
        return this.http.delete('/Shop/Avatar/api/' + _id).map((response: Response) => response.json());
    }
}