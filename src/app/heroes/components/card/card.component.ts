import { Component, Input, OnInit } from '@angular/core';
import { Character } from '../../interfaces/Character.interface';

@Component({
  selector: 'heroes-hero-card',
  templateUrl: './card.component.html',
  styles: [
  ]
})
export class CardComponent implements OnInit {

  @Input()
  public character!: Character;

  ngOnInit(): void {
    if (!this.character) throw Error('Hero property is required');
  }

}
