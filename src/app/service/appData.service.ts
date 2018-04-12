import { Injectable } from '@angular/core';
import { IAppDataService } from './iappData.service';

@Injectable()
export class AppDataService {
    public myAppData: IAppDataService;

    constructor() {
        this.myAppData = {
          jsonURL: 'http://agl-developer-test.azurewebsites.net/people.json'
        };
    }
}
