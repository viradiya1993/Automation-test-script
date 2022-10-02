import { tap } from "rxjs/operators";
import { RegisterService, UserService } from "@app/core/services";
import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "@core/services/auth.service";
import { AssignableRole, IOnboardProjectInfo } from "./../onboard.model";
import { MessageService } from '@shared/components/message';

@Component({
    selector: "app-onboarding-cmp",
    templateUrl: "./onboarding.component.html",
    styleUrls: ["./onboarding.component.scss"],
})
export class OnBoardingComponent {
    public layoutName = "project";
    public layoutSubmit = false;

    constructor(
        private router: Router,
        private messageService: MessageService,
        private authService: AuthService,
        private registerService: RegisterService,
        private userService: UserService
    ) {
    }

    private static prepareBody() {
        const projectInfo: IOnboardProjectInfo = sessionStorage.getItem('project-info') ?
            JSON.parse(sessionStorage.getItem('project-info')) : {};
        let emailAndRoles = [];

        let skipRoleSubmit = sessionStorage.getItem('onboard-skip-role') ? sessionStorage.getItem('onboard-skip-role') : false;
        skipRoleSubmit = (skipRoleSubmit === 'true');
        if (!skipRoleSubmit) {
            const roles: AssignableRole[] = sessionStorage.getItem('onboard-user-role') ?
                JSON.parse(sessionStorage.getItem('onboard-user-role')) : [];
            emailAndRoles = roles.filter((item) => !!(item.hasOwnProperty('emailAddresses') && item.emailAddresses.length > 0))
                .map((item) => ({
                    roleId: item.id,
                    emails: item.emailAddresses,
                }))
        }
        return {
            name: projectInfo?.name,
            description: projectInfo?.description,
            emailAndRoles: emailAndRoles,
        };
    }

    public skipToAgent() {
        sessionStorage.setItem('onboard-skip-role', 'true');
        sessionStorage.removeItem('onboard-user-role');
        this.layoutName = 'ahqAgent';
    }

    public goToDashboard() {
        this.submit();
        this.setFirstTimeUser().subscribe(() => {
            ['project-info', 'onboard-user-role', 'onboard-skip-role'].forEach((key) => sessionStorage.removeItem(key));
            this.router.navigate(["/dashboard"]).catch(e => e);
        });
    }

    private submit() {
        const body = OnBoardingComponent.prepareBody();
        this.registerService.onboarding(body).subscribe(
            (result) => {
                if (result.status !== 200) {
                    this.messageService.showMessage({
                        timeout: 2000,
                        type: "error",
                        title: "",
                        body: result.message,
                    });
                }
            },
            (err) => {
                console.error(err);
            }
        );
    }

    private setFirstTimeUser() {
        const user = this.authService.user;
        return this.userService.firstTimeLogin(user.userId).pipe(
            tap(() => {
                user.firstTimeLogin = false;
                this.authService.user = user;
            })
        );
    }
}
