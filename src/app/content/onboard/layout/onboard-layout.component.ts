import { Router } from '@angular/router';
import { AuthGuard } from '@core/guards/auth-guard.service';
import { Component, OnInit } from '@angular/core';

@Component({
    templateUrl: './onboard-layout.component.html'
})
export class OnBoardLayoutComponent implements OnInit {

    constructor(router: Router, authGuard: AuthGuard) {
        if (!authGuard.isOnBoardingPending()) {
            router.navigate(['/dashboard']);
        }
    }

    ngOnInit() {

    }

}
