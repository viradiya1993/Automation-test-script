import { createReducer, on } from '@ngrx/store';
import { startProgressBar, stopProgressBar } from '@app/store/actions/progress-bar.action';

const _progressBarReducer = createReducer(false,
    on(startProgressBar, () => true),
    on(stopProgressBar, () => false),
);

export function progressBarReducer(state, action) {
    return _progressBarReducer(state, action);
}
