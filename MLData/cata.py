category_keywords = {
    "reading": {
        "books": ["read book", "novel", "literature", "study book", "business book", "design book"],
        "articles": ["read article", "research paper", "journal", "blog post", "case study"]
    },
    "writing": {
        "short_writing": ["write blog", "write notes", "summary", "plan", "campaign plan"],
        "long_writing": ["write essay", "write report", "story", "publish story", "draft", "manuscript"]
    },
    "work": {
        "tasks": ["complete task", "assignment", "work task", "office work", "admin task"],
        "projects": ["project", "deadline", "report", "presentation", "slides", "prepare presentation"],
        "meetings": ["meeting", "webinar", "client call", "brainstorm"]
    },
    "learning": {
        "videos": ["watch tutorial", "watch lecture", "video lesson", "webinar", "online class"],
        "reading": ["study notes", "course book", "learn topic"],
        "hands_on": ["practice lesson", "course exercise", "lab work", "workshop"]
    },
    "music": {
        "piano": ["practice piano", "learn piano", "play piano"],
        "guitar": ["practice guitar", "learn guitar", "play guitar"],
        "singing": ["sing", "vocal practice", "karaoke"],
        "general": ["compose song", "music theory", "record music"]
    },
    "fitness": {
        "cardio": ["run", "jog", "cycling", "cardio", "swim"],
        "strength": ["gym", "workout", "weight training", "pushups", "exercise"],
        "flexibility": ["yoga", "stretching", "mobility"]
    },
    "art": {
        "sketching": ["sketch", "draw", "illustration", "concept art"],
        "painting": ["paint", "canvas", "watercolor", "digital art"],
        "crafting": ["craft", "design project", "DIY", "build model"]
    },
    "coding": {
        "python": ["python script", "python project", "learn python"],
        "javascript": ["javascript", "js project", "react", "web coding"],
        "general": ["program", "script", "debug code", "build app", "develop software"]
    },
    "business": {
        "strategy": ["business plan", "strategy", "campaign plan"],
        "marketing": ["social media campaign", "ads", "content plan", "launch campaign"],
        "finance": ["budget", "accounting", "invoice", "plan budget"]
    },
    "social": {
        "online": ["send message", "email", "network online", "connect online"],
        "offline": ["call", "meet friends", "hangout", "network in person"]
    },
    "self_improvement": {
        "reflection": ["journal", "meditation", "self reflect"],
        "planning": ["goal setting", "schedule day", "weekly review", "plan schedule"]
    }
}

category_expected_times = {
    "reading": {1: 10, 2: 20, 3: 30, 4: 45, 5: 60},
    "writing": {1: 20, 2: 40, 3: 60, 4: 90, 5: 120},
    "work": {1: 15, 2: 30, 3: 60, 4: 90, 5: 120},
    "learning": {1: 5, 2: 15, 3: 30, 4: 45, 5: 60},
    "music": {1: 15, 2: 30, 3: 45, 4: 60, 5: 90},
    "fitness": {1: 20, 2: 30, 3: 45, 4: 60, 5: 90},
    "art": {1: 15, 2: 30, 3: 45, 4: 60, 5: 90},
    "coding": {1: 20, 2: 40, 3: 60, 4: 90, 5: 120},
    "business": {1: 20, 2: 40, 3: 60, 4: 90, 5: 120},
    "social": {1: 5, 2: 10, 3: 15, 4: 20, 5: 30},
    "self_improvement": {1: 5, 2: 10, 3: 20, 4: 30, 5: 45},
    "other": {1: 10, 2: 20, 3: 30, 4: 45, 5: 60}
}

category_skill_weights = {
    "fitness": 1.6,
    "music": 1.4,
    "coding": 1.3,
    "art": 1.2,
    "business": 1.1,
    "writing": 1.0,
    "learning": 1.0,
    "work": 1.0,
    "self_improvement": 0.9,
    "social": 0.8,
    "reading": 0.5,
    "other": 1.0
}
