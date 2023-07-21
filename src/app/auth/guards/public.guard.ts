import { Injectable } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ActivatedRouteSnapshot, CanActivate, CanMatch, Route, Router, RouterStateSnapshot, UrlSegment } from '@angular/router';
import { Observable, map, tap } from 'rxjs';

@Injectable({providedIn: 'root'})
export class PublicGuard {
    
    constructor( 
        private authService:AuthService,
        private router: Router) { }
    

    private checkAuthStatus(): boolean | Observable<boolean>{
        return this.authService.checkAuthentication()
        .pipe(
            tap( isAuthenticated =>{
                if (isAuthenticated){
                    this.router.navigate(['./'])
                }
            }),
            map(isAuthenticated => !isAuthenticated)
        );
    }

    canMatch(route: Route, segments: UrlSegment[]): boolean | Observable<boolean> | Promise<boolean > {
        return this.checkAuthStatus();
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean > | Promise<boolean > {
        return this.checkAuthStatus();
    }

}