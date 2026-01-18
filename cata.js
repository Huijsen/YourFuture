// --- Category data ---
export const categoryKeywords = {
  reading: [
    "read book","novel","literature","study book","business book","design book",
    "read article","research paper","journal","blog post","case study"
  ],
  writing: [
    "write blog","write notes","summary","plan","campaign plan",
    "write essay","write report","story","publish story","draft","manuscript"
  ],
  work: [
    "complete task","assignment","work task","office work","admin task",
    "project","deadline","report","presentation","slides","prepare presentation",
    "meeting","webinar","client call","brainstorm"
  ],
  learning: [
    "watch tutorial","watch lecture","video lesson","webinar","online class",
    "study notes","course book","learn topic",
    "practice lesson","course exercise","lab work","workshop"
  ],
  music: [
    "practice piano","learn piano","play piano",
    "practice guitar","learn guitar","play guitar",
    "sing","vocal practice","karaoke",
    "compose song","music theory","record music"
  ],
  fitness: [
    "run","jog","cycling","cardio","swim",
    "gym","workout","weight training","pushups","exercise",
    "yoga","stretching","mobility"
  ],
  art: [
    "sketch","draw","illustration","concept art",
    "paint","canvas","watercolor","digital art",
    "craft","design project","DIY","build model"
  ],
  coding: [
    "python script","python project","learn python",
    "javascript","js project","react","web coding",
    "program","script","debug code","build app","develop software"
  ],
  business: [
    "business plan","strategy","campaign plan",
    "social media campaign","ads","content plan","launch campaign",
    "budget","accounting","invoice","plan budget"
  ],
  social: [
    "send message","email","network online","connect online",
    "call","meet friends","hangout","network in person"
  ],
  self_improvement: [
    "journal","meditation","self reflect",
    "goal setting","schedule day","weekly review","plan schedule"
  ]
};

export const expectedTimes = {
  reading: [10,20,30,45,60],
  writing: [20,40,60,90,120],
  work: [15,30,60,90,120],
  learning: [5,15,30,45,60],
  music: [15,30,45,60,90],
  fitness: [20,30,45,60,90],
  art: [15,30,45,60,90],
  coding: [20,40,60,90,120],
  business: [20,40,60,90,120],
  social: [5,10,15,20,30],
  self_improvement: [5,10,20,30,45],
  other: [10,20,30,45,60]
};

export const skillWeights = {
  fitness: 1.6,
  music: 1.4,
  coding: 1.3,
  art: 1.2,
  business: 1.1,
  writing: 1.0,
  learning: 1.0,
  work: 1.0,
  self_improvement: 0.9,
  social: 0.8,
  reading: 0.5,
  other: 1.0
};