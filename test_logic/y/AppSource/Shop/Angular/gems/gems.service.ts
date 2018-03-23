import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
 
import { Gems } from './gems.model';
 
@Injectable()
export class GemsService {
    constructor(private http: Http) { }
 
    getAll() {
        console.log("Get All Called");
        return this.http.get('/Shop/Gems/api/').map((response: Response) => response.json());
    }
 
    getById(_id: string) {
        return this.http.get('/Shop/Gems/api/' + _id).map((response: Response) => response.json());
    }
 
    create(gems: Gems) {
        return this.http.post('/Shop/Gems/api/', gems).map((response: Response) => response.json());
    }
 
    update(gems: Gems) {
        console.log("Gemst Upadte Called");
        return this.http.put('/Shop/Gems/api/' + gems.id, gems).map((response: Response) => response.json());
    }
 
    delete(_id: string) {
        return this.http.delete('/Shop/Gems/api/' + _id).map((response: Response) => response.json());
    }
}