export interface ReleaseFilter {
    releaseId: string;
    offset: number;
    size: number;
    hasFailedTests: boolean;
    noPassedTests: boolean;
    hasSkippedTests: boolean;
}
