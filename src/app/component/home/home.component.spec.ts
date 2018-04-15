import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';

// import { MyConfigService } from '../../service/myConfig.service';
import { IPersonService } from '../../service/iperson.service';
import { PersonService } from '../../service/person.service';
import { HomeComponent } from './home.component';

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
  try {
    beforeEach(async(() => {
      TestBed.configureTestingModule({
        declarations: [ HomeComponent ],
        imports: [HttpModule],
        providers: [
          { provide: IPersonService, useClass: PersonService},
          { provide: XHRBackend, useClass: MockBackend }
        ]
      })
      .compileComponents().then(() => {
        fixture = TestBed.createComponent(HomeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
      });
    }));
  } catch (error) {
    alert(error);
  }
  it('ngOnInit() - should be 4 cats under male owner and 3 cats under female owner in ascending order in cats array under home model', fakeAsync(() => {
    const mockData = '[{"name":"Bob","gender":"Male","age":23,"pets":[{"name":"Garfield","type":"Cat"},{"name":"Fido","type":"Dog"}]},{"name":"Jennifer","gender":"Female","age":18,"pets":[{"name":"Garfield","type":"Cat"}]},{"name":"Steve","gender":"Male","age":45,"pets":null},{"name":"Fred","gender":"Male","age":40,"pets":[{"name":"Tom","type":"Cat"},{"name":"Max","type":"Cat"},{"name":"Sam","type":"Dog"},{"name":"Jim","type":"Cat"}]},{"name":"Samantha","gender":"Female","age":40,"pets":[{"name":"Tabby","type":"Cat"}]},{"name":"Alice","gender":"Female","age":64,"pets":[{"name":"Simba","type":"Cat"},{"name":"Nemo","type":"Fish"}]}]';
    const backend = TestBed.get(XHRBackend);
    backend.connections.subscribe((connection: MockConnection) => {
      connection.mockRespond(new Response(new ResponseOptions({
        body: mockData
      })));
    });
    component.ngOnInit();
    fixture.detectChanges();
    tick();

    expect(component.homeModel).not.toBe(null);

    expect(component.homeModel.cats[0].ownerGender).not.toBe(null);
    expect(component.homeModel.cats[1].ownerGender).not.toBe(null);
    expect(component.homeModel.cats.length).toBe(2);
    expect(component.homeModel.cats[0].ownerGender).toBe('Male');
    expect(component.homeModel.cats[1].ownerGender).toBe('Female');

    expect(component.homeModel.cats[0].petNames.length = 4);
    expect(component.homeModel.cats[1].petNames.length = 3);

    const catsOMaleAsc = component.homeModel.cats[0].petNames.sort();
    expect(catsOMaleAsc).toEqual(['Garfield', 'Jim', 'Max', 'Tom']);
    const catsOFemaleAsc = component.homeModel.cats[1].petNames.sort();
    expect(catsOFemaleAsc).toEqual(['Garfield', 'Simba', 'Tabby']);

  }));

   it('ngOnInit() -  isError property of home model should be false after fetching data from api', fakeAsync(() => {
    const mockData = '[{"name":"Bob","gender":"Male","age":23,"pets":[{"name":"Garfield","type":"Cat"},{"name":"Fido","type":"Dog"}]},{"name":"Jennifer","gender":"Female","age":18,"pets":[{"name":"Garfield","type":"Cat"}]},{"name":"Steve","gender":"Male","age":45,"pets":null},{"name":"Fred","gender":"Male","age":40,"pets":[{"name":"Tom","type":"Cat"},{"name":"Max","type":"Cat"},{"name":"Sam","type":"Dog"},{"name":"Jim","type":"Cat"}]},{"name":"Samantha","gender":"Female","age":40,"pets":[{"name":"Tabby","type":"Cat"}]},{"name":"Alice","gender":"Female","age":64,"pets":[{"name":"Simba","type":"Cat"},{"name":"Nemo","type":"Fish"}]}]';
    const backend = TestBed.get(XHRBackend);
    backend.connections.subscribe((connection: MockConnection) => {
      connection.mockRespond(new Response(new ResponseOptions({
        body: mockData
      })));
    });
    component.ngOnInit();
    fixture.detectChanges();
    tick();

    expect(component.homeModel.isError).toBe(false);
  }));

  it('ngOnInit() - it should call getPersonDetails() once to get person details', async(() => {
    const personAPI = fixture.debugElement.injector.get(IPersonService);
    spyOn(personAPI, 'getPersonDetails').and.callThrough();
    component.ngOnInit();
    expect(personAPI.getPersonDetails).toHaveBeenCalledTimes(1);

  }));

  it('ngOnInit() -  it should call getOwnerGenderWithCats() once to get only cats with their owner gender', fakeAsync(() => {
    const mockData = '[{"name":"Bob","gender":"Male","age":23,"pets":[{"name":"Garfield","type":"Cat"},{"name":"Fido","type":"Dog"}]},{"name":"Jennifer","gender":"Female","age":18,"pets":[{"name":"Garfield","type":"Cat"}]},{"name":"Steve","gender":"Male","age":45,"pets":null},{"name":"Fred","gender":"Male","age":40,"pets":[{"name":"Tom","type":"Cat"},{"name":"Max","type":"Cat"},{"name":"Sam","type":"Dog"},{"name":"Jim","type":"Cat"}]},{"name":"Samantha","gender":"Female","age":40,"pets":[{"name":"Tabby","type":"Cat"}]},{"name":"Alice","gender":"Female","age":64,"pets":[{"name":"Simba","type":"Cat"},{"name":"Nemo","type":"Fish"}]}]';
    const backend = TestBed.get(XHRBackend);
    backend.connections.subscribe((connection: MockConnection) => {
      connection.mockRespond(new Response(new ResponseOptions({
        body: mockData
      })));
    });
    spyOn(component, 'getOwnerGenderWithCats');
    component.ngOnInit();
    fixture.detectChanges();
    tick();

    expect(component.getOwnerGenderWithCats).toHaveBeenCalledTimes(1);
  }));

  it('ngOnInit() - should show error message if isError property of home model becomes false', fakeAsync(() => {
        component.homeModel.isError = true;
        fixture.detectChanges();
        const compiled = fixture.debugElement.nativeElement;
        expect(compiled.querySelector('div.hasError').textContent).toContain('Sorry, something went wrong: Please try again later!');
  }));

  it('getOwnerGenderWithCats() - should return only cat names and owner gender who have cats only', fakeAsync(() => {
    const mockData = JSON.parse('[{"name":"Bob","gender":"Male","age":23,"pets":[{"name":"Garfield","type":"Cat"},{"name":"Fido","type":"Dog"}]},{"name":"Jennifer","gender":"Female","age":18,"pets":[{"name":"Tom","type":"Cat"}]},{"name":"Steve","gender":"Female","age":45,"pets":[{"name":"Peter","type":"Dog"}]}]');
    const catsByOwnerGender = component.getOwnerGenderWithCats(mockData);
    expect(catsByOwnerGender[0].petNames.length = 1);
    expect(catsByOwnerGender[1].petNames.length = 1);
  }));

  it('getOwnerGenderWithCats() - should return only male owner with their cats if there is no cat under female owner', fakeAsync(() => {
    const mockData = JSON.parse('[{"name":"Bob","gender":"Male","age":23,"pets":[{"name":"Garfield","type":"Cat"},{"name":"Fido","type":"Dog"}]},{"name":"Jennifer","gender":"Male","age":18,"pets":[{"name":"Tom","type":"Cat"}]},{"name":"Steve","gender":"Female","age":45,"pets":[{"name":"Peter","type":"Dog"}]}]');
    const catsByOwnerGender = component.getOwnerGenderWithCats(mockData);
    expect(catsByOwnerGender.length).toBe(1);
    expect(catsByOwnerGender[0].ownerGender).toBe('Male');
    expect(catsByOwnerGender[0].petNames.length = 2);
  }));

  it('getOwnerGenderWithCats() - should return cat names in ascending order', fakeAsync(() => {
    const mockData = JSON.parse('[{"name":"Bob","gender":"Male","age":23,"pets":[{"name":"Garfield","type":"Cat"},{"name":"Fido","type":"Dog"}]},{"name":"Jennifer","gender":"Male","age":18,"pets":[{"name":"Tom","type":"Cat"}]},{"name":"Steve","gender":"Male","age":45,"pets":[{"name":"Jim","type":"Cat"}]}]');
    const catsByOwnerGender = component.getOwnerGenderWithCats(mockData);
    const catsOMaleAsc = catsByOwnerGender[0].petNames.sort();
    expect(catsOMaleAsc).toEqual(['Garfield', 'Jim', 'Tom']);
  }));

});
