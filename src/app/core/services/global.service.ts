import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class GlobalService {
    userDetail = {};
    private goals = new BehaviorSubject<any>(this.userDetail);
    goal = this.goals.asObservable();

    constructor() {
    }

    changeGoal(goal: any) {
        this.goals.next(goal);
    }

}

