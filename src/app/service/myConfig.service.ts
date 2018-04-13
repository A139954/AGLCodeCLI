import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable()
export class MyConfigService {
    public apiEndPoint:  string;
    constructor() {
        this.apiEndPoint = environment.apiUrl;
    }
}
