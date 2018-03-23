import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
 
import { Player } from './player.model';
 
@Injectable()
export class PlayerService {
    constructor(private http: Http) { }
 
    getAll() {
        return this.http.get('/Player/Player').map((response: Response) => response.json());
    }
 
    getById(_id: string) {
        return this.http.get('/Player/Player/' + _id).map((response: Response) => response.json());
    }
 
    create(player: Player) {
        return this.http.post('/Player/Player', player);
    }
 
    update(player: Player) {
        return this.http.put('/Player/Player/' + player.id, player);
    }
 
    delete(_id: string) {
        return this.http.delete('/Player/Player/' + _id).map((response: Response) => response.json());
    }
}