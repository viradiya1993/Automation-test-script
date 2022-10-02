import { Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, ViewChild, } from "@angular/core";
import { FormBuilder, FormGroup, NgModel, Validators } from "@angular/forms";
import { COMMA, ENTER, SPACE, TAB } from "@angular/cdk/keycodes";
import { Project, Role, UserInfoModel } from "@app/shared/models";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { CommonService, RegisterService, RoleService } from "@core/services";
import { AUTH_USER } from "@app/shared/configs";
import { AssignableRole } from "@app/content/onboard/onboard.model";
import { MatAutocomplete } from "@angular/material/autocomplete";
import { ProjectUserService } from "../../services/project-user.service";
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MessageService } from '@shared/components/message';

@Component({
    selector: "app-user-form",
    templateUrl: "./user-form.component.html",
    styleUrls: ["./user-form.component.scss"],
})
export class UserFormComponent implements OnInit {
    userForm: FormGroup;
    separatorKeysCodes: number[] = [ENTER, COMMA, SPACE, TAB];
    organizationId = null;
    emailPattern = RegExp("^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$");
    invitations: InviteUser[] = [];
    submitted = false;
    emails: string[] = [];
    filteredEmails: Observable<string[]>;
    visible = true;
    selectable = true;
    removable = true;
    public roles: AssignableRole[] = [];

    @Input() userAddError = "";
    @Input() user: UserInfoModel = null;

    @Output() userAddErrorChange = new EventEmitter();
    @Output() closeMenu = new EventEmitter();

    @ViewChild("emailInput") emailInput: ElementRef<HTMLInputElement>;
    @ViewChild("auto") matAutocomplete: MatAutocomplete;

    constructor(
        private _fb: FormBuilder,
        private roleService: RoleService,
        private readonly messageService: MessageService,
        private projectUserService: ProjectUserService,
        private registerService: RegisterService,
        public dialogRef: MatDialogRef<UserFormComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { selectedProject: Project },
        private readonly commonService: CommonService
    ) {
        this.organizationId = this.commonService.getOrganizationAndProjectIds().organizationId;
        this.userForm = this._fb.group({
            emailCtrl: ["", Validators.compose([Validators.email])],
        });
    }

    private static convertToAssignable(roles: Role[]): AssignableRole[] {
        roles = roles
            .filter((item) => item.assignableToProject)
            .sort((a, b) => a.id.localeCompare(b.id));
        return roles.map((item) => ({
            id: item.id,
            roleName: item.roleName,
            description: item.description,
            emailAddresses: [],
            emailInput: "",
        }));
    }

    ngOnInit() {
        const organizationAndProjectIds = this.commonService.getOrganizationAndProjectIds();
        this.organizationId = organizationAndProjectIds?.organizationId
        if (!this.roles.length) {
            this.getRoles();
        }
    }

    public onEmailAddressKeydown(
        event: KeyboardEvent,
        addresses: string[],
        emailModel: NgModel
    ): boolean {
        if (event.key === ";" || event.key === ",") {
            this.addEmailFromInput(addresses, emailModel);
            return false;
        }
    }

    public onEmailAddressKeyup(
        event: KeyboardEvent,
        addresses: string[],
        emailModel: NgModel
    ): boolean {
        if (event.code === "Enter" || event.code === "NumpadEnter") {
            this.addEmailFromInput(addresses, emailModel);
            return false;
        }
    }

    public onEmailAddressBlur(addresses: string[], emailModel: NgModel): boolean {
        setTimeout(() => this.addEmailFromInput(addresses, emailModel));
        return true;
    }

    public onEmailSelect({ item }, addresses, emailModel: NgModel) {
        this.addEmailAddress(item, addresses);
        setTimeout(() => emailModel.reset(""));
    }

    public removeEmailAddress(addresses: string[], index: number) {
        this.emails.splice(index, 1);
        addresses.splice(index, 1);
    }

    saveUserInfo() {
        const emailAndRoles = (this.roles || [])
            .filter(
                (item) =>
                    !!(
                        item.hasOwnProperty("emailAddresses") &&
                        item.emailAddresses.length > 0
                    )
            )
            .map((item) => ({
                roleId: item.id,
                emails: item.emailAddresses,
            }));
        if (!emailAndRoles.length) {
            this.messageService.showMessage({
                timeout: 2000,
                type: "error",
                title: "Error",
                body: "Email address is required.",
            });
            return;
        } else {
            this.registerService.multipleUser(emailAndRoles, this.data.selectedProject.id).subscribe((res: any) => {
                this.messageService.showMessage({
                    timeout: 2000,
                    type: "success",
                    title: res?.message || 'All emails are sent',
                });
                this.onUserCancel();
            }, (error => {
                this.messageService.showMessage({
                    timeout: 2000,
                    type: "error",
                    title: "Error",
                    body: "Something went wrong. Exception " + error?.message,
                });
            }))
        }
    }

    onUserCancel() {
        this.emails = [];
        this.userForm.reset();
        this.closeMenu.emit();
        this.dialogRef.close();
    }

    validateEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    private getRoles() {
        this.roleService
            .getAssignList()
            .pipe(map((roles) => UserFormComponent.convertToAssignable(roles)))
            .subscribe((res) => (this.roles = res));
    }

    private addEmailFromInput(addresses: string[], emailModel: NgModel) {
        if (emailModel.valid && emailModel.value.length > 0) {
            this.addEmailAddress(emailModel.value, addresses);
            emailModel.reset("");
        } else if (emailModel.value.length > 0) {
            emailModel.control.markAsTouched();
        } else {
            emailModel.control.markAsUntouched();
        }
    }

    private addEmailAddress(email: string, addresses: string[]) {
        if (!this.validateEmail(email)) {
            if (email.toString().length > 0) {
                this.messageService.showMessage({
                    timeout: 2000,
                    type: "warning",
                    title: "Warning",
                    body: "Invalid email!",
                });
            }
            return;
        }
        const currentUser = localStorage.getItem(AUTH_USER) ? JSON.parse(localStorage.getItem(AUTH_USER)) : null;
        if (currentUser && currentUser.email === email) {
            this.messageService.showMessage({
                timeout: 2000,
                type: "error",
                title: "",
                body: "You can't invite yourself",
            });
            return;
        }
        const emailIndex = this.emails.findIndex((res) => res === email);

        if (email && emailIndex === -1) {
            // api call to check if the email is already registered anywhere in the database
            this.registerService.isValidEmail(email).subscribe((res: any) => {
                if (!!res.status) {
                    this.messageService.showMessage({
                        timeout: 2000,
                        type: "error",
                        title: "",
                        body: "Email already registered in the system",
                    });
                    return;
                } else {
                    addresses.push(email);
                    this.emails.push(email);
                }
            });
        } else {
            this.messageService.showMessage({
                timeout: 2000,
                type: "warning",
                title: "Warning",
                body: "Email address is already exists.",
            });
        }
    }
}

export interface InviteUser {
    email: String;
    organizationId: String;
    userName: String;
    invited: Boolean;
}
