import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
 
import { Card } from './card.model';
 
@Injectable()
export class CardService {
    constructor(private http: Http) { }
 
    getAll() {
        return this.http.get('/Shop/Card/api/').map((response: Response) => response.json());
    }
 
    getById(_id: string) {
        return this.http.get('/Shop/Card/api/' + _id).map((response: Response) => response.json());
    }
 
    create(card: Card) {
        return this.http.post('/Shop/Card/api/', card).map((response: Response) => response.json());
    }
 
    update(card: Card) {
        return this.http.put('/Shop/Card/api/' + card.id, card).map((response: Response) => response.json());
    }
 
    delete(_id: string) {
        return this.http.delete('/Shop/Card/api/' + _id).map((response: Response) => response.json());
    }
}