// mainML.ts
import fs from "fs";
import path from "path";
import { TfIdf } from "natural";
import cosineDistance from "ml-distance/distances/cosine";
import { categoryKeywords, categoryExpectedTimes, categorySkillWeights } from "../MLData/cata";

// -------- Types --------

export interface RawTask {
  text: string;
  timeTaken?: number;
  checked?: boolean;
  difficulty?: number;
}

export interface RawGoal {
  title: string;
  timeTaken?: number;
  workoutCompleted?: boolean;
  difficulty?: number;
}

export interface User {
  id: string;
  tasks?: RawTask[];
  goals?: RawGoal[];
  streak_days?: number;
  Country?: string;
  time_zone?: string;

  // will be filled during processing:
  norm_tasks?: NormItem[];
  norm_goals?: NormItem[];
  success_rate?: number;
  completion_factor?: number;
  avg_skill?: number;
  avg_task_time?: number;
  category_distribution?: Record<string, number>;
  openness?: number;
  interest_vector?: number[];
  consistency?: number;
  pace?: number;
  feature_vector?: number[];
}

export interface NormItem {
  title: string;
  time_taken: number;
  completed: boolean;
  category?: string;
  difficulty?: number;
}

export interface RunUsersResult {
  user_ids: string[];
  feature_vectors: number[][];
  similarity_matrix: number[][];
  categories: Record<string, string[]>;
  best_connection: { pair: [string | null, string | null]; similarity: number };
  worst_connection: { pair: [string | null, string | null]; similarity: number };
  best_to_worst: Record<string, { mac: string; score: number }[]>;
}

// -------- Small helpers --------

