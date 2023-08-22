import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Character, Publisher } from '../../interfaces/Character.interface';
import { CharactersService } from '../../services/characters.service';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, switchMap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html',
  styles: [
  ]
})
export class NewPageComponent implements OnInit {

  public heroForm = new FormGroup({
    id: new FormControl<string>(''),
    name: new FormControl<string>('', { nonNullable: true }),
    creator: new FormControl<Publisher>(Publisher.Independent),
    title: new FormControl(''),
    class: new FormControl(''),
    skills: new FormControl(''),
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
  ) { }


  get currentCharacter(): Character {
    const character = this.heroForm.value as Character
    return character;
  }

  ngOnInit(): void {
    if (!this.router.url.includes('edit')) return;
    this.activatedRoute.params
      .pipe(
        switchMap(({ id }) => this.charactersService.getCharacterById(id)),
      ).subscribe(char => {
        if (!char) return this.router.navigateByUrl('/');

        this.heroForm.reset(char);
        return;
      })
  }

  onSubmit(): void {
    if (this.heroForm.invalid) return;

    if (this.currentCharacter.id) {
      this.charactersService.updateCharacter(this.currentCharacter)
        .subscribe(hero => {
          this.showSnackbar(`${hero.name} updated!`)
        });
      return;
    }

    this.charactersService.addCharacter(this.currentCharacter)
      .subscribe(hero => {
        this.router.navigate(['/heroes/edit', hero.id]);
        this.showSnackbar(`${hero.name} created!`)
      });
  }



  onDeleteHero() {
    if (!this.currentCharacter.id) throw Error('Hero id is required');

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: this.heroForm.value
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

}


