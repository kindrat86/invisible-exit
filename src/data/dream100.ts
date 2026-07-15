/**
 * DREAM 100 LIST — 100 Targets for Invisible Exit
 *
 * Russell Brunson's Dream 100: the 100 people/communities who already
 * have our dream customer's attention. Build relationships with them,
 * and you borrow their audience.
 *
 * Tiers:
 *   Tier 1 — Dream Partners (influencers/creators with our audience)
 *   Tier 2 — Strategic Affiliates (communities/newsletters/platforms)
 *   Tier 3 — Content Amplifiers (podcasts/publications/shows)
 *
 * Priority:
 *   P0 = Contact this week (highest audience match)
 *   P1 = Contact within 30 days
 *   P2 = Contact within 90 days
 *   P3 = Long-tail (when capacity allows)
 */

export interface DreamTarget {
  name: string;
  platform: string;
  audience: string;
  tier: "Tier 1" | "Tier 2" | "Tier 3";
  angle: string;
  priority: "P0" | "P1" | "P2" | "P3";
}

export const DREAM_100_TARGETS: DreamTarget[] = [
  // ═══════════════════════════════════════════════════════════════
  // TIER 1 — DREAM PARTNERS (Influencers & Creators)
  // ═══════════════════════════════════════════════════════════════

  // ── Indie Hackers / Micro-SaaS Ecosystem ──
  { name: "Courtland Allen (Indie Hackers)", platform: "Community + Podcast", audience: "500K+", tier: "Tier 1", angle: "From $120K salary to $4K MRR while employed — IH feature + podcast", priority: "P0" },
  { name: "Pat Walls (Starter Story)", platform: "Newsletter + Podcast", audience: "500K+", tier: "Tier 1", angle: "Corporate manager builds $4K MRR anonymously — full timeline feature", priority: "P0" },
  { name: "Pieter Levels (Nomad List)", platform: "Twitter + Products", audience: "300K+", tier: "Tier 1", angle: "Anonymous founder building micro-SaaS — crossover with nomad philosophy", priority: "P1" },
  { name: "Marc Lou", platform: "YouTube + Twitter", audience: "300K+", tier: "Tier 1", angle: "Indie hacker building micro-SaaS — faceless building angle", priority: "P1" },
  { name: "Daniel Vassallo", platform: "Twitter + Podcast", audience: "200K+", tier: "Tier 1", angle: "Anti-corporate career advice → invisible exit is the system", priority: "P1" },
  { name: "Adam Robinson", platform: "Newsletter + Twitter", audience: "100K+", tier: "Tier 1", angle: "Career → entrepreneurship; retention strategies for invisible builders", priority: "P2" },
  { name: "Tony Dinh", platform: "Twitter + Products", audience: "100K+", tier: "Tier 1", angle: "Indie hacker building multiple SaaS products — anonymity + building angle", priority: "P2" },
  { name: "Philibert de Nauphas", platform: "Twitter", audience: "50K+", tier: "Tier 1", angle: "Anonymous/faceless SaaS builder — direct audience match", priority: "P2" },
  { name: "Damir Serbecic", platform: "Twitter + Newsletter", audience: "40K+", tier: "Tier 1", angle: "Solopreneur building SaaS — the employed + anonymous angle", priority: "P2" },
  { name: "Hikari Senju (EverArt)", platform: "Twitter", audience: "30K+", tier: "Tier 1", angle: "Tech founder — the AI tools for corporate escape angle", priority: "P3" },
  { name: "Damon Chen (Testimonial.to)", platform: "Twitter + Products", audience: "40K+", tier: "Tier 1", angle: "Micro-SaaS builder — anonymity-first building systems", priority: "P2" },
  { name: "Vladimir Capoun", platform: "Twitter", audience: "20K+", tier: "Tier 1", angle: "Micro-SaaS builder — anonymous founder crossover", priority: "P3" },
  { name: "Inder Singh", platform: "Twitter + Products", audience: "30K+", tier: "Tier 1", angle: "SaaS builder — corporate escape + anonymous building", priority: "P3" },
  { name: "Sachin Rathi", platform: "Twitter", audience: "15K+", tier: "Tier 1", angle: "Indie hacker — young builder audience interested in stealth building", priority: "P3" },
  { name: "Sankalp (Sanka)", platform: "Twitter", audience: "20K+", tier: "Tier 1", angle: "Micro-SaaS builder — anonymous building + AI tools", priority: "P3" },

  // ── Career / Professional Development ──
  { name: "Ali Abdaal", platform: "YouTube + Podcast", audience: "5M+", tier: "Tier 1", angle: "Productivity → passive income for professionals", priority: "P1" },
  { name: "Justin Welsh", platform: "LinkedIn + Newsletter", audience: "500K+", tier: "Tier 1", angle: "Solopreneur who left corporate — the 'invisible' angle differentiates", priority: "P1" },
  { name: "Jordan Hammond", platform: "LinkedIn", audience: "200K+", tier: "Tier 1", angle: "Career growth content — corporate escape story crossover", priority: "P2" },
  { name: "Lenny Rachitsky", platform: "Newsletter + Podcast", audience: "500K+", tier: "Tier 1", angle: "Career advice for PMs/engineers — building while employed angle", priority: "P1" },
  { name: "Sahil Bloom", platform: "Newsletter + Twitter", audience: "400K+", tier: "Tier 1", angle: "Career → entrepreneurship — the invisible building angle", priority: "P2" },
  { name: "Anne-Laure Le Cunff", platform: "Newsletter (Ness Labs)", audience: "250K+", tier: "Tier 1", angle: "Neuroscience of entrepreneurship — the stealth builder psychology", priority: "P2" },
  { name: "Vincent Luciani (Artemis)", platform: "LinkedIn + Twitter", audience: "50K+", tier: "Tier 1", angle: "AI coaching for founders — corporate transition + AI tools", priority: "P3" },
  { name: "Ana-Maria Ciubota", platform: "LinkedIn", audience: "100K+", tier: "Tier 1", angle: "Career change stories — invisible exit as a case study", priority: "P3" },

  // ── FIRE / Financial Independence ──
  { name: "Paul Thompson (FIRE community)", platform: "Podcast + Blog", audience: "80K+", tier: "Tier 1", angle: "FIRE + MRR — recurring revenue as the new FIRE strategy", priority: "P1" },
  { name: "Brandon (Mad Fientist)", platform: "Podcast + Blog", audience: "200K+", tier: "Tier 1", angle: "Financial independence — MRR vs stock picking for FIRE", priority: "P2" },
  { name: "JL Collins", platform: "Blog + Book", audience: "500K+", tier: "Tier 1", angle: "The 'just index fund' vs recurring revenue debate", priority: "P3" },
  { name: "Vicki Robin (Your Money or Your Life)", platform: "Book + Speaking", audience: "300K+", tier: "Tier 1", angle: "Financial independence movement — the new vehicle for freedom", priority: "P3" },

  // ── Writing / Content Creator Ecosystem ──
  { name: "Nicolas Cole (Ship 30)", platform: "Twitter + Newsletter", audience: "200K+", tier: "Tier 1", angle: "Writing → digital products → the system for employed professionals", priority: "P1" },
  { name: "Dickie Bush (Ship 30)", platform: "Newsletter", audience: "200K+", tier: "Tier 1", angle: "Same as Nicolas Cole — co-target", priority: "P1" },
  { name: "David Perell", platform: "Twitter + Course", audience: "300K+", tier: "Tier 1", angle: "Writing → audience → anonymous building angle", priority: "P2" },
  { name: "Aytekin Tank (Jotform)", platform: "Twitter + Book", audience: "80K+", tier: "Tier 1", angle: "Bootstrapped SaaS founder — the employed builder's playbook", priority: "P3" },

  // ── Productivity / Self-Improvement ──
  { name: "Thomas Frank", platform: "YouTube + Blog", audience: "2.5M+", tier: "Tier 1", angle: "Productivity → building systems → micro-SaaS as productivity hack", priority: "P2" },
  { name: "Matt D'Avella", platform: "YouTube + Podcast", audience: "3M+", tier: "Tier 1", angle: "Minimalism + side projects — the lean building angle", priority: "P2" },
  { name: "Cal Newport", platform: "Blog + Books", audience: "500K+", tier: "Tier 1", angle: "Deep work → building deep skill outside your day job", priority: "P3" },

  // ── No-Code / Maker Community ──
  { name: "Ben Tossell (Ben's Bites)", platform: "Newsletter + Twitter", audience: "100K+", tier: "Tier 1", angle: "AI tools + no-code — building invisible SaaS with AI", priority: "P1" },
  { name: "Padraig Rice (MakerPad)", platform: "Community + Newsletter", audience: "50K+", tier: "Tier 1", angle: "No-code → building while employed — the no-code stealth stack", priority: "P2" },
  { name: "Emmet (nocode.mp)", platform: "Twitter", audience: "30K+", tier: "Tier 1", angle: "No-code tools → building invisible SaaS without coding", priority: "P3" },

  // ── SaaS Founder Community ──
  { name: "Jason Calacanis", platform: "Podcast + Newsletter", audience: "200K+", tier: "Tier 1", angle: "Startup investing → the bootstrapped invisible founder angle", priority: "P2" },
  { name: "Rob Walling (MicroConf)", platform: "Podcast + Community", audience: "100K+", tier: "Tier 1", angle: "Bootstrapped SaaS — building while employed as a bootstrap strategy", priority: "P1" },
  { name: "Steli Efti (Close.io)", platform: "Podcast + Blog", audience: "50K+", tier: "Tier 1", angle: "Sales for SaaS — selling anonymously + remote selling", priority: "P3" },
  { name: "Hiten Shah", platform: "Newsletter + Twitter", audience: "100K+", tier: "Tier 1", angle: "SaaS analytics — building data-driven products invisibly", priority: "P3" },

  // ═══════════════════════════════════════════════════════════════
  // TIER 2 — STRATEGIC AFFILIATES (Communities & Platforms)
  // ═══════════════════════════════════════════════════════════════

  // ── Reddit Communities ──
  { name: "r/SideHustle Community", platform: "Reddit", audience: "1.5M", tier: "Tier 2", angle: "Value-first story posts about the 5-tool system", priority: "P0" },
  { name: "r/SaaS Mods", platform: "Reddit", audience: "350K", tier: "Tier 2", angle: "Building SaaS while employed — story-driven posts, no spam", priority: "P0" },
  { name: "r/FIRE Mods", platform: "Reddit", audience: "800K", tier: "Tier 2", angle: "Sponsored post or AMA about MRR vs stock options", priority: "P1" },
  { name: "r/Entrepreneur Mods", platform: "Reddit", audience: "2M", tier: "Tier 2", angle: "The system-beats-idea story — value-first Reddit approach", priority: "P1" },
  { name: "r/cscareerquestions", platform: "Reddit", audience: "600K", tier: "Tier 2", angle: "Trapped in big tech — the invisible exit system", priority: "P1" },
  { name: "r/experienceddevs", platform: "Reddit", audience: "200K", tier: "Tier 2", angle: "Senior devs with golden handcuffs — the $4K MRR system", priority: "P1" },
  { name: "r/FinancialIndependence", platform: "Reddit", audience: "1M+", tier: "Tier 2", angle: "MRR as the new FIRE strategy — recurring revenue > index funds", priority: "P2" },
  { name: "r/fatFIRE", platform: "Reddit", audience: "300K", tier: "Tier 2", angle: "High earners — the invisible side business for fatFIRE folks", priority: "P2" },
  { name: "r/EntrepreneurRideAlong", platform: "Reddit", audience: "500K", tier: "Tier 2", angle: "Building while employed — the 5-tool system story", priority: "P2" },
  { name: "r/indiehackers", platform: "Reddit", audience: "50K+", tier: "Tier 2", angle: "Indie hackers — the anonymous building + corporate angle", priority: "P2" },
  { name: "r/Personalfinance (moderated approach)", platform: "Reddit", audience: "18M", tier: "Tier 2", angle: "Career side income — strictly value-first, no links", priority: "P3" },

  // ── Newsletters & Publications ──
  { name: "Indie Hackers Community", platform: "Forum", audience: "500K+ members", tier: "Tier 2", angle: "Post the full $0→$4K MRR timeline as a community story", priority: "P0" },
  { name: "Trends.vc (Dru Riley)", platform: "Newsletter", audience: "50K+", tier: "Tier 2", angle: "Micro-SaaS trend report feature — perfect audience match", priority: "P1" },
  { name: "Starter Story Weekly", platform: "Newsletter", audience: "200K+", tier: "Tier 2", angle: "Cross-feature with Starter Story main brand", priority: "P1" },
  { name: "The Hustle (Daily Newsletter)", platform: "Newsletter", audience: "2M+", tier: "Tier 2", angle: "Sponsored placement or featured story", priority: "P2" },
  { name: "Morning Brew", platform: "Newsletter", audience: "4M+", tier: "Tier 2", angle: "Sponsored placement — expensive but huge reach", priority: "P2" },
  { name: "Ben's Bites", platform: "Newsletter", audience: "100K+", tier: "Tier 2", angle: "AI tools for anonymous SaaS building — featured mention", priority: "P1" },
  { name: "Lenny's Newsletter", platform: "Newsletter", audience: "500K+", tier: "Tier 2", angle: "Career advice + side projects — the invisible exit system feature", priority: "P1" },
  { name: "Milk Road (Web3 audience)", platform: "Newsletter", audience: "250K+", tier: "Tier 2", angle: "Side income + crypto-adjacent — the recurring revenue angle", priority: "P3" },
  { name: "Trending (Sam Parr)", platform: "Newsletter", audience: "150K+", tier: "Tier 2", angle: "Business trends — the anonymous founder + micro-SaaS trend", priority: "P2" },
  { name: "Copywriting Newsletter (Joanna Wiebe)", platform: "Newsletter", audience: "40K+", tier: "Tier 2", angle: "Copywriting + conversion — the anonymous brand angle", priority: "P3" },
  { name: "Demand Curve", platform: "Newsletter + Community", audience: "30K+", tier: "Tier 2", angle: "Startup growth tactics for stealth projects", priority: "P3" },
  { name: "Marketing Brew", platform: "Newsletter", audience: "300K+", tier: "Tier 2", angle: "Marketing case study — building an anonymous brand", priority: "P3" },

  // ── Communities / Slack / Discord ──
  { name: "MicroConf Connect", platform: "Slack", audience: "30K", tier: "Tier 2", angle: "Bootstrapped SaaS for corporate managers", priority: "P2" },
  { name: "Indie Worldwide", platform: "Discord", audience: "10K+", tier: "Tier 2", angle: "Indie hackers — the anonymous building + AI tools angle", priority: "P3" },
  { name: "WIP.co (Maker Chat)", platform: "Telegram", audience: "5K+", tier: "Tier 2", angle: "Makers building products publicly — the invisible counterpoint", priority: "P3" },
  { name: "Product Hunt Makers", platform: "Community", audience: "100K+", tier: "Tier 2", angle: "Launch on Product Hunt — the anonymous maker story", priority: "P2" },

  // ── Twitter/X Communities & Threads ──
  { name: "Build in Public (Twitter hashtag)", platform: "Twitter/X", audience: "200K+ contributors", tier: "Tier 2", angle: "The counter-narrative: build in SECRET (for employed people)", priority: "P2" },
  { name: "Indie Hackers Twitter", platform: "Twitter/X", audience: "150K+", tier: "Tier 2", angle: "Anonymous building threads — the invisible exit system", priority: "P2" },

  // ═══════════════════════════════════════════════════════════════
  // TIER 3 — CONTENT AMPLIFIERS (Podcasts & Publications)
  // ═══════════════════════════════════════════════════════════════

  // ── Podcasts (Career / Entrepreneurship) ──
  { name: "Side Hustle School (Chris Guillebeau)", platform: "Podcast", audience: "400K/listeners", tier: "Tier 3", angle: "5 tools, 5 hours/week, $4K MRR — daily show format", priority: "P0" },
  { name: "The Side Hustle Show (Nick Loper)", platform: "Podcast", audience: "250K", tier: "Tier 3", angle: "The system-beats-idea framework — tactical interview", priority: "P0" },
  { name: "Indie Hackers Podcast", platform: "Podcast", audience: "200K", tier: "Tier 3", angle: "The Amsterdam taxi story + full MRR timeline", priority: "P1" },
  { name: "ChooseFI Podcast", platform: "Podcast", audience: "300K", tier: "Tier 3", angle: "Recurring revenue as FIRE accelerator", priority: "P1" },
  { name: "My First Million (Pulte/Shaan)", platform: "Podcast", audience: "500K", tier: "Tier 3", angle: "Micro-SaaS for boring industries — idea-focused episode", priority: "P2" },
  { name: "The Tim Ferriss Show", platform: "Podcast", audience: "2M+", tier: "Tier 3", angle: "Lifestyle design + invisible exit system", priority: "P2" },
  { name: "How I Built This (NPR)", platform: "Podcast", audience: "1M+", tier: "Tier 3", angle: "The anonymous founder story — invisible exit as a case study", priority: "P2" },
  { name: "Masters of Scale (Reid Hoffman)", platform: "Podcast", audience: "500K", tier: "Tier 3", angle: "Scaling while employed — the invisible exit system", priority: "P3" },
  { name: "The $100 MBA Show", platform: "Podcast", audience: "200K", tier: "Tier 3", angle: "The 5-tool system as an MBA alternative for employed builders", priority: "P2" },
  { name: "EntreLeadership Podcast", platform: "Podcast", audience: "150K", tier: "Tier 3", angle: "Leadership + side income — building while leading teams", priority: "P3" },
  { name: "Smart Passive Income (Pat Flynn)", platform: "Podcast", audience: "300K", tier: "Tier 3", angle: "Passive income from micro-SaaS — the employed builder angle", priority: "P1" },
  { name: "Online Marketing Made Easy (Amy Porterfield)", platform: "Podcast", audience: "200K", tier: "Tier 3", angle: "Digital products while employed — the invisible exit system", priority: "P2" },
  { name: "The School of Greatness (Lewis Howes)", platform: "Podcast", audience: "500K", tier: "Tier 3", angle: "Career transition story — invisible exit as the path", priority: "P3" },
  { name: "DesignCare (remote work podcast)", platform: "Podcast", audience: "50K", tier: "Tier 3", angle: "Remote work → building side income — the invisible exit angle", priority: "P3" },
  { name: "The Made in JS Podcast", platform: "Podcast", audience: "30K", tier: "Tier 3", angle: "Technical — building SaaS with JS/AI while employed", priority: "P3" },

  // ── Publications / Blogs ──
  { name: "Dev.to Editorial", platform: "Publication", audience: "1.2M", tier: "Tier 3", angle: "Technical tutorial: building micro-SaaS with AI (no code)", priority: "P1" },
  { name: "HackerNoon", platform: "Publication", audience: "3M/month", tier: "Tier 3", angle: "The anonymous founder stack — how to build without being seen", priority: "P1" },
  { name: "Indie Hackers Articles", platform: "Publication", audience: "500K", tier: "Tier 3", angle: "Full timeline story: $0→$4K MRR while employed", priority: "P1" },
  { name: "Better Marketing (Medium)", platform: "Publication", audience: "500K", tier: "Tier 3", angle: "Anonymous brand building — marketing without a face", priority: "P2" },
  { name: "The Startup (Medium)", platform: "Publication", audience: "1M+", tier: "Tier 3", angle: "Startup story — the invisible exit from corporate", priority: "P2" },
  { name: "Entrepreneur.com", platform: "Publication", audience: "5M+", tier: "Tier 3", angle: "Side business while employed — the invisible exit framework", priority: "P2" },
  { name: "Inc.com", platform: "Publication", audience: "4M+", tier: "Tier 3", angle: "Entrepreneurship — building a side business while employed", priority: "P2" },
  { name: "Forbes (Entrepreneur section)", platform: "Publication", audience: "20M+", tier: "Tier 3", angle: "Career + entrepreneurship — the invisible exit trend piece", priority: "P3" },
  { name: "Substack newsletters (career/SaaS vertical)", platform: "Publication", audience: "Varies", tier: "Tier 3", angle: "Cross-publish the invisible exit story across career newsletters", priority: "P2" },
  { name: "Medium (SaaS / Entrepreneurship tags)", platform: "Publication", audience: "5M+", tier: "Tier 3", angle: "Repurpose blog posts — SEO traffic + discovery", priority: "P3" },

  // ── YouTube Channels ──
  { name: "Ali Abdaal's YouTube", platform: "YouTube", audience: "5M+", tier: "Tier 3", angle: "Productivity → side income — the invisible exit system", priority: "P2" },
  { name: "Thomas Frank's YouTube", platform: "YouTube", audience: "2.5M+", tier: "Tier 3", angle: "Productivity tools → building systems → micro-SaaS", priority: "P2" },
  { name: "CharliMarieTV", platform: "YouTube", audience: "200K", tier: "Tier 3", angle: "Creative entrepreneur — anonymous brand + digital products", priority: "P3" },
  { name: "Pat Flynn's YouTube", platform: "YouTube", audience: "300K", tier: "Tier 3", angle: "Passive income — the invisible exit as passive income 2.0", priority: "P2" },
  { name: "Rob Walling's YouTube", platform: "YouTube", audience: "50K", tier: "Tier 3", angle: "Bootstrapped SaaS — building while employed as a strategy", priority: "P3" },

  // ── Conference / Event Organizers ──
  { name: "MicroConf (Rob Walling)", platform: "Conference", audience: "2K+ attendees", tier: "Tier 3", angle: "Speaker submission — anonymous building + AI tools", priority: "P3" },
  { name: "FounderSummit / Indie Hackers Meetups", platform: "Events", audience: "50K+ globally", tier: "Tier 3", angle: "Remote talk — the invisible exit system for employed builders", priority: "P3" },
  { name: "ProductCon (Product School)", platform: "Conference", audience: "100K+", tier: "Tier 3", angle: "PMs building side businesses — the invisible exit angle", priority: "P3" },
];
