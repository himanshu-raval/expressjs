import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
 
import { Chest } from './chest.model';
 
@Injectable()
export class ChestService {
    constructor(private http: Http) { }
 
    getAll() {

        return this.http.get('/Shop/Chest/api/').map((response: Response) => response.json());
    }
 
    getById(_id: string) {
        return this.http.get('/Shop/Chest/api/' + _id).map((response: Response) => response.json());
    }
 
    create(chest: Chest) {
        return this.http.post('/Shop/Chest/api/', chest).map((response: Response) => response.json());
    }
 
    update(chest: Chest) {
        return this.http.put('/Shop/Chest/api/' + chest.id, chest).map((response: Response) => response.json());
    }
 
    delete(_id: string) {
        return this.http.delete('/Shop/Chest/api/' + _id).map((response: Response) => response.json());
    }
}