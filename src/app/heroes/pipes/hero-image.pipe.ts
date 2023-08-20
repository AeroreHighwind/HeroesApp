import { Pipe, PipeTransform } from '@angular/core';
import { Character } from '../interfaces/hero.interface';

@Pipe({
  name: 'heroImage'
})
export class HeroImagePipe implements PipeTransform {

  transform(character: Character): string {
    if (!character.id && !character.alt_img) {
      return 'assets/no-image.png'
    }
    if (character.alt_img) return character.alt_img;

    return `assets/heroes/${character.id}.jpg`;
  }

}
