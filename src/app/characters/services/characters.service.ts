import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';
import { Character } from '../interfaces/character.interface';
import { environments } from 'src/environments/environments';

@Injectable({ providedIn: 'root' })
export class CharactersService {

    private baseUrl: string = environments.baseUrl;

    constructor(private http: HttpClient) { }

    getCharacters(): Observable<Character[]> {
        return this.http.get<Character[]>(`${this.baseUrl}/characters`);
    }

    getCharacterById(id: string): Observable<Character | undefined> {
        return this.http.get<Character>(`${this.baseUrl}/characters/${id}`)
            .pipe(
                catchError(error => of(undefined))
            );
    }

    getSuggestions(query: string): Observable<Character[]> {
        return this.http.get<Character[]>(`${this.baseUrl}/characters?q=${query}&_limit=6`);
    }

    addCharacter(hero: Character): Observable<Character> {
        return this.http.post<Character>(`${this.baseUrl}/characters`, hero);
    }

    updateCharacter(hero: Character): Observable<Character> {
        if (!hero.id) throw Error('Character is required');

        return this.http.patch<Character>(`${this.baseUrl}/characters/${hero.id}`, hero);
    }

    deleteCharacterById(id: string): Observable<boolean> {

        return this.http.delete<Character>(`${this.baseUrl}/characters/${id}`)
            .pipe(
                map(resp => true),
                catchError(err => of(false)),

            );
    }

}