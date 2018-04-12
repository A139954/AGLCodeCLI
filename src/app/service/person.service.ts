import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import { IPersonService } from './iperson.service';
import { AppDataService } from './appData.service';
import { Person } from '../model/person.model';

@Injectable()
export class PersonService implements IPersonService {
  constructor(
    private http: Http,
    private appData: AppDataService,
) { }

  public getPersonDetails(): Observable<Person[]> {
    return this.http.get(this.appData.myAppData.jsonURL)
            .catch((err: Response) => {
                console.log(err);
                return Observable.throw(err.json());
            })
            .map((response) => response.json() as Person[]);
  }
}
