import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-locator',
    templateUrl: './locator.component.html',
    styleUrls: ['./locator.component.scss']
})
export class LocatorComponent implements OnInit {

    locForm: FormGroup;

    constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private http: HttpClient) {
    }

    ngOnInit() {
        this.locForm = this.formBuilder.group({
            locatorName: ['', Validators.required],
            locatorType: ['', Validators.required],
            locatorValue: ['', Validators.required],
        });
    }

}
