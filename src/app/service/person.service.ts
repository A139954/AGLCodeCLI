import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import { Person } from '../model/person.model';
import { environment } from '../../environments/environment';

@Injectable()
export class PersonService {
  constructor(
    private http: Http
  ) { }

  public getPersonDetails(): Observable<Person[]> {
    return this.http.get(environment.apiUrl)
            .catch((err: Response) => {
                console.error(err);
                return Observable.throw(err.json());
            })
            .map((response) => response.json() as Person[]);
  }
}
