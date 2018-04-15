import { Observable } from 'rxjs/Observable';
import { Person } from '../model/person.model';

export abstract class IPersonService {
    abstract getPersonDetails(): Observable<Person[]>;
}
