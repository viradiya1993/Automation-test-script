import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { NotificationService, PageService, TemplateService, UserScriptService, WebsiteService } from '@app/core/services';
import { CommonObjects } from '@app/shared/models/user-script.model';

declare const $: any;

@Component({
    selector: 'app-user-script',
    templateUrl: './user-script.component.html',
    styleUrls: ['./user-script.component.scss']
})
export class UserScriptComponent implements OnInit {
    scriptToEdit: CommonObjects = null;
    scriptRemove: CommonObjects;
    commonFunctionList = [];
    commonFunctionListCopy = [];

    constructor(
        private fb: FormBuilder,
        private websiteService: WebsiteService,
        private templateService: TemplateService,
        private pageService: PageService,
        public dialog: MatDialog,
        private userScript: UserScriptService,
        private notificationService: NotificationService
    ) {
    }

    ngOnInit() {
        $("#removeUserScript").on("hide.bs.modal", function () {
            this.scriptRemove = undefined;
        });
        this.getCommonFunctionList();
    }

    searchInCommonFunctionList(text: string) {
        if (text) {
            const functions = [...this.commonFunctionListCopy];
            this.commonFunctionList = functions.filter(function (item) {
                return item.name.toLowerCase().includes(text.toLowerCase());
            });
        } else {
            this.getCommonFunctionList();
        }
    }

    removeUserscript(commonList: CommonObjects) {
        this.userScript.deleteCommonFunction(commonList.commonFunctionId).subscribe((res: any) => {
            if (res) {
                this.notificationService.showNotification(
                    res.details,
                    "top"
                );
                this.getCommonFunctionList();
            }
        });
    }

    getCommonFunctionList() {
        this.userScript.getCommonFunctionList().subscribe((res: any) => {
            if (res) {
                this.commonFunctionList = res.content;
                this.commonFunctionListCopy = res.content;
            }
        });
    }

}
