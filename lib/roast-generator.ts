const ROAST_THEMES = {
  friends: [
    "Your friends are pulling 2LPM while you're counting 12K. What's your excuse today?",
    "Remember when you and your friends started together? They're interviewing at Google now.",
    "Your batchmates are negotiating stock options. You're negotiating with yourself to open LeetCode.",
    "12K/month. Your friends spend more on coffee.",
  ],
  jee: [
    "You survived JEE for THIS? To skip practice problems?",
    "All those years of Kota coaching led to... skipping DSA practice?",
    "JEE Advanced cleared. Basic consistency? Failed.",
    "Your JEE rank meant something once. What does today's zero mean?",
    "Remember the discipline that got you through JEE? Where did it go?",
  ],
  interviews: [
    "Amazon interviewed you. Microsoft interviewed you. And you still can't commit to daily practice?",
    "You've seen FAANG interview rooms. You know what's coming. And you're still slacking?",
    "Companies gave you a chance. You're giving yourself excuses.",
    "One more missed day, one less shot at the offer you actually want.",
  ],
  pride: [
    "Your ego writes checks your work ethic can't cash.",
    "Pride without proof is just embarrassment waiting to happen.",
    "You want respect? Earn it. One problem at a time.",
    "Talk is cheap. LeetCode submissions aren't.",
  ],
  responsibility: [
    "Your family didn't invest in your education for you to skip practice.",
    "Someone believed in you enough to support your dreams. Honor that.",
    "Every missed day is a betrayal of everyone who believed in you.",
    "The people counting on you don't get to take days off from hoping.",
  ],
  time: [
    "35 days. That's it. You're burning daylight.",
    "Every day you skip is a day closer to placements with less preparation.",
    "The clock doesn't care about your excuses. Neither will interviewers.",
    "5 weeks. You've wasted how many hours already?",
  ],
  harsh: [
    "At this rate, you'll be explaining gaps in your resume, not solving problems in interviews.",
    "Mediocrity is a choice. You're making it daily.",
    "The only person standing between you and your goals is the one reading this.",
    "You're not tired. You're not busy. You're just not serious.",
    "If this is how you prepare, imagine how you'll perform.",
  ],
};

export function getRandomRoast(missedDays: number = 1): string {
  const allThemes = Object.keys(ROAST_THEMES) as (keyof typeof ROAST_THEMES)[];

  let weights: (keyof typeof ROAST_THEMES)[];
  if (missedDays >= 3) {
    weights = ['harsh', 'harsh', 'harsh', 'responsibility', 'time'];
  } else if (missedDays >= 2) {
    weights = ['harsh', 'jee', 'friends', 'time', 'interviews'];
  } else {
    weights = ['friends', 'jee', 'interviews', 'pride', 'time'];
  }

  const theme = weights[Math.floor(Math.random() * weights.length)];
  const roasts = ROAST_THEMES[theme];
  return roasts[Math.floor(Math.random() * roasts.length)];
}

export function generateGroqPrompt(context: {
  missedDays: number;
  currentStreak: number;
  totalDebt: number;
  dayNumber: number;
}): string {
  return `You are a harsh but motivating coach for a student preparing for FAANG placements. Generate a single cutting roast (2-3 sentences max) based on this context:

- Days missed recently: ${context.missedDays}
- Current streak: ${context.currentStreak} days
- XP debt accumulated: ${context.totalDebt}
- Day ${context.dayNumber} of 35-day prep

Personal context to hit hard:
- Their friends earn 2LPM, they earn 12K/month
- They cleared JEE but are struggling with consistency
- Amazon and Microsoft already interviewed them before
- They have 5 weeks until placements
- Their pride and family expectations are on the line

Be brutal but motivating. No emoji. No encouragement at the end - just the raw truth. Make them feel the weight of their choices.`;
}

export async function fetchGroqRoast(apiKey: string, context: {
  missedDays: number;
  currentStreak: number;
  totalDebt: number;
  dayNumber: number;
}): Promise<string> {
  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-70b-versatile',
        messages: [
          {
            role: 'user',
            content: generateGroqPrompt(context),
          },
        ],
        max_tokens: 150,
        temperature: 0.9,
      }),
    });

    if (!response.ok) {
      throw new Error('Groq API error');
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || getRandomRoast(context.missedDays);
  } catch {
    return getRandomRoast(context.missedDays);
  }
}
