import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Character } from '../../interfaces/character.interface';
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
  public characters: Character[] = [];
  public selectedCharacter?: Character;

  constructor(private charactersService: CharactersService) { }
  searchCharacter() {
    const value: string = this.searchInput.value || '';

    this.charactersService.getSuggestions(value)
      .subscribe(characters => this.characters = characters);
  }

  onSelectedOption(event: MatAutocompleteSelectedEvent): void {
    if (!event.option.value) {
      this.selectedCharacter = undefined;
      return
    }

    const char: Character = event.option.value;
    this.searchInput.setValue(char.name);

    this.selectedCharacter = char;
  }


}
