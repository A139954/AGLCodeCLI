import {  OwnerGenderWithPets } from './ownerGenderWithPets.model';

export class HomeModel {
  cats: OwnerGenderWithPets[];
  isError: boolean;

  constructor() {
    this.cats = [];
    this.isError = false;
  }
}
