import { AuthErrorModel } from "@shared/models/auth.model";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { OrganizationModal } from "@shared/models/";
import { GlobalService, OrganizationService } from "@core/services/";
import { MessageService } from "@app/shared/components/message/messageService.service";
import { MatDialog } from "@angular/material/dialog";
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: "app-client-info-dialog",
    templateUrl: "client-dialog.component.html",
})
export class ClientDialogComponent implements OnInit, OnDestroy {
    componentDestroyed$: Subject<boolean> = new Subject();

    clientForm: FormGroup;
    client: OrganizationModal = new OrganizationModal();
    submitted = false;
    error: AuthErrorModel = new AuthErrorModel();

    constructor(
        private _fb: FormBuilder,
        private organizationService: OrganizationService,
        private globalService: GlobalService,
        private messageService: MessageService,
        public dialog: MatDialog
    ) {
        this.clientForm = this._fb.group({
            orgName: ["", Validators.compose([Validators.required])],
        });
    }

    // convenience getter for easy access to form fields
    get f() {
        return this.clientForm.controls;
    }

    ngOnInit() {
        this.globalService.goal.pipe(takeUntil(this.componentDestroyed$)).subscribe((res) => {
            if (res.flag === "client") {
                this.client.id = res.id;
            } else {
                this.client = res;
            }
        });
    }

    // Organization Validation
    validateOrgName() {
        this.organizationService
            .validateOrgName(this.client.orgName)
            .subscribe((result) => {
                if (result.status === 200) {
                    this.error.domainCode = 200;
                    this.error.domain = true;
                    this.error.domainValue = result.details;
                } else if (result.status === 400) {
                    this.error.domain = true;
                    this.error.domainCode = 400;
                    this.error.domainValue = result.details;
                }
            });
    }

    submit() {
        this.submitted = true;

        if (this.clientForm.invalid) {
            return;
        }

        if (this.client.id) {
            this.organizationService
                .update(this.client.id, this.client)
                .subscribe((result) => {
                    this.messageService.showMessage({
                        timeout: 2000,
                        type: "success",
                        title: "",
                        body: result.details,
                    });
                    this.globalService.changeGoal("Client Saved");
                    this.dialog.closeAll();
                    this.clientForm.reset();
                });
        } else {
            this.organizationService.store(this.client).subscribe((result) => {
                this.messageService.showMessage({
                    timeout: 2000,
                    type: "success",
                    title: "",
                    body: result.details,
                });
                this.globalService.changeGoal("Client Saved");
                this.dialog.closeAll();
                this.clientForm.reset();
            });
        }
    }

    ngOnDestroy() {
        this.componentDestroyed$.next(true);
        this.componentDestroyed$.complete();
    }
}
