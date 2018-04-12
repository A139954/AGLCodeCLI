import {  PetsByOwnerGender } from './PetsByOwnerGender.model';

export class HomeModel {
  cats: PetsByOwnerGender[];
  isError: boolean;

  constructor() {
    this.cats = [];
    this.isError = false;
  }
}
