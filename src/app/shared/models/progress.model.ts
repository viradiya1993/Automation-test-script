export interface Progress {
    failed: number;
    passed: number;
    skipped: number;
    total?: number;
}