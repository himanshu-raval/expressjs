import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
 
import { Achievement } from './achievement.model';
 
@Injectable()
export class AchievementService {
    constructor(private http: Http) { }
 
    getAll() {
         return this.http.get('/Achievement/Achievement').map((response: Response) => response.json());
    }
    create(achievement: Achievement) {

        return this.http.post('/Achievement/Achievement', achievement).map((response: Response) => response.json());
    }
    update(achievement: Achievement) {
        console.log('Edit Work');
        return this.http.put('/Achievement/Achievement/' + achievement.id, achievement).map((response: Response) => response.json());
    }
    getById(_id: string) {
        return this.http.get('/Achievement/Achievement/' + _id).map((response: Response) => response.json());
    }
    delete(_id: string) {
        return this.http.delete('/Achievement/Achievement/' + _id).map((response: Response) => response.json());
    }
}