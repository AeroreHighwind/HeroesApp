import { Component, OnInit } from '@angular/core';
import { Character } from '../../interfaces/character.interface';
import { CharactersService } from '../../services/characters.service';

@Component({
  selector: 'app-list-page',
  templateUrl: './list-page.component.html',
  styles: [
  ]
})
export class ListPageComponent implements OnInit {

  public characters: Character[] = [];

  constructor(private charactersService: CharactersService) {

  }
  ngOnInit(): void {
    this.charactersService.getCharacters()
      .subscribe(characters => this.characters = characters);
  }

}
