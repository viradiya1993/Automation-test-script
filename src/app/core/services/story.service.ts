import { Injectable } from '@angular/core';
import { Story } from '@app/shared/models';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Story_API } from '@core/helpers';
import { CommonService } from '@core/services/common.service';

@Injectable({
    providedIn: 'root'
})
export class StoryService {
    storyApi: string = Story_API + 'epics';

    constructor(private http: HttpClient, private readonly commonService: CommonService) {
    }

    getStoriesByEpicId(epicId: string) {
        return this.http.get(this.storyApi + '/' + epicId + '/stories/list').pipe(
            map(res => {
                const stories = res as Story[];
                stories.map(story => story.numberOfTestScripts = 12);
                return stories;
            })
        );
    }

    addStory(story: Story) {
        const organizationAndProjectIds = this.commonService.getOrganizationAndProjectIds();
        story.organizationId = organizationAndProjectIds?.organizationId
        story.projectId = organizationAndProjectIds?.projectId;
        return this.http.post(this.storyApi + '/' + story.epicId + '/stories', story).pipe();
    }

    updateStory(story: Story) {
        return this.http.put(this.storyApi + '/' + story.epicId + '/stories/' + story.storyId, story).pipe();
    }

    removeStoryById(epicId: string, storyId: string) {
        return this.http.delete(this.storyApi + '/' + epicId + '/stories/' + storyId).pipe();
    }
}
