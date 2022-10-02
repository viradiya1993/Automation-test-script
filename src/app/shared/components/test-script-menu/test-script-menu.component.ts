import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';

import { PAGE_API } from './../../../core/helpers/api.helper';

@Component({
    selector: 'app-test-script-menu',
    templateUrl: './test-script-menu.component.html',
    styleUrls: ['./test-script-menu.component.scss']
})
export class TestScriptMenuComponent implements OnInit {
    listPgs: any = {};

    constructor(private http: HttpClient) {
    }

    ngOnInit() {
        $(document).on('click', 'nav ul > li > a', function () {
            $(this).parent('li').toggleClass('active');
            $(this).next('ul').slideToggle('30');
        });

        const headers = new HttpHeaders({
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhaHFfdXNlciIsImF1dGhvcml0aWVzIjpbIlN1YnNjcmliZXIiXSwiaWF0IjoxNTUyNzIzOTAyLCJleHAiOjE1NTI4MTAzMDJ9.aFyCPZ21DWgjBoh7oogCYeJI77ye0wSyB50TdwzxdXw'
        });

        this.http.get(PAGE_API + 'pages/locators', { headers: headers })
            .subscribe(
                response => {
                    this.listPgs = response;
                }
            );

        // this.http.get('../assets/data/page-locators.json')
        // .subscribe(
        //   response => {
        //     this.listPgs = response.json();
        //   }
        // );
    }

}
