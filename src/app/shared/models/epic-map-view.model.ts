import { StoryMapView } from "./story-map-view.model";

export interface EpicMapView {
    epicId: string;
    name: string;
    stories: StoryMapView[];
}