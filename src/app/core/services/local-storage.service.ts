import { Injectable } from '@angular/core';
import { AUTH_REMEMBER, AUTHORIZATION } from '@shared/configs';

@Injectable()
export class LocalStorageService {

    constructor() {
    }

    getCurrentUser() {
        if (localStorage.getItem(AUTHORIZATION)) {
            return localStorage.getItem(AUTHORIZATION);
        } else {
            return null;
        }
    }

    getAccessToken(): string {
        const currentUser = this.getCurrentUser();
        if (currentUser) {
            return currentUser;
        }
        return '';
    }

    setCurrentUser(userDetail) {
        localStorage.removeItem(AUTHORIZATION);
        localStorage.setItem(AUTHORIZATION, 'bearer ' + userDetail.AccessToken);
    }

    removeLogin() {
        const rememberMe = localStorage.getItem(AUTH_REMEMBER);
        localStorage.clear();
        sessionStorage.clear();
        if (rememberMe) {
            localStorage.setItem(AUTH_REMEMBER, rememberMe);
        }
    }
}
