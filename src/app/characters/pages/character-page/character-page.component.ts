import { Component, OnInit } from '@angular/core';
import { CharactersService } from '../../services/characters.service';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { Character } from '../../interfaces/character.interface';

@Component({
  selector: 'app-hero-page',
  templateUrl: './character-page.component.html',
  styles: [
  ]
})
export class CharacterPageComponent implements OnInit {

  public character?: Character;

  constructor(
    private charactersService: CharactersService,
    private activatedRoute: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    this.activatedRoute.params
      .pipe(
        switchMap(({ id }) => this.charactersService.getCharacterById(id)),
      ).subscribe(character => {

        if (!character) return this.router.navigate(['heroes/list']);

        this.character = character;
        return;
      })
  }
  goBack(): void {
    this.router.navigateByUrl('heroes/list');
  }




}
