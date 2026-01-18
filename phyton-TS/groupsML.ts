// groupsML.ts
import { TfIdf } from "natural"; // not strictly needed here, but consistent with project
import cosineDistance from "ml-distance/distances/cosine";
import { runUsers, User, RunUsersResult } from "./mainML";

function cosineSimilarity(a: number[], b: number[]): number {
  const dist = cosineDistance(a, b);
  return 1 - dist;
}

export interface Group {
  id: string;
  members: string[];
}

export interface GroupInput {
  users: User[];
  groups: Group[];
}

export interface RunGroupsResult {
  best_to_worst_groups: Record<string, { group: string; score: number }[]>;
  similarity_matrix: number[][];
  group_ids: string[];
}

function minMaxScale(matrix: number[][]): number[][] {
  if (matrix.length === 0) return [];
  const nFeatures = matrix[0].length;
  const mins = Array(nFeatures).fill(Infinity);
  const maxs = Array(nFeatures).fill(-Infinity);

  for (const row of matrix) {
    row.forEach((v, j) => {
      if (v < mins[j]) mins[j] = v;
      if (v > maxs[j]) maxs[j] = v;
    });
  }

  return matrix.map((row) =>
    row.map((v, j) => {
      const range = maxs[j] - mins[j];
      return range === 0 ? 0 : (v - mins[j]) / range;
    })
  );
}

export function runGroups(data: GroupInput): RunGroupsResult {
  const { users, groups } = data;

  // 1️⃣ Run user ML to get feature vectors
  const userResults: RunUsersResult = runUsers(users);
  const user_ids = userResults.user_ids;
  const user_vectors_list = userResults.feature_vectors.map((vec) => [...vec]);

  // Build group vectors (mean of member vectors)
  const group_vectors: Record<string, number[]> = {};
  for (const g of groups) {
    const member_vecs: number[][] = [];
    for (let i = 0; i < user_ids.length; i++) {
      const uid = user_ids[i];
      if (g.members.includes(uid)) {
        member_vecs.push(user_vectors_list[i]);
      }
    }
    if (member_vecs.length) {
      const nFeatures = member_vecs[0].length;
      const meanVec = Array(nFeatures).fill(0);
      for (const v of member_vecs) {
        for (let j = 0; j < nFeatures; j++) {
          meanVec[j] += v[j];
        }
      }
      for (let j = 0; j < nFeatures; j++) {
        meanVec[j] /= member_vecs.length;
      }
      group_vectors[g.id] = meanVec;
    } else {
      // if group empty, zero vector
      group_vectors[g.id] = Array(user_vectors_list[0].length).fill(0);
    }
  }

  // Scale users and groups separately
  const scaled_users = minMaxScale(user_vectors_list);
  const groupVectorsArr = Object.values(group_vectors);
  const scaled_groups = minMaxScale(groupVectorsArr);

  // Compute similarity users x groups
  const sim_matrix: number[][] = Array.from({ length: scaled_users.length }, () =>
    Array(scaled_groups.length).fill(0)
  );

  for (let i = 0; i < scaled_users.length; i++) {
    for (let j = 0; j < scaled_groups.length; j++) {
      sim_matrix[i][j] = cosineSimilarity(scaled_users[i], scaled_groups[j]);
    }
  }

  const group_ids = Object.keys(group_vectors);

  // Map best-to-worst groups for each user
  const best_to_worst_groups: Record<
    string,
    { group: string; score: number }[]
  > = {};

  for (let i = 0; i < user_ids.length; i++) {
    const uid = user_ids[i];
    if (i >= sim_matrix.length) continue; // safety
    const scores: { group: string; score: number }[] = [];
    for (let j = 0; j < group_ids.length; j++) {
      scores.push({ group: group_ids[j], score: sim_matrix[i][j] });
    }
    best_to_worst_groups[uid] = scores.sort((a, b) => b.score - a.score);
  }

  // Debug output (stderr)
  console.error("\n=== Best to Worst Groups per User ===");
  for (const [uid, suggestions] of Object.entries(best_to_worst_groups)) {
    console.error(`\nUser ${uid}:`);
    suggestions.forEach((s, idx) => {
      console.error(
        `  ${String(idx + 1).padStart(2)}. ${s.group.padEnd(20)} → score: ${s.score.toFixed(
          3
        )}`
      );
    });
  }

  return {
    best_to_worst_groups,
    similarity_matrix: sim_matrix,
    group_ids,
  };
}

// -------- CLI behavior (stdin/stdout) --------

if (require.main === module) {
  const chunks: Buffer[] = [];
  process.stdin.on("data", (chunk) => chunks.push(chunk));
  process.stdin.on("end", () => {
    try {
      const raw = Buffer.concat(chunks).toString("utf8");
      const data: GroupInput = JSON.parse(raw);
      if (!data.users || !data.users.length || !data.groups || !data.groups.length) {
        console.log(JSON.stringify({ best_to_worst_groups: {} }));
        process.exit(0);
      }
      const results = runGroups(data);
      console.error("Starting algorithm...");
      console.log(JSON.stringify(results));
    } catch {
      console.log(JSON.stringify({ best_to_worst_groups: {} }));
      process.exit(0);
    }
  });
}