function mean(arr: number[]): number {
  if (!arr.length) return 0;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function cosineSimilarity(a: number[], b: number[]): number {
  // ml-distance cosine is actually a distance (0 = same, 1 = orthogonal).
  // We want similarity, so: sim = 1 - dist
  const dist = cosineDistance(a, b);
  return 1 - dist;
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

// -------- Expected time history persistence --------

const EXPECTED_TIMES_PATH = path.join(__dirname, "expected_times_history.json");

type ExpectedTimesHistory = Record<string, number>; // key = `${cat}|${diff}`

function loadExpectedTimesHistory(): ExpectedTimesHistory {
  try {
    const raw = fs.readFileSync(EXPECTED_TIMES_PATH, "utf8");
    return JSON.parse(raw) as ExpectedTimesHistory;
  } catch {
    return {};
  }
}

function saveExpectedTimesHistory(history: ExpectedTimesHistory) {
  try {
    fs.writeFileSync(EXPECTED_TIMES_PATH, JSON.stringify(history, null, 2), "utf8");
  } catch {
    // ignore write errors in this context
  }
}

function keyCatDiff(cat: string, diff: number): string {
  return `${cat}|${diff}`;
}

// -------- Main run(users) algorithm --------

export function runUsers(users: User[]): RunUsersResult {
  // --- Flatten category keywords ---
  const flatCategoryKeywords: Record<string, string[]> = {};
  for (const [cat, subcats] of Object.entries(categoryKeywords)) {
    const allKeywords: string[] = [];
    for (const kws of Object.values(subcats)) {
      allKeywords.push(...kws);
    }
    flatCategoryKeywords[cat] = allKeywords;
  }

  // --- Normalize tasks/goals ---
  function normalizeItem(item: RawTask | RawGoal, isGoal = false): NormItem {
    if (isGoal) {
      const goal = item as RawGoal;
      return {
        title: goal.title,
        time_taken: goal.timeTaken ?? 0,
        completed: goal.workoutCompleted ?? false,
      };
    } else {
      const task = item as RawTask;
      return {
        title: task.text,
        time_taken: task.timeTaken ?? 0,
        completed: task.checked ?? false,
      };
    }
  }

  for (const user of users) {
    user.norm_tasks = (user.tasks ?? []).map((t) => normalizeItem(t, false));
    user.norm_goals = (user.goals ?? []).map((g) => normalizeItem(g, true));
  }

  // --- Category vectorization (TF-IDF) ---
  const categoryDocs: Record<string, string> = {};
  for (const [cat, keywords] of Object.entries(flatCategoryKeywords)) {
    categoryDocs[cat] = keywords.join(" ");
  }

  const tfidfCategories = new TfIdf();
  const categoryNames = Object.keys(categoryDocs);
  categoryNames.forEach((cat) => {
    tfidfCategories.addDocument(categoryDocs[cat]); // index matches categoryNames
  });

  function docVector(tfidf: any, index: number, vocab: string[]): number[] {
    const vec = new Array(vocab.length).fill(0);
    vocab.forEach((term, i) => {
      vec[i] = tfidf.tfidf(term, index);
    });
    return vec;
  }

  const vocabSet = new Set<string>();
  categoryNames.forEach((_, idx) => {
    tfidfCategories.listTerms(idx).forEach((t: any) => vocabSet.add(t.term));
  });
  const vocab = Array.from(vocabSet);
  const categoryVectors = categoryNames.map((_, idx) =>
    docVector(tfidfCategories, idx, vocab)
  );

  function autoAssignCategory(title: string): string {
    const tfidfTitle = new TfIdf();
    tfidfTitle.addDocument(title);

    // build vector in same vocabulary
    const titleVec = vocab.map((term) => tfidfTitle.tfidf(term, 0));
    let bestIdx = 0;
    let bestSim = -Infinity;
    categoryVectors.forEach((catVec, idx) => {
      const sim = cosineSimilarity(titleVec, catVec);
      if (sim > bestSim) {
        bestSim = sim;
        bestIdx = idx;
      }
    });
    return categoryNames[bestIdx] ?? "other";
  }

  for (const user of users) {
    const items = [...(user.norm_tasks ?? []), ...(user.norm_goals ?? [])];
    for (const t of items) {
      t.category = autoAssignCategory(t.title);
    }
  }

  // --- Expected time history ---
  const expectedTimesHistory = loadExpectedTimesHistory();

  function expectedTimeForItem(item: NormItem & { difficulty?: number }, weight_history = 0.7): number {
    const cat = item.category ?? "other";
    const rawDiff = item.difficulty ?? 3;
    const diff = Math.round(Math.max(1, Math.min(5, rawDiff)));
    const manual_time =
      categoryExpectedTimes[cat]?.[diff] ??
      categoryExpectedTimes["other"]?.[diff] ??
      30;
    const key = keyCatDiff(cat, diff);
    const history_time = expectedTimesHistory[key] ?? manual_time;
    return weight_history * history_time + (1 - weight_history) * manual_time;
  }

  // --- Predict difficulty ---
  function predictDifficulty(
    item: NormItem & { difficulty?: number; category?: string; time_taken: number },
    user: User
  ): number {
    const time = item.time_taken ?? 0;
    const expected = expectedTimeForItem(item, 0.0);
    let base_diff = time / Math.max(expected, 1);
    const completion_factor = user.completion_factor ?? 1;
    base_diff *= 1 / Math.max(completion_factor, 0.1);

    let adjustment = 1.0;
    const streak_days = user.streak_days ?? 0;
    const success_rate = user.success_rate ?? 0;

    adjustment *= 1 - Math.min(streak_days / 30, 0.3);
    adjustment *= 1 - Math.min(success_rate, 0.3);

    const difficulty = base_diff * adjustment;
    return Math.min(Math.max(difficulty, 1), 5);
  }

  // --- Skill score ---
  function skillScore(item: NormItem & { difficulty?: number }): number {
    const time = item.time_taken || 1;
    const difficulty = item.difficulty ?? 1;
    return difficulty / Math.max(time, 1);
  }

  // --- Compute basic user stats (success_rate, completion_factor initial) ---
  for (const user of users) {
    const items = [...(user.norm_tasks ?? []), ...(user.norm_goals ?? [])];
    const completedCount = items.filter((i) => i.completed).length;
    user.success_rate = items.length ? completedCount / items.length : 0;
    user.completion_factor = 1.0;
  }

  // --- First pass difficulty ---
  for (const user of users) {
    (user.norm_tasks ?? []).forEach((t) => {
      t.difficulty = predictDifficulty(t, user);
    });
    (user.norm_goals ?? []).forEach((g) => {
      g.difficulty = predictDifficulty(g, user);
    });
  }

  // --- Build expected_times_history from history ---
  const history: { category: string; difficulty: number; time_taken: number }[] = [];
  for (const user of users) {
    const items = [...(user.norm_tasks ?? []), ...(user.norm_goals ?? [])];
    for (const t of items) {
      const cat = t.category ?? "other";
      const diff = Math.round(t.difficulty ?? 3);
      history.push({
        category: cat,
        difficulty: diff,
        time_taken: t.time_taken ?? 0,
      });
    }
  }

  const default_time = 30;
  const categoriesSet = new Set(history.map((h) => h.category));
  for (const cat of categoriesSet) {
    for (let diff = 1; diff <= 5; diff++) {
      const times = history
        .filter((h) => h.category === cat && h.difficulty === diff)
        .map((h) => h.time_taken);
      const key = keyCatDiff(cat, diff);
      if (times.length) {
        expectedTimesHistory[key] = mean(times);
      } else {
        expectedTimesHistory[key] =
          categoryExpectedTimes[cat]?.[diff] ??
          categoryExpectedTimes["other"]?.[diff] ??
          default_time;
      }
    }
  }

  saveExpectedTimesHistory(expectedTimesHistory);

  // --- Second pass difficulty ---
  for (const user of users) {
    (user.norm_tasks ?? []).forEach((t) => {
      t.difficulty = predictDifficulty(t, user);
    });
    (user.norm_goals ?? []).forEach((g) => {
      g.difficulty = predictDifficulty(g, user);
    });
  }

  // --- Build interest vectors using TF-IDF on categories ---
  const userCategoryDocs = users.map((u) => {
    const items = [...(u.norm_tasks ?? []), ...(u.norm_goals ?? [])];
    return items.map((i) => i.category ?? "other").join(" ");
  });

  const tfidfUserCats = new TfIdf();
  userCategoryDocs.forEach((doc) => tfidfUserCats.addDocument(doc));

  const userVocabSet = new Set<string>();
  userCategoryDocs.forEach((_, idx) => {
    tfidfUserCats.listTerms(idx).forEach((t: any) => userVocabSet.add(t.term));
  });
  const userVocab = Array.from(userVocabSet);

  function buildInterestVector(userIdx: number): number[] {
    return userVocab.map((term) => tfidfUserCats.tfidf(term, userIdx));
  }

  const allCategories = userVocab; // used just for openness denominator

  // --- Compute features ---
  users.forEach((user, idx) => {
    const items = [...(user.norm_tasks ?? []), ...(user.norm_goals ?? [])];
    const expected_times = items.map((i) => expectedTimeForItem(i));
    const actual_times = items.map((i) => i.time_taken ?? 0);

    user.completion_factor = items.length
      ? mean(
          expected_times.map((e, i) => e / Math.max(actual_times[i] ?? 1, 1))
        )
      : 1;

    user.avg_skill = items.length ? mean(items.map((i) => skillScore(i))) : 0;
    user.avg_task_time = items.length ? mean(actual_times) : 0;

    const categories = items.map((i) => i.category ?? "other");
    const catDist: Record<string, number> = {};
    if (categories.length) {
      const total = categories.length;
      for (const cat of new Set(categories)) {
        catDist[cat] = categories.filter((c) => c === cat).length / total;
      }
    }
    user.category_distribution = catDist;
    user.openness = categories.length ? new Set(categories).size / allCategories.length : 0;
    user.interest_vector = buildInterestVector(idx);
    user.consistency = (user.streak_days ?? 0) / 7;

    const totalTime = actual_times.reduce((a, b) => a + b, 0);
    user.pace = items.length / Math.max(totalTime, 1);

    const baseFeatures = [
      user.avg_skill ?? 0,
      user.success_rate ?? 0,
      user.completion_factor ?? 0,
      user.avg_task_time ?? 0,
      user.consistency ?? 0,
      user.pace ?? 0,
      user.openness ?? 0,
    ];

    user.feature_vector = [...baseFeatures, ...(user.interest_vector ?? [])];
  });

  // --- Dynamic skill weighting ---
  for (const cat of Object.keys(flatCategoryKeywords)) {
    const catSkills: number[] = [];
    for (const u of users) {
      const items = [...(u.norm_tasks ?? []), ...(u.norm_goals ?? [])];
      for (const i of items) {
        if (i.category === cat) {
          const time = i.time_taken || 1;
          const difficulty = i.difficulty ?? 1;
          catSkills.push(difficulty / Math.max(time, 1));
        }
      }
    }
    categorySkillWeights[cat] = catSkills.length ? mean(catSkills) : 1.0;
  }

  // --- Weights ---
  const weights = {
    skill: 0.2,
    success_rate: 0.1,
    completion_factor: 0.15,
    avg_task_time: 0.05,
    consistency: 0.15,
    pace: 0.1,
    openness: 0.05,
    interests: 0.2,
  };

  function applyWeights(
    userVector: number[],
    nInterestFeatures: number,
    mainCat: string = "other"
  ): number[] {
    const w = [
      weights.skill * (categorySkillWeights[mainCat] ?? 1.0),
      weights.success_rate,
      weights.completion_factor,
      weights.avg_task_time,
      weights.consistency,
      weights.pace,
      weights.openness,
      ...Array(nInterestFeatures).fill(weights.interests),
    ];
    return userVector.map((v, i) => v * (w[i] ?? 1));
  }

  // --- Location similarity ---
  function buildLocationMatrix(us: User[]): number[][] {
    const n = us.length;
    const matrix: number[][] = Array.from({ length: n }, () =>
      Array(n).fill(0)
    );
    const countries = us.map((u) => u.Country);
    const timezones = us.map((u) => u.time_zone);

    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (i === j) {
          matrix[i][j] = 1;
        } else if (timezones[i] && timezones[i] === timezones[j]) {
          matrix[i][j] = countries[i] === countries[j] ? 1.0 : 0.8;
        } else {
          matrix[i][j] = 0.3;
        }
      }
    }
    return matrix;
  }

  const locationMatrix = buildLocationMatrix(users);

  // --- MinMax scaling + weighting ---
  const nInterestFeatures = users[0]?.interest_vector?.length ?? 0;
  const weightedVectors = users.map((u) => {
    const items = [...(u.norm_tasks ?? []), ...(u.norm_goals ?? [])];
    let mainCat = "other";
    if (items.length) {
      const cats = items.map((i) => i.category ?? "other");
      const counts: Record<string, number> = {};
      for (const c of cats) counts[c] = (counts[c] ?? 0) + 1;
      mainCat = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
    }
    return applyWeights(u.feature_vector ?? [], nInterestFeatures, mainCat);
  });

  const weightedVectorsScaled = minMaxScale(weightedVectors);

  // similarity matrix
  const nUsers = users.length;
  const similarityMatrix: number[][] = Array.from({ length: nUsers }, () =>
    Array(nUsers).fill(0)
  );
  for (let i = 0; i < nUsers; i++) {
    for (let j = 0; j < nUsers; j++) {
      similarityMatrix[i][j] = cosineSimilarity(
        weightedVectorsScaled[i],
        weightedVectorsScaled[j]
      );
    }
  }

  const locationWeight = 0.2;
  const combinedSimilarity: number[][] = similarityMatrix.map(
    (row, i) =>
      row.map(
        (val, j) => 0.8 * val + locationWeight * locationMatrix[i][j]
      )
  );

  const user_ids = users.map((u) => u.id);
  let best_pair: [string | null, string | null] = [null, null];
  let best_value = -1;
  let worst_pair: [string | null, string | null] = [null, null];
  let worst_value = 2;

  const col_w = 10;

  // --- Debug prints to stderr ---
  console.error("\n=== Auto-Assigned Categories & Predicted Difficulties ===");
  for (const user of users) {
    const items = [...(user.norm_tasks ?? []), ...(user.norm_goals ?? [])];
    for (const t of items) {
      const cat = t.category ?? "other";
      const diff = t.difficulty ?? 1;
      const expected = expectedTimeForItem(t);
      console.error(
        `User ${user.id} -> ${t.title} -> Category: ${cat} -> Difficulty: ${diff.toFixed(
          2
        )} -> Expected time: ${expected.toFixed(1)} min`
      );
    }
    console.error(`Category distribution: ${JSON.stringify(user.category_distribution || {})}`);
    console.error(`Openness: ${(user.openness ?? 0).toFixed(2)}\n`);
  }

  console.error("\n=== Combined Similarity Matrix (Skill + Location) ===");
  process.stderr.write("".padEnd(col_w));
  for (const uid of user_ids) {
    process.stderr.write(uid.toString().padStart(col_w));
  }
  process.stderr.write("\n");
  for (let i = 0; i < user_ids.length; i++) {
    const uid = user_ids[i];
    process.stderr.write(uid.toString().padStart(col_w));
    for (let j = 0; j < user_ids.length; j++) {
      if (j <= i) {
        process.stderr.write("".padEnd(col_w));
      } else {
        const val = combinedSimilarity[i][j];
        process.stderr.write(val.toFixed(3).padStart(col_w));
        if (val > best_value) {
          best_value = val;
          best_pair = [user_ids[i], user_ids[j]];
        }
        if (val < worst_value) {
          worst_value = val;
          worst_pair = [user_ids[i], user_ids[j]];
        }
      }
    }
    process.stderr.write("\n");
  }

  console.error(
    `\nBest connection: ${best_pair} -> similarity ${best_value.toFixed(3)}`
  );
  console.error(
    `Worst connection: ${worst_pair} -> similarity ${worst_value.toFixed(3)}`
  );

  // --- Best-to-worst list per user ---
  const best_to_worst: Record<string, { mac: string; score: number }[]> = {};
  for (let i = 0; i < user_ids.length; i++) {
    const user_id = user_ids[i];
    const scores: { mac: string; score: number }[] = [];
    for (let j = 0; j < user_ids.length; j++) {
      if (i === j) continue;
      scores.push({ mac: user_ids[j], score: combinedSimilarity[i][j] });
    }
    best_to_worst[user_id] = scores.sort((a, b) => b.score - a.score);
  }

  console.error("\n--- Best to Worst per User ---");
  for (const [uid, suggestions] of Object.entries(best_to_worst)) {
    console.error(uid + ":");
    suggestions.slice(0, 5).forEach((s) => {
      console.error(`  → ${s.mac} (${s.score.toFixed(3)})`);
    });
  }

  return {
    user_ids,
    feature_vectors: users.map((u) => u.feature_vector ?? []),
    similarity_matrix: combinedSimilarity,
    categories: Object.fromEntries(
      users.map((u) => [
        u.id,
        [...(u.norm_tasks ?? []), ...(u.norm_goals ?? [])].map(
          (t) => t.category ?? "other"
        ),
      ])
    ),
    best_connection: { pair: best_pair, similarity: best_value },
    worst_connection: { pair: worst_pair, similarity: worst_value },
    best_to_worst,
  };
}

// -------- CLI behavior (stdin/stdout) --------

if (require.main === module) {
  const chunks: Buffer[] = [];
  process.stdin.on("data", (chunk) => chunks.push(chunk));
  process.stdin.on("end", () => {
    try {
      const raw = Buffer.concat(chunks).toString("utf8");
      const users: User[] = JSON.parse(raw);
      if (!users || !users.length) {
        console.log(JSON.stringify({ best_to_worst: {} }));
        process.exit(0);
      }
      const results = runUsers(users);
      console.error("Starting algorithm...");
      console.log(JSON.stringify(results));
    } catch {
      console.log(JSON.stringify({ best_to_worst: {} }));
      process.exit(0);
    }
  });
}
