import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class DataService
{
	constructor(private http: Http) {}
	
	getRooms()
	{
		return this.http.get("/api/rooms").map((result) => result.json().data);
	}
}
