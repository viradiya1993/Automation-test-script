import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgModel } from '@angular/forms';
import { Role } from '@app/shared/models';
import { RegisterService, RoleService } from '@core/services';
import { map } from 'rxjs/operators';
import { AssignableRole } from './../../onboard.model';
import { AUTH_USER } from '@shared/configs';
import { MessageService } from '@shared/components/message';

@Component({
    selector: "app-add-onboard-users",
    templateUrl: "./add-users.component.html",
    styleUrls: ["./add-users.component.scss"]
})

export class AddUsersComponent implements OnInit {
    public submitted = false;
    emails: string[] = [];

    public roles: AssignableRole[] = sessionStorage.getItem('onboard-user-role') ?
        JSON.parse(sessionStorage.getItem('onboard-user-role')) : [];

    @Output() next = new EventEmitter<null>();
    @Output() back = new EventEmitter<null>();
    @Output() skip = new EventEmitter<null>();

    constructor(
        private roleService: RoleService,
        private readonly registerService: RegisterService,
        private readonly messageService: MessageService
    ) {
    }

    private static convertToAssignable(roles: Role[]): AssignableRole[] {
        roles = roles.filter(item => item.assignableToProject).sort((a, b) => a.id.localeCompare(b.id));
        return roles.map(item => ({
            id: item.id,
            roleName: item.roleName,
            description: item.description,
            emailAddresses: [],
            emailInput: ''
        }))
    }

    ngOnInit() {
        if (!this.roles.length) {
            this.getRoles();
        }
    }

    goToProjectInfo() {
        this.back.next();
        sessionStorage.setItem('onboard-user-role', JSON.stringify(this.roles));
    }

    goToAHQAgent() {
        const empty = this.roles.map(item => item.emailAddresses.length === 0).every(item => item === true);
        if (empty) {
            this.messageService.showMessage({
                timeout: 2000,
                type: "error",
                title: "",
                body: "Email fields are empty",
            });
            return;
        }
        this.next.next();
        sessionStorage.setItem('onboard-user-role', JSON.stringify(this.roles));
    }

    /* Email */
    public onEmailAddressKeydown(event: KeyboardEvent, addresses: string[], emailModel: NgModel): boolean {
        if (event.key === ';' || event.key === ',') {
            this.addEmailFromInput(addresses, emailModel);
            return false;
        }
    }

    public onEmailAddressKeyup(event: KeyboardEvent, addresses: string[], emailModel: NgModel): boolean {
        if (event.code === 'Enter' || event.code === 'NumpadEnter') {
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
        setTimeout(() => emailModel.reset(''));
    }

    public removeEmailAddress(addresses: string[], index: number) {
        this.emails.splice(index, 1);
        addresses.splice(index, 1);
    }

    validateEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    private getRoles() {
        this.roleService.getAssignList().pipe(
            map(roles => AddUsersComponent.convertToAssignable(roles))
        ).subscribe(res => this.roles = res);
    }

    private addEmailFromInput(addresses: string[], emailModel: NgModel) {
        if (emailModel.valid && emailModel.value.length > 0) {
            this.addEmailAddress(emailModel.value, addresses);
            emailModel.reset('');
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

