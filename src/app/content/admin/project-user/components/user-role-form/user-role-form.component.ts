import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { toggleResponse } from "@app/core/helpers";
import { ProjectService } from "@app/core/services";
import { Role, UserInfoModel } from "@app/shared/models";
import { ProjectUserService } from "../../services/project-user.service";
import { MessageService } from '@shared/components/message';

@Component({
    selector: "app-user-role-form",
    templateUrl: "./user-role-form.component.html",
    styleUrls: ["./user-role-form.component.scss"],
})
export class UserRoleComponent implements OnInit {
    userRoleForm: FormGroup;
    selectedRole: string;
    submitted = false;

    @Input() user: UserInfoModel;
    @Input() roles: Role[];
    @Output() closeMenu = new EventEmitter();

    constructor(
        private fb: FormBuilder,
        private projectService: ProjectService,
        private projectUserService: ProjectUserService,
        private messageService: MessageService
    ) {
    }

    get f() {
        return this.userRoleForm.controls;
    }

    ngOnInit() {
        if (this.user && this.user.role) {
            this.selectedRole = this.user.role.id;
        }

        this.userRoleForm = this.fb.group({
            roleId: ["", Validators.compose([Validators.required])],
        });

        this.userRoleForm.patchValue({
            roleId: this.user.role.id
        })
    }

    saveEditUserRole() {
        this.submitted = true;

        if (this.userRoleForm.invalid) {
            return;
        }

        this.projectService
            .projectUserRole(this.user.project.id, {
                userId: this.user.id,
                roleId: this.userRoleForm.value.roleId,
            })
            .subscribe((res: any) => {
                this.projectUserService.userRoleAssign(this.user.project.id, [
                    this.user,
                ]);
                toggleResponse(this.messageService, res);
                this.onEditUserRoleCancel();
            });
    }

    onEditUserRoleCancel() {
        this.userRoleForm.reset();
        this.selectedRole = null;
        this.roles = [];
        this.user = null;
        this.closeMenu.emit();
    }

    getRoleNameValue() {

    }
}
