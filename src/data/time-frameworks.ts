/** Auto-generated time management framework guides. */

export interface TimeFramework {
  slug: string;
  frameworkName: string;
  author: string;
  description: string;
  bestFor: string;
  weeklyTimeCommitment: string;
  steps: { title: string; description: string; duration: string }[];
  toolsNeeded: string[];
  results: string;
  commonMistakes: string;
  faqs: { question: string; answer: string }[];
}

export const timeFrameworks: TimeFramework[] = [
  {
    slug: "5-hour-weekend",
    frameworkName: "The 5-Hour Weekend (Weekend Side Hustle Sprint)",
    author: "Sahil Bloom + Paul Graham",
    description: "Dedicate 5 focused hours every Saturday or Sunday to your side business — the same cadence Paul Graham suggests for founders, compressed into a single high-impact block. No weeknight work, no guilt, just 5 hours of deep work per weekend.",
    bestFor: "Employed founders who want weekends to feel like weekends, not a second job",
    weeklyTimeCommitment: "5 hours (typically one weekend day)",
    steps: [
      { title: "Choose your day", description: "Pick either Saturday or Sunday — never both. This preserves one full day of rest. Block 5 hours (e.g., 7 AM–12 PM or 8 AM–1 PM).", duration: "5 min" },
      { title: "Prep the night before", description: "Write down the ONE output for the session (e.g., 'ship landing page copy'). Gather all context, tools, and credentials so you start fast.", duration: "15 min (Friday night)" },
      { title: "Close everything", description: "Phone on DND, Slack signed out, email closed. Use a website blocker (Cold Turkey, Freedom) for the full 5 hours. No context switching.", duration: "2 min" },
      { title: "The 5-hour pump", description: "Work in 90-minute deep work blocks with 15-minute breaks. No email, no social media, no Slack. Pure creation: code, write, design, or sell.", duration: "5 hours" },
      { title: "Document & close", description: "Spend last 15 minutes writing down where you stopped, the next step, and any context needed next week. This saves your future self 30 minutes of reorientation.", duration: "15 min" },
    ],
    toolsNeeded: ["Calendar (block 5 hours)", "Cold Turkey or Freedom (website blocker)", "Notion or Obsidian (session notes)", "Timer app (Pomodone or built-in)"],
    results: "20–25 hours of deep work per month (250–300 hours per year). Enough to build and launch a micro-SaaS MVP in 6–12 weeks, plus a full feature release every 6–8 weeks.",
    commonMistakes: "Skipping the Friday night prep — you waste the first 30–60 minutes of your 5-hour block figuring out what to do. Also: using one weekend day for 'admin' instead of high-leverage creation. Admin days are separate.",
    faqs: [
      { question: "Is 5 hours per weekend really enough to build a business?", answer: "Yes — most micro-SaaS businesses need 10–15 hours of focused work per week to grow. 5 hours on weekends plus 2–3 weeknight hours (evening sprints) gets you there. The constraint forces you to prioritize what actually matters instead of busywork." },
      { question: "What if I have family commitments on weekends?", answer: "Go earlier — 5 AM–10 AM on Saturday works. Or split into two blocks: Saturday 6–8:30 AM and Sunday 6–8:30 AM. The principle is the same: protected, distraction-free blocks." },
      { question: "Can I work weeknights too?", answer: "You can, but the 'weekend-only' constraint is intentional — it prevents burnout. If you add weeknights, cap them at 2 per week with a hard 90-minute limit per session." },
    ],
  },
  {
    slug: "time-blocking",
    frameworkName: "Time Blocking (Classic)",
    author: "Cal Newport",
    description: "Divide your day into blocks dedicated to specific tasks or types of work. Each block has a defined start, end, and single focus. No multitasking. Used by Bill Gates, Elon Musk, and Cal Newport to produce at PhD-level output while working normal hours.",
    bestFor: "Anyone with a 9-to-5 who wants to carve out consistent side-business time without burning out",
    weeklyTimeCommitment: "30 min planning + 8–12 hours of blocked execution time",
    steps: [
      { title: "Map your fixed commitments", description: "List your job hours, commute, meals, sleep, family time, and exercise. These are non-negotiable blocks.", duration: "15 min (weekly)" },
      { title: "Find the gaps", description: "Every day has pockets: morning before work (5–7 AM?), lunch break (30 min?), evening after dinner (8–9:30 PM?). These are your side-business blocks.", duration: "10 min (weekly)" },
      { title: "Assign ONE task per block", description: "Each block gets one specific output (not 'work on business' but 'write 500 words of landing page copy'). Assign before the week starts.", duration: "10 min (weekly)" },
      { title: "Protect the block", description: "When the block starts, close everything else. Calendar says 'busy.' Phone on DND. Your brain gets 2 minutes to transition, then 50+ minutes of focused work.", duration: "Duration of each block" },
      { title: "Review and adjust", description: "Every Sunday, review how many blocks you actually executed. Adjust block sizes or timing for next week. Aim for 80%+ execution rate.", duration: "15 min (weekly)" },
    ],
    toolsNeeded: ["Google Calendar or TimeCraft", "Paper planner (Hobonichi or similar)", "Timer", "Website blocker"],
    results: "8–12 hours of dedicated side-business work per week without sacrificing job performance or family time. Most founders report 2–3x output vs. 'working whenever they find time.'",
    commonMistakes: "Over-blocking (every minute of the day) — leave 30–60 min buffers between blocks. Also: assigning vague tasks ('work on project') instead of specific outputs ('add Stripe checkout button').",
    faqs: [
      { question: "How do I handle meetings that run over?", answer: "Don't reschedule — just skip the next block. Keep a 'overflow' block on your calendar (e.g., 9–10 PM) where overrun tasks go. This protects your other blocks from chain-reaction failure." },
      { question: "Should I block evenings even if I'm tired?", answer: "Block them, but assign low-cognitive-load tasks (design tweaks, social media scheduling, email). Save deep work (code, writing, strategy) for morning blocks when your executive function is fresh." },
    ],
  },
  {
    slug: "pomodoro-side-hustle",
    frameworkName: "Pomodoro Technique for Side Hustles",
    author: "Francesco Cirillo",
    description: "Work in 25-minute focused sprints with 5-minute breaks. Every 4 pomodoros, take a 15–30 minute break. The fixed timer creates urgency and prevents burnout. Adapted for the employed founder who can only work in short bursts.",
    bestFor: "Founders with unpredictable schedules who need to make every minute count",
    weeklyTimeCommitment: "4–10 hours (depending on how many pomodoros you can fit per day)",
    steps: [
      { title: "Set your daily pomodoro goal", description: "Start with 2 pomodoros/day on weekdays (that's just 50 minutes). Ramp to 4 pomodoros/day (100 minutes) over 2 weeks.", duration: "5 min (daily)" },
      { title: "Prep each pomodoro", description: "Before starting, write down exactly what you'll do in the next 25 minutes. Example: 'Fix the login redirect bug — file: auth.ts line 42-89.'", duration: "2 min" },
      { title: "Run the timer", description: "25 minutes of uninterrupted work. Phone across the room. No tabs other than what you need. If you get distracted, restart the pomodoro.", duration: "25 min" },
      { title: "Take the break", description: "5 minutes. Stand up. No screens. Look out a window. This is when your subconscious processes the problem.", duration: "5 min" },
      { title: "Log your output", description: "After each pomodoro, write one sentence on what you accomplished. After each set of 4, write a summary. This builds momentum and shows progress.", duration: "1 min per pomodoro" },
    ],
    toolsNeeded: ["Pomodoro timer (Tomato Timer, Be Focused, or Forest)", "Notion or log file", "Website blocker (optional but recommended)"],
    results: "2 pomodoros/day = 4+ hours of focused work per week. 4 pomodoros/day = 8+ hours per week. The Pomodoro technique reliably converts small time pockets into measurable progress.",
    commonMistakes: "Working through breaks — 5-minute breaks are where your brain recharges. Skipping them leads to burnout within 2 weeks. Also: checking email or social media during breaks (defeats the purpose of mental reset).",
    faqs: [
      { question: "Can I do 50-minute pomodoros instead?", answer: "Yes — 50/10 (50 min work, 10 min break) is a common variant for deep work. But start with 25/5 to build the habit. The shorter sprints make it easier to start even when you're tired." },
      { question: "What if 25 minutes isn't enough to get into flow?", answer: "Use 2 consecutive pomodoros for a single task (50 minutes total, with a 5-min break between). The forced break actually helps — you return with fresh eyes and catch mistakes you'd miss in a 50-minute slog." },
    ],
  },
  {
    slug: "the-90-day-sprint",
    frameworkName: "The 90-Day Sprint (Cyclic Side Hustle)",
    author: "Perry Maughmer + Greg Isenberg",
    description: "Split your year into 4 sprints of 90 days each. Each sprint has one theme, one primary goal, and one key result. At the end of 90 days, you either double down or pivot. No ambiguous 'work on it when you can' — every 90 days has a pass/fail criteria.",
    bestFor: "Founders who get stuck in perpetual 'working on it' mode without shipping",
    weeklyTimeCommitment: "8–12 hours (weekends + 2 weeknights)",
    steps: [
      { title: "Define the 90-day theme", description: "Pick ONE outcome for the next 90 days. Examples: 'Validate 3 SaaS ideas via waitlist landing pages' or 'Ship MVP and get 10 paying customers' or 'Hit $2K MRR.'", duration: "2 hours (Day 1)" },
      { title: "Set the pass/fail criteria", description: "What exactly proves success? '10 paying customers at $49/month' or '100 waitlist signups on a pre-launch page.' Be specific — vague goals produce vague results.", duration: "30 min (Day 1)" },
      { title: "Break into 30-day chunks", description: "Month 1: Build landing page + validate. Month 2: Build MVP. Month 3: Launch and get customers. Each chunk has its own mini-goal.", duration: "30 min (Day 1)" },
      { title: "Weekly 60-min sprint review", description: "Every Sunday: review weekly progress, check against 90-day goal, adjust tactics. Is the 90-day goal still realistic? Do you need to change approach?", duration: "60 min (weekly)" },
      { title: "The 90-day audit", description: "On day 90, review the result against the pass/fail criteria. Did you hit it? Yes → plan the next 90-day sprint (double down). No → pivot or kill the idea entirely.", duration: "3 hours (Day 90)" },
    ],
    toolsNeeded: ["Notion or Linear (sprint tracker)", "Calendar (weekly review slot)", "Spreadsheet (simple revenue/validation tracker)"],
    results: "4 clear shots at building something meaningful per year. Each sprint produces either a validated business or a clean 'no' — no zombie projects that drag on for years. Greg Isenberg uses this to run 4+ product experiments per year.",
    commonMistakes: "Changing the goal mid-sprint. If you change the theme on day 45, you wasted 45 days. Write the goal down, put it somewhere visible, and don't touch it until day 90. Also: not making the pass/fail criteria truly binary.",

    faqs: [
      { question: "What if I need more than 90 days to validate?", answer: "You don't. If you can't get traction or meaningful feedback in 90 days with 8+ hours/week, either the market isn't ready, the problem isn't painful enough, or you're solving the wrong problem. 90 days is generous for a micro-SaaS." },
      { question: "What happens if I fail the sprint?", answer: "Kill the idea. Not pause — kill. Take 1 week off, then start the next 90-day sprint with a fresh idea. The constraint is what makes it work. If you 'pause' a failed sprint, you'll never actually start the next one. You'll just sit in the ambiguity." },
    ],
  },
  {
    slug: "maker-week-manager-weekend",
    frameworkName: "Maker Week / Manager Weekend",
    author: "Paul Graham / Y Combinator",
    description: "Your day job is 'manager mode' (meetings, Slack, emails). Your side business runs on 'maker mode' (deep work, uninterrupted blocks). Split your calendar so your side business lives entirely in maker-mode hours — mornings before work, weekends, and the occasional PTO day.",
    bestFor: "Employed engineers, designers, and writers who need contiguous deep-work blocks",
    weeklyTimeCommitment: "6–12 hours (mornings + weekends)",
    steps: [
      { title: "Claim your mornings", description: "The 2 hours between 5:30 AM and 7:30 AM are pure maker time. No meetings, no emails, no Slack. Every dayjob-free morning belongs to your side business.", duration: "2 hours (daily)" },
      { title: "No side-business during work hours", description: "Hard rule: no side-business work during 9–5, even if your dayjob has a slow day. This prevents the cognitive load of context-switching and eliminates any IP ownership risk.", duration: "Ongoing" },
      { title: "Weekend: one maker day, one free day", description: "Saturday = 5–6 hour maker block (ship mode). Sunday = zero work — pure rest, family, hobbies. The free day prevents burnout and gives your brain recovery time.", duration: "5–6 hours (Saturday)" },
      { title: "The quarterly PTO sprint", description: "Take 1–2 Friday PTO days per quarter. That gives you 4-day weekends (Thu–Sun or Fri–Mon) for major pushes: launch week, migration, customer onboarding sprint.", duration: "1–2 days (quarterly)" },
      { title: "Template your week", description: "Every day is the same template: 5:30–7:30 AM maker block (side business), 8–5 dayjob, 5–9 PM family/personal, 9–10 PM wind down. The consistency builds momentum.", duration: "Ongoing" },
    ],
    toolsNeeded: ["Calendar with color-coded blocks", "Sleep tracker (optional)", "Caffeine strategy (delay coffee 90 min after waking)"],
    results: "10–14 hours of pure maker-mode per week (10 hours weekday mornings + 5–6 hours Saturday). That's 40+ hours per month — enough to ship a micro-SaaS every 8–12 weeks.",
    commonMistakes: "Letting dayjob tasks bleed into maker mornings. One 'urgent' Slack DM at 6 AM resets your brain into manager mode and destroys the maker block. Use separate devices if you have to. Also: not protecting the Sunday rest day.",
    faqs: [
      { question: "I'm not a morning person. Can I do evenings instead?", answer: "Yes — 8–10 PM works for some people. But evenings have more variable energy (after a full work day), more interruptions (family, chores), and less natural light. Experiment with both mornings and evenings for 2 weeks each, then pick the winner." },
      { question: "What if my dayjob has early meetings?", answer: "Shift your maker block to 4:30–6:30 AM on those days. Or compensate with a 3-hour block on Saturday. The goal is the weekly total, not every single day being perfect." },
    ],
  },
  {
    slug: "hour-stacking",
    frameworkName: "Hour Stacking (Micro-SaaS Time Management)",
    author: "Greg Isenberg",
    description: "Greg Isenberg's framework: stack every available hour into 2–3 contiguous blocks per day rather than spreading them across the day. One hour of contiguous deep work > 3x one-hour chunks spread across 6 hours. The overhead of context switching is the real productivity killer.",
    bestFor: "Founders who feel busy but don't ship — the time exists but it's fragmented",
    weeklyTimeCommitment: "7–14 hours (stacked into 2–3 blocks per day)",
    steps: [
      { title: "Audit your week", description: "Track every hour for 5 days. You'll find 30–60 min pockets you thought were useless. Dinner prep? Read work emails on the toilet? That's a pocket. Collect them.", duration: "5 days (one-time)" },
      { title: "Stack the pockets", description: "Move every 30–60 minute pocket into one contiguous 2-hour block. Example: push your lunch break to 1 PM and use 12–2 PM for side work. Or move evening 'scrolling' to 8–10 PM side work block.", duration: "30 min (weekly planning)" },
      { title: "Ruthlessly prune low-leverage time", description: "Kill or compress: commuting (work from train?), social media scrolling (replace with 2-hour side work block?), lunch with coworkers (eat at desk and use lunch break for a second block).", duration: "Ongoing" },
      { title: "One big block per weekend", description: "A 3–4 hour block on Saturday or Sunday. No exceptions. This is your 'ship block' — the time when you launch features, push code, or ship content.", duration: "3–4 hours (weekend)" },
      { title: "Protect the stack with scarcity", description: "Tell yourself: 'I only have 2 hours today to move this forward.' Scarcity creates urgency. If you had 8 hours, you'd waste 6. With 2 hours, you ship.", duration: "Ongoing" },
    ],
    toolsNeeded: ["Toggl or Timely (time audit)", "Calendar (block stacking)", "Freedom (distraction blocker during blocks)"],
    results: "7–14 stacked hours per week, all contiguous. Greg Isenberg claims this method produces more output than most full-time founders get — because full-time founders waste 60% of their day on distractions.",
    commonMistakes: "Stacking hours but doing low-leverage work (email, design tweaks, admin) instead of high-leverage work (customer conversations, code that ships, sales). The block is only valuable if you do the right work in it.",
    faqs: [
      { question: "What if I can't stack because of my job schedule?", answer: "You can always stack something. Move your lunch break. Replace your morning commute podcast with work time. Replace 30 min of evening Netflix with a side-business block. Greg's point is that the time is there — it's just fragmented on purpose because fragmentation feels safer." },
      { question: "How is this different from time blocking?", answer: "Time blocking is about scheduling every hour. Hour stacking is about consolidating small pockets into big ones. Time blocking assumes your hours already exist in blocks. Hour stacking creates blocks from scattered pockets. They work well together." },
    ],
  },
  {
    slug: "the-5am-club-side-hustle",
    frameworkName: "The 5 AM Club (Early Morning Hustle)",
    author: "Robin Sharma",
    description: "Wake up at 5 AM every day. Use the first 90 minutes for your side business before the world wakes up. No emails, no Slack, no context-switching. By 7 AM you've done 90 minutes of deep work before your dayjob even starts. The entire framework rests on the '20/20/20 rule' for the first hour.",
    bestFor: "Disciplined founders who want the 'before anyone else is awake' advantage — the most consistent time slot available",
    weeklyTimeCommitment: "10.5 hours (90 min × 7 days) — yes, including weekends",
    steps: [
      { title: "The 20/20/20 Hour (5:00–6:00 AM)", description: "5:00–5:20: Move (exercise, stretch, walk). 5:20–5:40: Reflect (journal, plan the day). 5:40–6:00: Grow (read, learn, study something relevant to your side business).", duration: "60 min (daily)" },
      { title: "Deep work sprint (6:00–6:30 AM)", description: "30 minutes of focused creation. No planning, no learning — pure output. Write code, write copy, design a page. The 20/20/20 hour primes your brain for this.", duration: "30 min (daily)" },
      { title: "The weekend bonus round (6:30–7:30 AM)", description: "On weekdays, stop at 6:30 AM to get ready for work. On weekends, extend to 7:30 AM for a full 90-minute deep work session on top of the 20/20/20 hour.", duration: "30-90 min (weekends extra)" },
      { title: "Bed by 9:30 PM", description: "You can't sustain 5 AM wake-ups on 6 hours of sleep. Bed at 9:30 PM, asleep by 10 PM, wake at 5 AM = 7 hours. No late nights. The 5 AM club is as much about sleep hygiene as it is about early rising.", duration: "Ongoing" },
      { title: "The 7-day rhythm", description: "5 AM is non-negotiable every single day, including weekends. Skipping weekends destroys the habit. By day 30, waking at 5 AM feels normal and your side business has 30+ hours of deep work invested.", duration: "Ongoing" },
    ],
    toolsNeeded: ["Alarm clock (placed across the room)", "Journal", "Gym clothes (for the 20/20/20 move segment)", "Blue light blocking glasses (for 8 PM bedtime prep)"],
    results: "10.5 hours of side-business work per week, executed every single day without fail. 126 hours in 12 weeks. The consistency of daily output compounds exponentially over time.",
    commonMistakes: "Going to bed too late. Waking at 5 AM after a 1 AM bedtime is unsustainable. Also: checking phone/email during the 20/20/20 hour — that time is for YOU, not your dayjob or the outside world. Robin Sharma is explicit: the first hour is non-negotiable self-investment.",
    faqs: [
      { question: "I can't wake up at 5 AM. What's a gentler start?", answer: "Start at 6 AM for 2 weeks, then 5:30 for 2 weeks, then 5 AM. The gradual shift works better than going full 5 AM on day 1. But Robin Sharma would say: the dopamine hit of the first 5 AM win is worth the pain." },
      { question: "What about social events at night?", answer: "This is the sacrifice. The 5 AM club means saying no to late dinners, parties, and Netflix binges. For a 6–12 month side-business sprint, it's worth it. After you quit your job, you can sleep until 7 again." },
    ],
  },
  {
    slug: "weekly-review-system",
    frameworkName: "Weekly Review System (GTD for Side Businesses)",
    author: "David Allen",
    description: "David Allen's Getting Things Done system, adapted for employed founders. Every Sunday, spend 60–90 minutes reviewing your side business progress, clearing your inboxes, processing ideas, and planning the coming week. The weekly review is the engine that keeps your side business from becoming noise.",
    bestFor: "Founders with too many ideas who need a system to manage the chaos without dropping balls",
    weeklyTimeCommitment: "60–90 min (Sunday) + 10 min/day (daily review)",
    steps: [
      { title: "Collect everything", description: "Go through every inbox: email (personal + work), Notion, Slack, physical notes, voice memos, browser tabs. Collect every idea, task, and commitment into one master list.", duration: "20 min (weekly)" },
      { title: "Clear the small stuff", description: "Process the easy items immediately: forward an article, reply to the email, move the task to the right list. If it takes <2 minutes, do it now.", duration: "15 min (weekly)" },
      { title: "Update your side-business project list", description: "Review every active project (aim for max 3 at a time). Each project needs a 'next action' — the very next physical step. No project without a next action.", duration: "15 min (weekly)" },
      { title: "Plan next week's 3 priorities", description: "Pick 3 outcomes for the coming week. Not 10. Three. Each gets a time slot on your calendar. Everything else is a 'someday/maybe' item.", duration: "10 min (weekly)" },
      { title: "The daily 10-minute review", description: "Every morning: review your calendar, check your 3 weekly priorities, execute the one that matters most today. That's it. No elaborate daily planning.", duration: "10 min (daily)" },
    ],
    toolsNeeded: ["Notion or Evernote (master list)", "Calendar", "Todoist or TickTick (task management)", "Physical inbox (for brain-dump capture)"],
    results: "No dropped tasks, no forgotten ideas, no 'I'll get to it' items haunting you. Every idea is either an active project or safely parked in 'someday/maybe.' The weekly review confirms you're making progress on the right things.",
    commonMistakes: "Just doing the weekly review without doing the daily review. The daily 10-minute review is what turns the Sunday plan into daily action. Also: over-collecting and under-processing. A list of 200 'someday' items is just digital clutter.",
    faqs: [
      { question: "Should I include my dayjob tasks in the same system?", answer: "Yes — one trusted system for everything. The separation between 'dayjob' and 'side business' is tags, not different tools. David Allen's system works best when everything is in one place. Just tag each task by context." },
      { question: "What if I miss a weekly review?", answer: "Don't skip 2 in a row. One missed week is a speed bump. Two missed weeks and your system collapses. If you miss one, do a 15-minute 'catch-up' review on Tuesday to keep the system alive." },
    ],
  },
  {
    slug: "batch-processing",
    frameworkName: "Batch Processing (The Ultimate Side Hustle Efficiency Hacker)",
    author: "Tim Ferriss",
    description: "Do all similar tasks in one batch instead of spreading them across the week. Answer all client emails in one 30-minute batch on Tuesday. Schedule all social media for the month in one 2-hour session on the 1st. Write all newsletter issues for the month in one Sunday. The overhead of switching between different types of work is the #1 productivity killer.",
    bestFor: "Founders whose side business has multiple modes (customer support, marketing, product, content) and they're drowning in context switches",
    weeklyTimeCommitment: "6–10 hours (in 2–3 batch sessions)",
    steps: [
      { title: "Categorize your work modes", description: "List every recurring task type: email, social media, writing, coding, customer support, design, analytics, meetings. Each mode gets batched separately.", duration: "30 min (one-time)" },
      { title: "Assign each mode to a day/time", description: "Examples: Monday evening = all coding. Wednesday morning = all writing. Thursday lunch = all social media. Saturday = all deep work. Sunday = no work at all.", duration: "30 min (monthly)" },
      { title: "Set batch durations", description: "Email batch: 30 min max. Social media batch: 60 min. Coding batch: 90 min. If you run out of time, the unprocessed items wait for the next batch. This prevents any one batch from expanding.", duration: "Ongoing" },
      { title: "Close everything else during a batch", description: "When you're in the 'coding batch,' email doesn't exist. When you're in the 'writing batch,' Slack doesn't exist. The batch is a single-mode operation. Context-switching within a batch defeats the purpose.", duration: "Per batch" },
      { title: "Batch your deep work into 'factory days'", description: "Tim Ferriss recommends taking 1 PTO day per quarter as a 'factory day' — 8 hours of batching your entire month's content, code, or customer outreach in one day.", duration: "1 day (quarterly)" },
    ],
    toolsNeeded: ["Calendar (batch blocks)", "Buffer or Hypefury (social media batching)", "Notion (content batching)", "Zapier or Make (automation between batches)"],
    results: "Eliminates 80%+ of context-switching overhead. Most founders report 2–3x output in the same total hours after switching to batching. The mental energy saved from not deciding 'what to do next' is enormous.",
    commonMistakes: "Batching but within each batch, still context-switching between sub-tasks. Example: in your 'coding batch,' you switch between frontend code, backend code, and database queries. Keep the batch focused on ONE sub-mode. Also: batching creative work in the afternoon (creativity peaks in the morning for most people).",
    faqs: [
      { question: "What about urgent customer requests?", answer: "Set a 'batch for exceptions' rule: all non-urgent requests wait for the next batch. True emergencies get a 15-minute bucket once per day (e.g., 4 PM daily). 99% of 'urgent' requests can wait 24 hours." },
      { question: "How do I handle dayjob tasks that can't be batched?", answer: "Dayjobs have meetings — that's a different mode. Batch your side-business tasks around your dayjob's un-batchable parts. Use the batching system only for your side business to avoid dayjob politics." },
    ],
  },
  {
    slug: "the-2-hour-rule",
    frameworkName: "The 2-Hour Rule (Minimum Viable Time for a Side Business)",
    author: "Anthony Yeung",
    description: "Dedicate 2 uninterrupted hours per day (1,260 seconds by the clock) to your side business. No zero days. Every single day, including weekends. The rule: 2 hours of focused work > 6 hours of distracted work. The constraint forces you to prioritize ruthlessly because you only have 2 hours.",
    bestFor: "Founders who have the time but struggle with consistency — the 'no zero days' principle",
    weeklyTimeCommitment: "14 hours (2 hours × 7 days)",
    steps: [
      { title: "Find your 2-hour window", description: "It could be 5–7 AM before work, 7–9 PM after dinner, or split into two 60-minute blocks. The window must be at the same time every day. Consistency > perfection.", duration: "1 week (experiment)" },
      { title: "The first 10 minutes: warm up", description: "Don't start with deep work. Spend 10 minutes reviewing yesterday's progress, checking the plan for today, and mentally transitioning from your dayjob. This prevents the 'cold start' problem.", duration: "10 min (daily)" },
      { title: "90 minutes of deep work", description: "The middle 90 minutes are pure deep work. One task. Phone off. No context switching. If you finish the task early, start the next priority task — don't stop working until the 90 minutes are up.", duration: "90 min (daily)" },
      { title: "20 minutes of shallow work", description: "The last 20 minutes are for 'shallow' tasks: responding to customer emails, scheduling social media, updating your task list, reviewing analytics. These are still valuable but don't require deep focus.", duration: "20 min (daily)" },
      { title: "Track the streak", description: "Use a habit tracker (Streaks, Tally, or paper). The 2-hour rule works because of momentum. A 14-day streak is motivating. A 7-day streak is dangerous. A 1-day gap is a crisis — fix it immediately.", duration: "Ongoing" },
    ],
    toolsNeeded: ["Habit tracker (Streaks app or Tally)", "Timer", "Calendar (recurring daily block)", "Noise-cancelling headphones"],
    results: "14 hours of side-business work per week. 56 hours per month. 168 hours per quarter. Enough to build and launch a micro-SaaS in 6–8 weeks, iterate, and start generating revenue within 3 months.",
    commonMistakes: "The #1 mistake: not doing it on weekends. The 2-hour rule is 7 days a week. Weekend sessions build 4X compound momentum because there's no dayjob context to shake off. Also: starting with deep work immediately — you need the 10-minute warmup transition.",
    faqs: [
      { question: "What if I miss a day?", answer: "Don't miss two. A single missed day is a slip. Two missed days is a pattern. If you miss a day, do the 2-hour block the next day without guilt. Guilt is the #1 reason streaks fail — perfectionism kills progress." },
      { question: "What if I only have 1 hour available?", answer: "Anthony Yeung says: 2 hours is the minimum for meaningful progress. If you truly only have 1 hour, you need to set smaller goals or accept slower progress. Consider combining the 2-hour rule with time blocking or pomodoro for the hours you do have." },
    ],
  },
];
