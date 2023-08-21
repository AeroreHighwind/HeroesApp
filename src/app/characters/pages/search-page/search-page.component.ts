import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Character } from '../../interfaces/Character.interface';
import { CharactersService } from '../../services/characters.service';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styles: [
  ]
})
export class SearchPageComponent {

  public searchInput = new FormControl('');
  public heroes: Character[] = [];
  public selectedHero?: Character;

  constructor(private charactersService: CharactersService) { }
  searchHero() {
    const value: string = this.searchInput.value || '';

    this.charactersService.getSuggestions(value)
      .subscribe(heroes => this.heroes = heroes);
  }

  onSelectedOption(event: MatAutocompleteSelectedEvent): void {
    if (!event.option.value) {
      this.selectedHero = undefined;
      return
    }

    const hero: Character = event.option.value;
    this.searchInput.setValue(hero.superhero);

    this.selectedHero = hero;
  }


}
