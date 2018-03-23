import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
 
import { Tournament } from './tournament.model';
 
@Injectable()
export class TournamentService {
    constructor(private http: Http) { }
 
    getAll() {
         return this.http.get('/Tournament/Tournament/').map((response: Response) => response.json());
    }
    create(tournament: Tournament) {

        return this.http.post('/Tournament/Tournament/', tournament).map((response: Response) => response.json());
    }
    update(tournament: Tournament) {
        console.log('Edit Work');
        return this.http.put('/Tournament/Tournament/' + tournament.id, tournament).map((response: Response) => response.json());
    }
    getById(_id: string) {
        return this.http.get('/Tournament/Tournament/' + _id).map((response: Response) => response.json());
    }
    delete(_id: string) {
        return this.http.delete('/Tournament/Tournament/' + _id).map((response: Response) => response.json());
    }
}