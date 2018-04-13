import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';

import { PersonService } from '../../service/person.service';
import { HomeComponent } from './home.component';
import { AppDataService } from '../../service/appData.service';
import { Http, XHRBackend, HttpModule } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { Injectable, Injector} from '@angular/core';
import { fakeAsync, tick} from '@angular/core/testing';
import { BaseRequestOptions, ConnectionBackend, RequestOptions} from '@angular/http';
import { Response, ResponseOptions} from '@angular/http';
import { MockConnection} from '@angular/http/testing';


describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeComponent ],
      imports: [HttpModule],
      providers: [ PersonService, AppDataService,
        { provide: XHRBackend, useClass: MockBackend }
       ]
    })
    .compileComponents().then(() => {
      fixture = TestBed.createComponent(HomeComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
  }));

  it('ngOnInit() - check the initial value of the cat json details', fakeAsync(() => {
    const mockData = JSON.parse('[{"name":"Bob","gender":"Male","age":23,"pets":[{"name":"Garfield","type":"Cat"},{"name":"Fido","type":"Dog"}]},{"name":"Jennifer","gender":"Female","age":18,"pets":[{"name":"Garfield","type":"Cat"}]},{"name":"Steve","gender":"Male","age":45,"pets":null},{"name":"Fred","gender":"Male","age":40,"pets":[{"name":"Tom","type":"Cat"},{"name":"Max","type":"Cat"},{"name":"Sam","type":"Dog"},{"name":"Jim","type":"Cat"}]},{"name":"Samantha","gender":"Female","age":40,"pets":[{"name":"Tabby","type":"Cat"}]},{"name":"Alice","gender":"Female","age":64,"pets":[{"name":"Simba","type":"Cat"},{"name":"Nemo","type":"Fish"}]}]');
    const backend = TestBed.get(XHRBackend);
    backend.connections.subscribe((connection: MockConnection) => {
      connection.mockRespond(new Response(new ResponseOptions({
        body: mockData
      })));
    });
    component.ngOnInit();
    fixture.detectChanges();
    tick();

    // homemodel and its propertity cats should not be null and isError should be false
    expect(component.homeModel).not.toBe(null);
    expect(component.homeModel.isError).toBe(false);
    expect(component.homeModel.cats).not.toBe(null);

    // owner gender should not be null and should have only two gender male,female
    expect(component.homeModel.cats[0].ownerGender).not.toBe(null);
    expect(component.homeModel.cats[1].ownerGender).not.toBe(null);
    expect(component.homeModel.cats.length).toBe(2);
    expect(component.homeModel.cats[0].ownerGender).toBe('Male');
    expect(component.homeModel.cats[1].ownerGender).toBe('Female');

    // there should be 4 cats under male owner gender and 3 under female owner gender
    expect(component.homeModel.cats[0].petNames.length = 4);
    expect(component.homeModel.cats[1].petNames.length = 3);

    // cats should be in alphabatic order
    const catsOMaleAsc = component.homeModel.cats[0].petNames.sort();
    expect(catsOMaleAsc).toEqual(['Garfield', 'Jim', 'Max', 'Tom']);
    const catsOFemaleAsc = component.homeModel.cats[1].petNames.sort();
    expect(catsOFemaleAsc).toEqual(['Garfield', 'Simba', 'Tabby']);

  }));

  it('getPersonDetails() - it should call personservice once to get person details', async(() => {
    const personAPI = fixture.debugElement.injector.get(PersonService);
    spyOn(personAPI, 'getPersonDetails').and.callThrough();
    component.ngOnInit();
    expect(personAPI.getPersonDetails).toHaveBeenCalledTimes(1);
  }));

  it('getCatsByOwnerGender() - should filter the data and return only cat names and owner gender who have cats only', fakeAsync(() => {
    const mockData = JSON.parse('[{"name":"Bob","gender":"Male","age":23,"pets":[{"name":"Garfield","type":"Cat"},{"name":"Fido","type":"Dog"}]},{"name":"Jennifer","gender":"Male","age":18,"pets":[{"name":"Tom","type":"Cat"}]},{"name":"Steve","gender":"Female","age":45,"pets":null}]');

    const catsByOwnerGender = component.getCatsByOwnerGender(mockData);

    // should return only cats under male owner gender if there is no cat under female owner gender
    expect(catsByOwnerGender.length).toBe(1);
    expect(catsByOwnerGender[0].ownerGender).toBe('Male');

    // there should be 4 cats under male owner gender and 3 under female owner gender
    expect(catsByOwnerGender[0].petNames.length = 2);

    // cats should be in alphabatic order
    const catsOMaleAsc = catsByOwnerGender[0].petNames.sort();
    expect(catsOMaleAsc).toEqual(['Garfield', 'Tom']);
  }));

  it(' Erroneous situation - should show error message if there is an error  ', fakeAsync(() => {
        component.homeModel.isError = true;
        fixture.detectChanges();
        const compiled = fixture.debugElement.nativeElement;
        expect(compiled.querySelector('div.hasError').textContent).toContain('Sorry, something went wrong: Please try again later!');
  }));

});
