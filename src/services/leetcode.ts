// Server-side helpers for fetching live LeetCode data via the public GraphQL API.
// LeetCode blocks cross-origin browser requests (CORS), so all fetching happens on the
// server (see src/app/api/leetcode/route.ts).

export const DEFAULT_LEETCODE_USERNAME = 'manav141';
export type Difficulty = 'All' | 'Easy' | 'Medium' | 'Hard';

export interface DifficultyCount {
  difficulty: Difficulty;
  count: number;
}

export interface RecentSubmission {
  title: string;
  titleSlug: string;
  timestamp: string;
}

/** Normalised shape returned to the client. */
export interface LeetCodeStats {
  username: string;
  profile: {
    userAvatar: string | null;
    ranking: number | null;
  };
  solved: DifficultyCount[];
  totalQuestions: DifficultyCount[];
  // Map of unix-second (UTC midnight) -> submission count for that day.
  calendar: { submissions: Record<string, number> };
  recent: RecentSubmission[];
}

const LEETCODE_GRAPHQL = 'https://leetcode.com/graphql';

const PROFILE_QUERY = /* GraphQL */ `
  query publicProfile($username: String!, $limit: Int!) {
    matchedUser(username: $username) {
      username
      profile {
        userAvatar
        ranking
      }
      submitStats {
        acSubmissionNum {
          difficulty
          count
        }
      }
      userCalendar {
        submissionCalendar
      }
    }
    allQuestionsCount {
      difficulty
      count
    }
    recentAcSubmissionList(username: $username, limit: $limit) {
      title
      titleSlug
      timestamp
    }
  }
`;

export class LeetCodeError extends Error {
  status: number;
  constructor(message: string, status = 502) {
    super(message);
    this.name = 'LeetCodeError';
    this.status = status;
  }
}

function parseSubmissionCalendar(raw: unknown): Record<string, number> {
  if (typeof raw !== 'string' || raw.length === 0) return {};
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object') {
      return parsed as Record<string, number>;
    }
  } catch {
    // ignore malformed calendar
  }
  return {};
}

// Fetch and normalise a user's public LeetCode profile from the upstream GraphQL API.
export async function getLeetCodeStats(
  username: string = DEFAULT_LEETCODE_USERNAME
): Promise<LeetCodeStats> {
  let res: Response;
  try {
    res = await fetch(LEETCODE_GRAPHQL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // LeetCode requires a Referer to serve the public GraphQL endpoint.
        Referer: 'https://leetcode.com',
        'User-Agent':
          'Mozilla/5.0 (compatible; PersonalWebsite/1.0; +https://manavdodia.com)',
      },
      body: JSON.stringify({
        query: PROFILE_QUERY,
        // 20 is the max LeetCode returns for recentAcSubmissionList.
        variables: { username, limit: 20 },
      }),
      cache: 'no-store',
    });
  } catch (err) {
    throw new LeetCodeError(
      `Failed to reach LeetCode: ${(err as Error).message}`,
      502
    );
  }

  if (!res.ok) {
    throw new LeetCodeError(
      `LeetCode responded with status ${res.status}`,
      res.status === 404 ? 404 : 502
    );
  }

  const json = await res.json();

  if (json.errors) {
    const message =
      json.errors?.[0]?.message ?? 'Unknown error from LeetCode GraphQL';
    throw new LeetCodeError(message, 502);
  }

  const matched = json?.data?.matchedUser;
  if (!matched) {
    throw new LeetCodeError(`No LeetCode user found for "${username}"`, 404);
  }

  return {
    username: matched.username,
    profile: {
      userAvatar: matched.profile?.userAvatar ?? null,
      ranking: matched.profile?.ranking ?? null,
    },
    solved: matched.submitStats?.acSubmissionNum ?? [],
    totalQuestions: json?.data?.allQuestionsCount ?? [],
    calendar: {
      submissions: parseSubmissionCalendar(
        matched.userCalendar?.submissionCalendar
      ),
    },
    recent: json?.data?.recentAcSubmissionList ?? [],
  };
}
