import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { UserRoleModal } from "@shared/models";
import { RegisterService } from "@core/services/";
import { CONFIRM_PASSWORD_TOKEN, FORGOT_PASSWORD_TOKEN, ORGANIZATION_ID, USER_ID, USER_INVITED } from '@shared/configs';

@Component({
    selector: "app-confirm-cmp",
    templateUrl: "./confirm.component.html",
})
export class ConfirmComponent implements OnInit {
    roleId: string;
    userRole: UserRoleModal = new UserRoleModal();
    token = "";

    constructor(
        private router: Router,
        private registerService: RegisterService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.route.queryParams.subscribe((params) => {
            this.token = params.token;
            localStorage.setItem(CONFIRM_PASSWORD_TOKEN, this.token);
            if (params.forgotPassword) {
                localStorage.setItem(FORGOT_PASSWORD_TOKEN, params.forgotPassword.toString());
            }
        });

        this.registerService.confirm(this.token).subscribe(
            (res: any) => {
                if (res.message === "Success" && res.status === 200) {
                    sessionStorage.setItem(ORGANIZATION_ID, res.organizationId);
                    localStorage.setItem(ORGANIZATION_ID, res.organizationId);
                    localStorage.setItem(USER_ID, res.userId);
                    localStorage.setItem(USER_INVITED, res.invited.toString());
                    this.router.navigate(["/auth/password"]);
                } else {
                    this.router.navigate(["/error"]);
                }
            },
            () => {
                this.router.navigate(["/error"]);
            }
        );
    }
}
