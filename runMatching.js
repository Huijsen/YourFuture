import { categoryKeywords, expectedTimes, skillWeights } from "./cata.js";

// --- Math helpers ---
function cosineSimilarity(a, b) {
  const dot = a.reduce((s, v, i) => s + v * b[i], 0);
  const magA = Math.sqrt(a.reduce((s, v) => s + v * v, 0));
  const magB = Math.sqrt(b.reduce((s, v) => s + v * v, 0));
  return magA && magB ? dot / (magA * magB) : 0;
}

function minMaxScale(vectors) {
  const cols = vectors[0].length;
  const min = Array(cols).fill(Infinity);
  const max = Array(cols).fill(-Infinity);

  vectors.forEach(v =>
    v.forEach((x, i) => {
      min[i] = Math.min(min[i], x);
      max[i] = Math.max(max[i], x);
    })
  );

  return vectors.map(v =>
    v.map((x, i) => (max[i] === min[i] ? 0 : (x - min[i]) / (max[i] - min[i])))
  );
}

// --- Category detection ---
function detectCategory(text = "") {
  const t = text.toLowerCase();
  for (const [cat, words] of Object.entries(categoryKeywords)) {
    if (words.some(w => t.includes(w))) return cat;
  }
  return "other";
}

// --- Difficulty & skill ---
function predictDifficulty(item, user) {
  const time = item.timeTaken || 0;
  const expected = item.expectedTime || 30;
  let diff = time / Math.max(expected, 1);

  diff *= 1 - Math.min((user.streakDays || 0) / 30, 0.3);
  diff *= 1 - Math.min(user.successRate || 0, 0.3);

  return Math.min(Math.max(diff, 1), 5);
}

function skillScore(item) {
  const weight = skillWeights[item.category] || 1;
  return weight * (item.difficulty || 1) / Math.max(item.timeTaken || 1, 1);
}

// --- Feature building ---
function buildInterestVector(user, keywords) {
  const items = [...(user.tasks || []), ...(user.goals || [])];
  return keywords.map(k =>
    items.reduce((s, t) => s + ((t.title || t.text || "").toLowerCase().includes(k) ? 1 : 0), 0)
  );
}

function buildFeatureVector(user, interestVector) {
  const items = [...(user.tasks || []), ...(user.goals || [])];
  const total = items.length || 1;

  const completed = items.filter(t => t.checked || t.workoutCompleted).length;
  const avgTime = items.reduce((s, t) => s + (t.timeTaken || 0), 0) / total;
  const avgSkill = items.reduce((s, t) => s + skillScore(t), 0) / total;

  return [
    avgSkill,
    completed / total,
    avgTime,
    total / Math.max(items.reduce((s, t) => s + (t.timeTaken || 0), 0), 1),
    (user.streakDays || 0) / 7,
    new Set(items.map(t => t.category)).size / 10,
    ...interestVector
  ];
}

// --- Location ---
function buildLocationMatrix(users) {
  return users.map((u, i) =>
    users.map((v, j) =>
      i === j ? 1 :
      u.time_zone === v.time_zone
        ? (u.Country === v.Country ? 1 : 0.8)
        : 0.3
    )
  );
}

// --- Main ---
export function runMatching(users, groups) {
  const titles = users.flatMap(u =>
    [...(u.tasks || []), ...(u.goals || [])].map(t => t.title || t.text || "")
  );
  const keywords = [...new Set(titles.join(" ").toLowerCase().split(/\s+/))];

  users.forEach(u => {
    const items = [...(u.tasks || []), ...(u.goals || [])];
    items.forEach(t => {
      t.category = detectCategory(t.title || t.text);
      t.expectedTime = expectedTimes[t.category][2];
    });

    u.successRate = items.filter(t => t.checked || t.workoutCompleted).length / Math.max(items.length, 1);
    u.interestVector = buildInterestVector(u, keywords);

    items.forEach(t => (t.difficulty = predictDifficulty(t, u)));
  });

  const userVectors = users.map(u => buildFeatureVector(u, u.interestVector));
  const scaledUsers = minMaxScale(userVectors);

  const groupVectors = groups.map(g => {
    const members = g.members.map(id => scaledUsers[users.findIndex(u => u.id === id)]).filter(Boolean);
    return members.length
      ? members[0].map((_, i) => members.reduce((s, v) => s + v[i], 0) / members.length)
      : Array(scaledUsers[0].length).fill(0);
  });

  const scaledGroups = minMaxScale(groupVectors);
  const loc = buildLocationMatrix(users);

  const result = {};
  users.forEach((u, i) => {
    result[u.id] = [
      ...groups.map((g, j) => ({
        type: "group",
        id: String(g.id),
        score: cosineSimilarity(scaledUsers[i], scaledGroups[j])
      })),
      ...users.map((v, j) => j !== i && ({
        type: "user",
        id: String(v.id),
        score: 0.8 * cosineSimilarity(scaledUsers[i], scaledUsers[j]) + 0.2 * loc[i][j]
      })).filter(Boolean)
    ].sort((a, b) => b.score - a.score);
  });

  return { combined_best_to_worst: result };
}
