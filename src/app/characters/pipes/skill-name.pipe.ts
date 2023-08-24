import { Pipe, PipeTransform } from '@angular/core';
import { Skill } from '../interfaces/skill.interface';

@Pipe({
  name: 'skillName'
})
export class SkillNamePipe implements PipeTransform {

  transform(skill: Skill): string {
    return skill.name
  }

}
