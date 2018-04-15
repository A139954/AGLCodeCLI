import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes} from '@angular/router';


import { AppComponent } from './app.component';
import { HomeComponent } from './component/home/home.component';

import { MyConfigService } from './service/myConfig.service';
import { IPersonService } from './service/iperson.service';
import { PersonService } from './service/person.service';

const appRoutes: Routes = [
  {
     path: '',
     component: HomeComponent
  }
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [{ provide: IPersonService, useClass: PersonService},
     MyConfigService],
  bootstrap: [AppComponent]
})
export class AppModule { }
