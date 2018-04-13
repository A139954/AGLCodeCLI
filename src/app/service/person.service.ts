import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import { IPersonService } from './iperson.service';
import { Person } from '../model/person.model';
import { MyConfigService } from './myConfig.service';

@Injectable()
export class PersonService implements IPersonService {
  constructor(
    private http: Http,
    private myConfig: MyConfigService
  ) { }

  public getPersonDetails(): Observable<Person[]> {
    return this.http.get(this.myConfig.apiEndPoint)
            .catch((err: Response) => {
                console.log(err);
                return Observable.throw(err.json());
            })
            .map((response) => response.json() as Person[]);
  }
}
