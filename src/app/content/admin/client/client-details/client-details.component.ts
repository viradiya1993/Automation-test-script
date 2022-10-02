import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { GlobalService } from "@core/services/";
import { OrganizationModal } from "@app/shared/models";
import { COMPANY_DETAIL } from '@shared/configs';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
    selector: "app-client-detail",
    templateUrl: "./client-details.component.html",
})
export class ClientDetailComponent implements OnInit, OnDestroy {
    componentDestroyed$: Subject<boolean> = new Subject();

    linear: true;
    companyInfo: OrganizationModal = new OrganizationModal();

    constructor(
        private globalService: GlobalService,
        public route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.globalService.changeGoal("Client Detail");
        this.route.paramMap.pipe(takeUntil(this.componentDestroyed$)).subscribe((params) => {
            this.companyInfo.id = params.get("id");
            const companyDetail = JSON.parse(localStorage.getItem(COMPANY_DETAIL));
            this.companyInfo.orgName = companyDetail.orgName;
        });
    }

    ngOnDestroy() {
        this.componentDestroyed$.next(true);
        this.componentDestroyed$.complete();
    }
}
