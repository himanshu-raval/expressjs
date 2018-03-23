import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
 
import { Coin } from './coin.model';
 
@Injectable()
export class CoinService {
    constructor(private http: Http) { }
 
    getAll() {
        return this.http.get('/Shop/Coin/api/').map((response: Response) => response.json());
    }
 
    getById(_id: string) {
        return this.http.get('/Shop/Coin/api/' + _id).map((response: Response) => response.json());
    }
 
    create(coin: Coin) {
        return this.http.post('/Shop/Coin/api/', coin).map((response: Response) => response.json());
    }
 
    update(coin: Coin) {
        return this.http.put('/Shop/Coin/api/' + coin.id, coin).map((response: Response) => response.json());
    }
 
    delete(_id: string) {
        return this.http.delete('/Shop/Coin/api/' + _id).map((response: Response) => response.json());
    }
}