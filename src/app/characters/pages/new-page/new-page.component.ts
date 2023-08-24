import { ActivatedRoute, Router } from '@angular/router';
import { Character, Publisher } from '../../interfaces/character.interface';
import { CharactersService } from '../../services/characters.service';
import { Component, OnInit } from '@angular/core';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';
import { filter, switchMap } from 'rxjs';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatChipEditedEvent, MatChipInputEvent } from '@angular/material/chips';
import { Skill } from '../../interfaces/skill.interface';

@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html',
  styles: [
  ]
})
export class NewPageComponent implements OnInit {
  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  skills: Skill[] = [];

  public characterForm = this.fb.group({
    id: [''],
    name: ['', Validators.required],
    creator: [Publisher.Independent],
    title: [''],
    class: [''],
    skills: [this.skills],
    alt_img: [''],
  });


  public creators = [
    { id: 'Independent', desc: 'Own creation' }
  ]

  constructor(
    private charactersService: CharactersService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private snackbar: MatSnackBar,
    private dialog: MatDialog,
    private announcer: LiveAnnouncer,
    private fb: FormBuilder
  ) { }


  get currentCharacter(): Character {
    const character = this.characterForm.value as Character
    return character;
  }

  ngOnInit(): void {
    if (!this.router.url.includes('edit')) return;
    this.activatedRoute.params
      .pipe(
        switchMap(({ id }) => this.charactersService.getCharacterById(id)),
      ).subscribe(char => {
        if (!char) return this.router.navigateByUrl('/');
        //TODO usar el metodo add chips con las keys de los objetos para mostrar
        //correctamente los nombres de las skilles
        this.characterForm.reset(char);
        // this.characterForm.controls.skills.reset()
        return;
      })
  }

  onSubmit(): void {
    if (this.characterForm.invalid) return;

    if (this.currentCharacter.id) {
      this.characterForm.controls.skills.setValue(this.skills)
      this.charactersService.updateCharacter(this.currentCharacter)
        .subscribe(character => {
          this.showSnackbar(`${character.name} updated!`)
        });
      return;
    }

    this.charactersService.addCharacter(this.currentCharacter)
      .subscribe(character => {
        this.router.navigate(['/characters/edit/', character.id]);
        this.showSnackbar(`${character.name} created!`)
      });
  }



  onDeleteCharacter() {
    if (!this.currentCharacter.id) throw Error('Character id is required');

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: this.characterForm.value
    });

    dialogRef.afterClosed()
      .pipe(
        filter((result: boolean) => result),
        switchMap(() => this.charactersService.deleteCharacterById(this.currentCharacter.id)),
        filter((wasDeleted: boolean) => wasDeleted),
      )
      .subscribe(() => {
        this.router.navigate(['/characters']);
      })
  }

  showSnackbar(message: string): void {
    this.snackbar.open(message, 'done', {
      duration: 2500,
    })
  }

  //MatChipForm Setup
  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our skill
    if (value) {
      const newSkill: Skill = {
        name: value,
      };
      this.skills.push(newSkill);
      console.log(this.skills)
    }
    // Clear the input value
    event.chipInput!.clear();
  }

  remove(skills: Skill): void {
    const index = this.skills.indexOf(skills);

    if (index >= 0) {
      this.skills.splice(index, 1);

      this.announcer.announce(`Removed ${skills}`);
    }
  }

  edit(skills: Skill, event: MatChipEditedEvent) {
    const value = event.value.trim();

    // Remove skill if it no longer has a name
    if (!value) {
      this.remove(skills);
      return;
    }

    // Edit existing skill
    const index = this.skills.indexOf(skills);
    if (index >= 0) {
      this.skills[index].name = value;
    }
  }

  getCharacterSkills(char: Character): string[] {
    const skillnames: string[] = [];
    const skills: Skill[] = char.skills;

    for (const skill of skills) {
      for (const name of skill.name) {
        skillnames.push(name)
      }
    }
    return skillnames;
  }

}


