import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
 
import { Landmark } from './landmark.model';
 
@Injectable()
export class LandmarkService {
    constructor(private http: Http) { }
 
    getAll() {
     
        return this.http.get('/Shop/Landmark/api/').map((response: Response) => response.json());
        
    }
 
    getById(_id: string) {
        return this.http.get('/Shop/Landmark/api/' + _id).map((response: Response) => response.json());
    }
 
    create(landmark: Landmark) {
        return this.http.post('/Shop/Landmark/api/', landmark).map((response: Response) => response.json());
    }
 
    update(landmark: Landmark) {
        return this.http.put('/Shop/Landmark/api/' + landmark.id, landmark).map((response: Response) => response.json());
    }
 
    delete(_id: string) {
        return this.http.delete('/Shop/Landmark/api/' + _id).map((response: Response) => response.json());
    }
}