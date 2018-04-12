import { Observable } from 'rxjs/Observable';
import { Person } from '../model/person.model';

export interface IPersonService {
    getPersonDetails(): Observable<Person[]>;
}
