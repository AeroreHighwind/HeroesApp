import { ActivatedRoute, Router } from '@angular/router';
import { Character, Publisher } from '../../interfaces/character.interface';
import { CharactersService } from '../../services/characters.service';
import { Component, OnInit } from '@angular/core';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';
import { filter, switchMap } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';
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

  public characterForm = new FormGroup({
    id: new FormControl<string>(''),
    name: new FormControl<string>('', { nonNullable: true }),
    creator: new FormControl<Publisher>(Publisher.Independent),
    title: new FormControl(''),
    class: new FormControl(''),
    skills: new FormControl(),
    alt_img: new FormControl('')
  });


  public creators = [
    { id: 'Independend', desc: 'Own creation' }
  ]

  constructor(
    private charactersService: CharactersService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private snackbar: MatSnackBar,
    private dialog: MatDialog,
    private announcer: LiveAnnouncer
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

        this.characterForm.reset(char);
        return;
      })
  }

  onSubmit(): void {
    if (this.characterForm.invalid) return;

    if (this.currentCharacter.id) {
      this.charactersService.updateCharacter(this.currentCharacter)
        .subscribe(hero => {
          this.showSnackbar(`${hero.name} updated!`)
        });
      return;
    }

    this.charactersService.addCharacter(this.currentCharacter)
      .subscribe(character => {
        this.router.navigate(['/heroes/edit', character.id]);
        this.showSnackbar(`${character.name} created!`)
      });
  }



  onDeleteHero() {
    if (!this.currentCharacter.id) throw Error('Hero id is required');

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
        this.router.navigate(['/heroes']);
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
      this.skills.push({ name: value });
      console.log(value)
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

}


