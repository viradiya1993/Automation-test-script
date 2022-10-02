import { SUBSCRIBER } from "@shared/configs";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { UserInfoModel, UserRoleModal } from "@shared/models";
import { CommonService, GlobalService, RegisterService, UserService, } from "@core/services";
import { MessageService } from "@app/shared/components/message/messageService.service";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { existingEmailValidator } from "@app/shared/validators";
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
    selector: "app-user-info-dialog",
    templateUrl: "user-information-dialog.html",
    styleUrls: ["./user-information.component.css"],
})
export class UserInfoDialogComponent implements OnInit, OnDestroy {
    componentDestroyed$: Subject<boolean> = new Subject();

    userInfoForm: FormGroup;
    userInfo: UserInfoModel = new UserInfoModel();
    emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$";
    countryCode = "";
    userRole: UserRoleModal = new UserRoleModal();
    submitted = false;
    organizationId = null;

    constructor(
        private _fb: FormBuilder,
        private commonService: CommonService,
        private registerService: RegisterService,
        private userService: UserService,
        private globalService: GlobalService,
        private messageService: MessageService,
        public dialog: MatDialog,
        public dialogRef: MatDialogRef<any>
    ) {
        this.globalService.goal.pipe(takeUntil(this.componentDestroyed$)).subscribe((res) => {
            if (res.flag === "userInfo") {
                if (res.orgId) {
                    this.organizationId = res.orgId;
                } else {
                    const organizationAndProjectIds = this.commonService.getOrganizationAndProjectIds();
                    this.organizationId = organizationAndProjectIds?.organizationId;
                }
            } else {
                Object.assign(this.userInfo, res);
                if (!res.phone) {
                    this.userInfo.phone = {
                        countryCode: "",
                        phoneNumber: "",
                    };
                }
            }
        });

        this.getCurrencyList();
        // this.getRole();
    }

    // convenience getter for easy access to form fields
    get f() {
        return this.userInfoForm.controls;
    }

    ngOnInit() {
        this.dialogRef.updateSize("60%", "80%");

        if (this.userInfo.userId) {
            this.userInfoForm = this._fb.group({
                email: [""],
                firstName: ["", Validators.required],
                lastName: ["", Validators.required],
                password: [""],
                phone: [""],
                countryCode: ["+91"],
            });
        } else {
            this.userInfoForm = this._fb.group({
                email: [
                    "",
                    Validators.compose([
                        Validators.required,
                        Validators.email,
                        Validators.pattern(this.emailPattern),
                    ]),
                    [existingEmailValidator(this.registerService)],
                ],
                firstName: ["", Validators.required],
                lastName: ["", Validators.required],
                password: ["", Validators.required],
                phone: [""],
                countryCode: ["+91"],
            });
        }
    }

    getCurrencyList() {
        this.commonService.getCurrencyList().subscribe((res) => {
            this.countryCode = res;
        });
    }

    saveUserInfo() {
        this.submitted = true;

        if (this.userInfoForm.invalid) {
            return;
        }

        this.userInfo.phone.countryCode = this.userInfoForm.value.countryCode;
        this.userInfo.phone.phoneNumber = this.userInfoForm.value.phone;
        // this.userInfo.organizationId = this.organizationId;
        // this.userInfo.userName = this.userInfoForm.value.email;

        if (this.userInfo.userId) {
            this.userService
                .update(this.userInfo.userId, this.userInfo)
                .subscribe((result) => {
                    if (result.status <= 300) {
                        this.messageService.showMessage({
                            timeout: 2000,
                            type: "success",
                            title: "",
                            body: result.details,
                        });
                        this.dialog.closeAll();
                    } else {
                        this.messageService.showMessage({
                            timeout: 2000,
                            type: "error",
                            title: "",
                            body: result.message,
                        });
                    }
                });
        } else {
            this.userService.store(this.userInfo).subscribe((result) => {
                if (result.status <= 300) {
                    this.userRole.roleId = SUBSCRIBER;
                    this.userRole.userId = result.id;
                    this.messageService.showMessage({
                        timeout: 2000,
                        type: "success",
                        title: "",
                        body: result.details,
                    });
                    this.dialog.closeAll();
                    this.setUserRole();
                } else {
                    this.messageService.showMessage({
                        timeout: 2000,
                        type: "error",
                        title: "",
                        body: result.message,
                    });
                }
            });
        }
    }

    setUserRole() {
        this.userService.setUserRole(this.userRole).subscribe((res) => {
            if (res) {
                this.globalService.changeGoal("User Saved");
                this.messageService.showMessage({
                    timeout: 2000,
                    type: "success",
                    title: "",
                    body: res.details,
                });
                this.userInfoForm.reset();
            }
        });
    }

    ngOnDestroy() {
        this.componentDestroyed$.next(true);
        this.componentDestroyed$.complete();
    }
}
