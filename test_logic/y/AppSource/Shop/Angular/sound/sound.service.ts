import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
 
import { Sound } from './sound.model';
 
@Injectable()
export class SoundService {
    constructor(private http: Http) { }
 
    getAll() {
        return this.http.get('/Shop/Sound/api/').map((response: Response) => response.json());
    }
 
    getById(_id: string) {
        return this.http.get('/Shop/Sound/api/' + _id).map((response: Response) => response.json());
    }
 
    create(sound: Sound) {
        return this.http.post('/Shop/Sound/api/', sound).map((response: Response) => response.json());
    }
 
    update(sound: Sound) {
        return this.http.put('/Shop/Sound/api/' + sound.id, sound).map((response: Response) => response.json());
    }
 
    delete(_id: string) {
        return this.http.delete('/Shop/Sound/api/' + _id).map((response: Response) => response.json());
    }
}