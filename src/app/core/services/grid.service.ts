import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Grid } from '@app/shared/models';
import { map } from 'rxjs/operators';
import { Grid_API } from '@core/helpers';
import { AUTH_USER } from '@shared/configs';
import { CommonService } from '@core/services/common.service';

@Injectable({
    providedIn: 'root'
})
export class GridService {

    grids: Grid[] = [];

    grid_api = Grid_API + 'grids';

    constructor(private http: HttpClient, private readonly commonService: CommonService) {
    }

    getGrids(sortColumn = 'name', sortOrder = 'asc', pageNumber = 0, pageSize = 10) {
        return this.http.get(`${this.grid_api}?offset=${pageNumber}&orderBy=${sortOrder}&size=${pageSize}&sortBy=${sortColumn}`)
            .pipe(
                map(res => {
                    return {
                        totalCount: res['totalElements'],
                        data: res["content"] as Grid[]
                    };
                })
            );
    }

    addGrid(grid: Grid) {
        const organizationAndProjectIds = this.commonService.getOrganizationAndProjectIds();
        grid.organizationId = organizationAndProjectIds?.organizationId
        grid.projectId = organizationAndProjectIds?.projectId
        grid.createdBy = JSON.parse(localStorage.getItem(AUTH_USER));
        return this.http.post(this.grid_api, grid).pipe();
    }

    updateGrid(grid: Grid) {
        grid.updatedBy = JSON.parse(localStorage.getItem(AUTH_USER));
        return this.http.put(`${this.grid_api}/${grid.gridId}`, grid).pipe();
    }

    removeGrid(gridId: string) {
        return this.http.delete(`${this.grid_api}/${gridId}`).pipe();
    }

    getPlatforms(gridId: string) {
        return this.http.get<string[]>(`${this.grid_api}/provider/${gridId}/platforms`);
    }

    getBrowsersByPlatform(gridId: string, platform: string) {
        return this.http.get<string[]>(`${this.grid_api}/provider/${gridId}/browsers?platform=${platform}`);
    }
    
    getVersionsByBrowser(gridId: string, platform: string, browser: string) {
        return this.http.get<string[]>(`${this.grid_api}/provider/${gridId}/browserVersions?browser=${browser}&platform=${platform}`);
    }

    getResolutions(gridId: string, platform: string){
        return this.http.get<string[]>(`${this.grid_api}/provider/${gridId}/resolutions?platform=${platform}`);
    }
}
