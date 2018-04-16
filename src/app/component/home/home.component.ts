import { Component, OnInit } from '@angular/core';

import { PersonService } from '../../service/person.service';
import { OwnerGenderWithPets } from '../../model/ownerGenderWithPets.model';
import { HomeModel } from '../../model/home.model';
import { Person } from '../../model/person.model';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public homeModel: HomeModel;

  constructor(private _person: PersonService) {
    this.homeModel = new HomeModel();
  }

  ngOnInit(): void {
    this._person.getPersonDetails().subscribe((data) => {
        this.homeModel.cats = this.getOwnerGenderWithCats(data);
    }, (err) => {
        console.error(err);
        this.homeModel.isError = true;
    });
  }

  getOwnerGenderWithCats(data: Person[]): OwnerGenderWithPets[] {
    const ownerGenderWithPetsArr: OwnerGenderWithPets[] = [];
    if ( data !== null || data !== undefined ) {
      const filteredArray = data.filter( el => {
        return el.pets && el.pets.some(e => e.type !== null && e.type === 'Cat');
      });

      const ownerGender = [];
      filteredArray.forEach (e => { if (ownerGender.indexOf(e.gender) === -1) {ownerGender.push(e.gender); } });
      ownerGender.forEach( gender => {
        const ownerGenderWithPets = new OwnerGenderWithPets();
        ownerGenderWithPets.ownerGender = gender;
        ownerGenderWithPets.petNames = [];
        filteredArray.forEach(e => {
          if ( e.gender === gender ) {
            e.pets.forEach(pet => {
              if ( pet.type === 'Cat' ) {
                ownerGenderWithPets.petNames.push(pet.name);
              }
            });
          }
        });
        ownerGenderWithPets.petNames.sort();
        ownerGenderWithPetsArr.push(ownerGenderWithPets);
      });
    }
    return ownerGenderWithPetsArr;
  }
}
