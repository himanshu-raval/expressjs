import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
 
import { Wheel } from './wheel.model';
 
@Injectable()
export class WheelService {
    constructor(private http: Http) { }
 
    getAll() {
        return this.http.get('/Wheel/Slice').map((response: Response) => response.json());
    }
 
    getById(_id: string) {
        return this.http.get('/Wheel/Slice/' + _id).map((response: Response) => response.json());
    }
 
    create(wheel: Wheel) {
        return this.http.post('/Wheel/Slice', wheel).map((response: Response) => response.json());
    }
 
    update(wheel: Wheel) {
        return this.http.put('/Wheel/Slice/' + wheel.id, wheel).map((response: Response) => response.json());
    }
 
    delete(_id: string) {
        return this.http.delete('/Wheel/Slice/' + _id).map((response: Response) => response.json());
    }
}