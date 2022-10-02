import { Injectable } from "@angular/core";
import { Epic, EpicMapView } from "@app/shared/models";
import { map } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { Epic_API } from "@core/helpers";
import { CommonService } from '@core/services/common.service';

@Injectable({
    providedIn: "root",
})
export class EpicService {
    epicApi: string = Epic_API + "epics";

    constructor(private http: HttpClient, private readonly commonService: CommonService) {
    }

    searchEpics(searchText: string) {
        return this.http
            .get(`${this.epicApi}/list/search?search=${searchText}`)
            .pipe(
                map((res: any) => {
                    return {
                        totalCount: res.length,
                        data: res as Epic[],
                    };
                })
            );
    }

    getEpics(name = "", pageNumber = -1, pageSize = -1) {
        return this.http
            .post(`${this.epicApi}/list`, {
                epicName: name,
                offset: pageNumber,
                size: pageSize,
            })
            .pipe(
                map((res) => {
                    return {
                        totalCount: res["totalElements"],
                        data: res["content"] as Epic[],
                    };
                })
            );
    }

    getEpicsByName(epicName = "", storyName = "") {
        return this.http
            .post<EpicMapView[]>(`${this.epicApi}/search`, {
                epicName: epicName,
                storyName: storyName,
            })
            .pipe();
    }

    addEpic(epic: Epic) {
        const organizationAndProjectIds = this.commonService.getOrganizationAndProjectIds();
        epic.organizationId = organizationAndProjectIds?.organizationId;
        epic.projectId = organizationAndProjectIds?.projectId;
        return this.http.post(this.epicApi, epic).pipe();
    }

    updateEpic(epic: Epic) {
        return this.http.put(this.epicApi + "/" + epic.epicId, epic).pipe();
    }

    removeEpicById(epicId: string) {
        return this.http.delete(this.epicApi + "/" + epicId).pipe();
    }
}
