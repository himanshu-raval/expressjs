import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
 
import { Help } from './help.model';
 
@Injectable()
export class HelpService {
    constructor(private http: Http) { }
 
    get() {
        return this.http.get('/Help/Help').map((response: Response) => response.json());
    }
    update(help: Help) {
        return this.http.put('/Help/Help', help).map((response: Response) => response.json());
    }
}