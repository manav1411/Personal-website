// Registry of all weekly sessions. To add a week: create weekNN.ts and add it
// to the array below — it will appear on the /learn board automatically.

import week01 from './week01';
import week02 from './week02';
import type { Week } from './types';

export * from './types';

const weeks: Week[] = [week01, week02].sort((a, b) => a.week - b.week);

export default weeks;
