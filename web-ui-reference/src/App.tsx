import React, { useState } from "react";
import {
  Play,
  Clock,
  TrendingUp,
  Zap,
  BarChart3,
  Eye,
  ThumbsUp,
  Share2,
  MessageSquare,
  Film,
  Scissors,
  Sparkles,
  Calendar,
  Globe,
  ArrowUpRight,
  Flame,
  Target,
  Music,
  Type,
  Timer,
} from "lucide-react";

// ── Data ──────────────────────────────────────────────────────────────

const MOMENTS = [
  {
    id: 1,
    label: "Hot Take on AI",
    time: "2:14",
    startPct: 8,
    widthPct: 6,
    score: 97,
    hook: "This is going to change everything about how we work",
    views: "1.2M predicted",
    reason: "Contrarian opinion + emotional delivery. Peak engagement pattern for tech audiences.",
  },
  {
    id: 2,
    label: "Founder Story",
    time: "7:42",
    startPct: 28,
    widthPct: 8,
    score: 91,
    hook: "I was sleeping on my office floor for 6 months",
    views: "890K predicted",
    reason: "Personal vulnerability creates strong parasocial connection. High share potential.",
  },
  {
    id: 3,
    label: "Industry Prediction",
    time: "14:08",
    startPct: 52,
    widthPct: 5,
    score: 88,
    hook: "In 2 years, half of these companies won't exist",
    views: "640K predicted",
    reason: "Bold prediction triggers debate in comments. Save-to-share ratio peaks on prediction content.",
  },
  {
    id: 4,
    label: "Hiring Advice",
    time: "19:35",
    startPct: 72,
    widthPct: 7,
    score: 84,
    hook: "Stop hiring for culture fit",
    views: "520K predicted",
    reason: "Actionable contrarian advice. High save rate from hiring managers and founders.",
  },
  {
    id: 5,
    label: "Closing Wisdom",
    time: "24:11",
    startPct: 89,
    widthPct: 5,
    score: 79,
    hook: "The best advice I ever ignored",
    views: "380K predicted",
    reason: "Reflective tone with curiosity gap. Performs well as standalone motivational clip.",
  },
];

const CLIPS = [
  {
    id: 1,
    title: "Hot Take on AI",
    duration: "0:47",
    score: 97,
    caption: "\"This is going to change everything\" -- and here's why most people aren't ready for it. #ai #tech #futureofwork",
    audio: "Original Audio (Trending)",
    postTime: "Tue 11:00 AM",
    thumbnail: "bg-neutral-200",
    metrics: { views: "1.2M", likes: "89K", shares: "12K" },
  },
  {
    id: 2,
    title: "Founder Hustle Story",
    duration: "1:12",
    score: 91,
    caption: "6 months sleeping on the office floor. Here's what nobody tells you about starting a company. #startup #grind #entrepreneurship",
    audio: "Aesthetic - Tollan Kim",
    postTime: "Wed 7:00 PM",
    thumbnail: "bg-neutral-300",
    metrics: { views: "890K", likes: "67K", shares: "8.4K" },
  },
  {
    id: 3,
    title: "Bold Industry Prediction",
    duration: "0:34",
    score: 88,
    caption: "Half of today's top companies won't survive the next 2 years. Controversial? Maybe. True? Absolutely. #business #prediction",
    audio: "Money Trees - Kendrick Lamar",
    postTime: "Thu 12:00 PM",
    thumbnail: "bg-neutral-200",
    metrics: { views: "640K", likes: "41K", shares: "6.2K" },
  },
  {
    id: 4,
    title: "Hiring Culture Fit Myth",
    duration: "0:52",
    score: 84,
    caption: "Stop hiring for 'culture fit' -- it's the biggest mistake founders make. Here's what to do instead. #hiring #leadership",
    audio: "Original Audio",
    postTime: "Fri 9:00 AM",
    thumbnail: "bg-neutral-300",
    metrics: { views: "520K", likes: "34K", shares: "5.1K" },
  },
  {
    id: 5,
    title: "Best Advice I Ignored",
    duration: "0:41",
    score: 79,
    caption: "The best piece of advice I ever received... and completely ignored. Sometimes the wrong path teaches you more. #motivation #advice",
    audio: "Runaway - AURORA",
    postTime: "Sat 2:00 PM",
    thumbnail: "bg-neutral-200",
    metrics: { views: "380K", likes: "28K", shares: "3.8K" },
  },
];

const HEATMAP_DATA = [
  [2, 3, 1, 1, 0, 0, 0],
  [4, 5, 3, 2, 1, 1, 0],
  [6, 7, 5, 4, 2, 2, 1],
  [5, 6, 4, 3, 2, 1, 1],
  [8, 9, 7, 6, 3, 4, 2],
  [7, 8, 6, 5, 4, 3, 2],
  [9, 10, 8, 7, 5, 6, 3],
  [8, 9, 7, 6, 4, 5, 3],
  [6, 7, 5, 4, 3, 2, 2],
  [4, 5, 3, 3, 2, 1, 1],
  [3, 4, 2, 2, 1, 1, 0],
  [2, 3, 1, 1, 0, 0, 0],
];
const HEATMAP_HOURS = ["6a", "8a", "10a", "12p", "2p", "4p", "6p", "8p", "10p", "12a", "2a", "4a"];
const HEATMAP_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const PLATFORM_DATA = [
  {
    platform: "TikTok",
    icon: "T",
    color: "bg-neutral-900 text-white",
    metrics: { views: "1.2M", likes: "89K", comments: "4.2K", shares: "12K", watchTime: "92%", ctr: "6.8%" },
    verdict: "Best performer",
    verdictColor: "text-green-600",
    format: "9:16 vertical, 0:47, captions on",
  },
  {
    platform: "Reels",
    icon: "R",
    color: "bg-violet-600 text-white",
    metrics: { views: "840K", likes: "62K", comments: "2.8K", shares: "7.1K", watchTime: "87%", ctr: "5.2%" },
    verdict: "Strong reach",
    verdictColor: "text-violet-600",
    format: "9:16 vertical, 0:47, captions on",
  },
  {
    platform: "Shorts",
    icon: "S",
    color: "bg-red-600 text-white",
    metrics: { views: "560K", likes: "38K", comments: "1.9K", shares: "4.3K", watchTime: "78%", ctr: "4.1%" },
    verdict: "Growing audience",
    verdictColor: "text-amber-600",
    format: "9:16 vertical, 0:47, captions on",
  },
];

const DEMOGRAPHICS = [
  { label: "18-24", pct: 34 },
  { label: "25-34", pct: 41 },
  { label: "35-44", pct: 16 },
  { label: "45+", pct: 9 },
];

// ── Components ────────────────────────────────────────────────────────

function Nav() {
  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-violet-600 flex items-center justify-center">
            <Scissors className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-neutral-900 text-lg">Clipora</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm text-neutral-500">
          <a href="#analysis" className="hover:text-neutral-900 transition-colors">Analysis</a>
          <a href="#clips" className="hover:text-neutral-900 transition-colors">Clips</a>
          <a href="#analytics" className="hover:text-neutral-900 transition-colors">Analytics</a>
          <a href="#platforms" className="hover:text-neutral-900 transition-colors">Platforms</a>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline text-xs text-neutral-400 bg-neutral-100 px-2.5 py-1 rounded-md">Hacklytics 2026</span>
          <a
            href="https://github.com/rahulmehta25/LetsGoViral"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-violet-600 hover:text-violet-700 transition-colors flex items-center gap-1"
          >
            GitHub <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </nav>
  );
}

function StatCard({ icon: Icon, label, value, sub }: { icon: React.ElementType; label: string; value: string; sub?: string }) {
  return (
    <div className="bg-white border border-neutral-200 rounded-xl p-5">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-9 h-9 rounded-lg bg-violet-50 flex items-center justify-center">
          <Icon className="w-[18px] h-[18px] text-violet-600" />
        </div>
        <span className="text-sm text-neutral-500">{label}</span>
      </div>
      <p className="text-2xl font-bold text-neutral-900">{value}</p>
      {sub && <p className="text-xs text-neutral-400 mt-1">{sub}</p>}
    </div>
  );
}

function ScoreBadge({ score }: { score: number }) {
  const color =
    score >= 90 ? "bg-green-50 text-green-700 border-green-200" :
    score >= 80 ? "bg-violet-50 text-violet-700 border-violet-200" :
    "bg-amber-50 text-amber-700 border-amber-200";
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${color}`}>
      <Flame className="w-3 h-3" /> {score}
    </span>
  );
}

// ── Sections ──────────────────────────────────────────────────────────

function HeroSection() {
  return (
    <section className="bg-neutral-50 border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-50 border border-violet-200 text-violet-700 text-xs font-medium mb-6">
            <Sparkles className="w-3.5 h-3.5" /> Built at Hacklytics 2026 @ Georgia Tech
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 leading-tight tracking-tight">
            Turn long videos into<br />viral clips with AI
          </h1>
          <p className="mt-4 text-lg text-neutral-500 leading-relaxed max-w-lg">
            Clipora analyzes your content, finds the most engaging moments,
            and generates ready-to-post clips for every platform.
          </p>
          <div className="flex items-center gap-3 mt-8">
            <a href="#analysis" className="inline-flex px-5 py-2.5 bg-violet-600 text-white text-sm font-medium rounded-lg hover:bg-violet-700 transition-colors">
              See demo below
            </a>
            <a href="https://github.com/rahulmehta25/LetsGoViral" target="_blank" rel="noopener noreferrer" className="inline-flex px-5 py-2.5 bg-white text-neutral-700 text-sm font-medium rounded-lg border border-neutral-200 hover:bg-neutral-50 transition-colors">
              View on GitHub
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function VideoAnalysisSection() {
  const [selectedMoment, setSelectedMoment] = useState(MOMENTS[0]);

  return (
    <section id="analysis" className="max-w-7xl mx-auto px-6 py-16">
      <div className="flex items-center gap-2 mb-2">
        <Film className="w-5 h-5 text-violet-600" />
        <h2 className="text-sm font-semibold text-violet-600 uppercase tracking-wide">Video Analysis</h2>
      </div>
      <h3 className="text-2xl font-bold text-neutral-900 mb-1">AI-Detected Viral Moments</h3>
      <p className="text-neutral-500 text-sm mb-8">Source: "The Future of Tech Startups" -- 27:14 podcast interview</p>

      <div className="grid lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3">
          {/* Thumbnail */}
          <div className="relative bg-neutral-900 rounded-xl overflow-hidden aspect-video flex items-center justify-center mb-4">
            <div className="absolute inset-0 bg-neutral-800" />
            <div className="relative z-10 text-center">
              <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur flex items-center justify-center mx-auto mb-3 border border-white/20">
                <Play className="w-6 h-6 text-white ml-0.5" />
              </div>
              <p className="text-white/90 font-medium text-sm">The Future of Tech Startups</p>
              <p className="text-white/50 text-xs mt-1">27:14 -- Podcast Interview</p>
            </div>
            <div className="absolute top-3 left-3 flex gap-2">
              <span className="px-2 py-0.5 bg-black/50 backdrop-blur text-white text-xs rounded-md">1080p</span>
              <span className="px-2 py-0.5 bg-black/50 backdrop-blur text-white text-xs rounded-md">27:14</span>
            </div>
            <div className="absolute top-3 right-3">
              <span className="px-2 py-0.5 bg-violet-600/90 text-white text-xs rounded-md font-medium">5 moments found</span>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white border border-neutral-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-neutral-500">Timeline</span>
              <span className="text-xs text-neutral-400">0:00 -- 27:14</span>
            </div>
            <div className="relative h-10 bg-neutral-100 rounded-lg overflow-hidden mb-3">
              <div className="absolute inset-0 flex items-center px-1">
                {Array.from({ length: 80 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex-1 mx-px bg-neutral-200 rounded-full"
                    style={{ height: `${12 + Math.sin(i * 0.4) * 8 + Math.random() * 6}px` }}
                  />
                ))}
              </div>
              {MOMENTS.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setSelectedMoment(m)}
                  className={`absolute top-0 h-full rounded transition-all cursor-pointer ${
                    selectedMoment.id === m.id
                      ? "bg-violet-600/30 border-2 border-violet-600 z-10"
                      : "bg-violet-400/15 hover:bg-violet-400/25 border border-violet-300/50"
                  }`}
                  style={{ left: `${m.startPct}%`, width: `${m.widthPct}%` }}
                  title={m.label}
                />
              ))}
            </div>
            <div className="flex gap-2 flex-wrap">
              {MOMENTS.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setSelectedMoment(m)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    selectedMoment.id === m.id
                      ? "bg-violet-600 text-white"
                      : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                  }`}
                >
                  <Clock className="w-3 h-3" />
                  {m.time}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Moment detail */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-neutral-200 rounded-xl p-6 sticky top-20">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-neutral-900">{selectedMoment.label}</h4>
              <ScoreBadge score={selectedMoment.score} />
            </div>
            <div className="space-y-4">
              <div>
                <span className="text-xs font-medium text-neutral-400 uppercase tracking-wide">Hook</span>
                <p className="mt-1 text-sm text-neutral-700 italic">"{selectedMoment.hook}"</p>
              </div>
              <div>
                <span className="text-xs font-medium text-neutral-400 uppercase tracking-wide">Why it's viral</span>
                <p className="mt-1 text-sm text-neutral-600">{selectedMoment.reason}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-neutral-50 rounded-lg p-3">
                  <span className="text-xs text-neutral-400">Timestamp</span>
                  <p className="text-sm font-semibold text-neutral-900 mt-0.5">{selectedMoment.time}</p>
                </div>
                <div className="bg-neutral-50 rounded-lg p-3">
                  <span className="text-xs text-neutral-400">Predicted Views</span>
                  <p className="text-sm font-semibold text-neutral-900 mt-0.5">{selectedMoment.views}</p>
                </div>
              </div>
              <div>
                <span className="text-xs font-medium text-neutral-400 uppercase tracking-wide">Engagement Signals</span>
                <div className="flex gap-2 mt-2">
                  {[
                    { icon: ThumbsUp, label: "High save rate" },
                    { icon: Share2, label: "Shareable" },
                    { icon: MessageSquare, label: "Comment bait" },
                  ].map(({ icon: I, label }) => (
                    <span key={label} className="flex items-center gap-1 px-2 py-1 bg-neutral-50 rounded-md text-xs text-neutral-600">
                      <I className="w-3 h-3" /> {label}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ClipCardsSection() {
  const [expandedClip, setExpandedClip] = useState<number | null>(null);

  return (
    <section id="clips" className="bg-neutral-50 border-y border-neutral-200">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex items-center gap-2 mb-2">
          <Scissors className="w-5 h-5 text-violet-600" />
          <h2 className="text-sm font-semibold text-violet-600 uppercase tracking-wide">Extracted Clips</h2>
        </div>
        <h3 className="text-2xl font-bold text-neutral-900 mb-1">Ready-to-Post Clips</h3>
        <p className="text-neutral-500 text-sm mb-8">Auto-generated captions, trending audio, and optimal posting times for each clip.</p>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
          {CLIPS.map((clip, idx) => (
            <div
              key={clip.id}
              className="bg-white border border-neutral-200 rounded-xl overflow-hidden hover:border-neutral-300 transition-colors"
            >
              <div className={`relative aspect-[9/10] ${clip.thumbnail} flex items-center justify-center`}>
                <div className="w-12 h-12 rounded-full bg-white/80 backdrop-blur flex items-center justify-center">
                  <Play className="w-5 h-5 text-neutral-900 ml-0.5" />
                </div>
                <div className="absolute top-3 left-3">
                  <ScoreBadge score={clip.score} />
                </div>
                <div className="absolute top-3 right-3">
                  <span className="px-2 py-0.5 bg-black/60 text-white text-xs rounded-md font-medium">{clip.duration}</span>
                </div>
                <div className="absolute bottom-0 inset-x-0 bg-black/40 backdrop-blur-sm px-3 py-2 flex items-center justify-between">
                  <div className="flex items-center gap-3 text-white text-xs">
                    <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {clip.metrics.views}</span>
                    <span className="flex items-center gap-1"><ThumbsUp className="w-3 h-3" /> {clip.metrics.likes}</span>
                    <span className="flex items-center gap-1"><Share2 className="w-3 h-3" /> {clip.metrics.shares}</span>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-neutral-900 text-sm">{clip.title}</h4>
                  <span className="text-xs text-neutral-400">#{idx + 1}</span>
                </div>
                <p className="text-xs text-neutral-600 leading-relaxed mb-3">
                  {expandedClip === clip.id ? clip.caption : clip.caption.slice(0, 80) + "..."}
                  <button
                    onClick={() => setExpandedClip(expandedClip === clip.id ? null : clip.id)}
                    className="text-violet-600 ml-1 hover:underline"
                  >
                    {expandedClip === clip.id ? "less" : "more"}
                  </button>
                </p>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                    <Music className="w-3 h-3 text-violet-500" />
                    <span>{clip.audio}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                    <Calendar className="w-3 h-3 text-violet-500" />
                    <span>Best post: {clip.postTime}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                    <Type className="w-3 h-3 text-violet-500" />
                    <span>Auto-captions included</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AnalyticsSection() {
  return (
    <section id="analytics" className="max-w-7xl mx-auto px-6 py-16">
      <div className="flex items-center gap-2 mb-2">
        <BarChart3 className="w-5 h-5 text-violet-600" />
        <h2 className="text-sm font-semibold text-violet-600 uppercase tracking-wide">Creator Analytics</h2>
      </div>
      <h3 className="text-2xl font-bold text-neutral-900 mb-1">Performance Overview</h3>
      <p className="text-neutral-500 text-sm mb-8">Aggregated analytics across all generated clips and platforms.</p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Eye} label="Total Views" value="2.4M" sub="+18% from last month" />
        <StatCard icon={TrendingUp} label="Engagement Rate" value="8.7%" sub="Industry avg: 3.2%" />
        <StatCard icon={Zap} label="Viral Clips" value="47" sub="Out of 124 generated" />
        <StatCard icon={Timer} label="Avg Watch Time" value="87%" sub="Above 80% threshold" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Posting heatmap */}
        <div className="lg:col-span-2 bg-white border border-neutral-200 rounded-xl p-6">
          <h4 className="font-semibold text-neutral-900 text-sm mb-1">Best Posting Times</h4>
          <p className="text-xs text-neutral-400 mb-5">Engagement heatmap by hour and day of week</p>
          <div className="overflow-x-auto">
            <div className="min-w-[420px]">
              <div className="flex mb-1">
                <div className="w-10 shrink-0" />
                {HEATMAP_DAYS.map((d) => (
                  <div key={d} className="flex-1 text-center text-[10px] text-neutral-400 font-medium">{d}</div>
                ))}
              </div>
              {HEATMAP_DATA.map((row, ri) => (
                <div key={ri} className="flex items-center mb-0.5">
                  <div className="w-10 shrink-0 text-[10px] text-neutral-400 text-right pr-2">{HEATMAP_HOURS[ri]}</div>
                  {row.map((val, ci) => {
                    const opacity = val / 10;
                    return (
                      <div key={ci} className="flex-1 px-0.5">
                        <div
                          className="h-5 rounded-sm"
                          style={{ backgroundColor: `rgba(124, 58, 237, ${opacity})` }}
                          title={`${HEATMAP_DAYS[ci]} ${HEATMAP_HOURS[ri]}: ${val}/10`}
                        />
                      </div>
                    );
                  })}
                </div>
              ))}
              <div className="flex items-center justify-end gap-1 mt-3">
                <span className="text-[10px] text-neutral-400">Low</span>
                {[0.1, 0.3, 0.5, 0.7, 0.9].map((o) => (
                  <div key={o} className="w-4 h-3 rounded-sm" style={{ backgroundColor: `rgba(124, 58, 237, ${o})` }} />
                ))}
                <span className="text-[10px] text-neutral-400">High</span>
              </div>
            </div>
          </div>
        </div>

        {/* Demographics */}
        <div className="bg-white border border-neutral-200 rounded-xl p-6">
          <h4 className="font-semibold text-neutral-900 text-sm mb-1">Audience Demographics</h4>
          <p className="text-xs text-neutral-400 mb-5">Age distribution of engaged viewers</p>
          <div className="space-y-4">
            {DEMOGRAPHICS.map((d) => (
              <div key={d.label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-neutral-700">{d.label}</span>
                  <span className="text-sm font-semibold text-neutral-900">{d.pct}%</span>
                </div>
                <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-violet-600 rounded-full"
                    style={{ width: `${d.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-5 border-t border-neutral-100">
            <h5 className="text-xs font-medium text-neutral-400 uppercase tracking-wide mb-3">Top Locations</h5>
            <div className="space-y-2">
              {[
                { loc: "United States", pct: "42%" },
                { loc: "United Kingdom", pct: "18%" },
                { loc: "Canada", pct: "12%" },
                { loc: "Australia", pct: "8%" },
              ].map((l) => (
                <div key={l.loc} className="flex items-center justify-between text-sm">
                  <span className="text-neutral-600">{l.loc}</span>
                  <span className="text-neutral-900 font-medium">{l.pct}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PlatformComparisonSection() {
  return (
    <section id="platforms" className="bg-neutral-50 border-t border-neutral-200">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex items-center gap-2 mb-2">
          <Globe className="w-5 h-5 text-violet-600" />
          <h2 className="text-sm font-semibold text-violet-600 uppercase tracking-wide">Platform Comparison</h2>
        </div>
        <h3 className="text-2xl font-bold text-neutral-900 mb-1">Cross-Platform Performance</h3>
        <p className="text-neutral-500 text-sm mb-8">How "Hot Take on AI" (top clip) performs across TikTok, Reels, and Shorts.</p>

        <div className="grid md:grid-cols-3 gap-5">
          {PLATFORM_DATA.map((p) => (
            <div key={p.platform} className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
              <div className="p-5 pb-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-xl ${p.color} flex items-center justify-center text-sm font-bold`}>
                    {p.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold text-neutral-900">{p.platform}</h4>
                    <p className={`text-xs font-medium ${p.verdictColor}`}>{p.verdict}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {[
                    { label: "Views", value: p.metrics.views, icon: Eye },
                    { label: "Likes", value: p.metrics.likes, icon: ThumbsUp },
                    { label: "Comments", value: p.metrics.comments, icon: MessageSquare },
                    { label: "Shares", value: p.metrics.shares, icon: Share2 },
                  ].map((m) => (
                    <div key={m.label} className="bg-neutral-50 rounded-lg p-2.5">
                      <div className="flex items-center gap-1 mb-0.5">
                        <m.icon className="w-3 h-3 text-neutral-400" />
                        <span className="text-[10px] text-neutral-400">{m.label}</span>
                      </div>
                      <p className="text-sm font-semibold text-neutral-900">{m.value}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="border-t border-neutral-100 px-5 py-3 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-neutral-400">Avg Watch Time</span>
                  <p className="text-sm font-semibold text-neutral-900">{p.metrics.watchTime}</p>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-400">Click-Through</span>
                  <p className="text-sm font-semibold text-neutral-900">{p.metrics.ctr}</p>
                </div>
              </div>
              <div className="border-t border-neutral-100 px-5 py-2.5">
                <span className="text-[10px] text-neutral-400">{p.format}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-white border border-neutral-200 rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-violet-50 flex items-center justify-center">
              <Target className="w-[18px] h-[18px] text-violet-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-neutral-900">Recommendation</p>
              <p className="text-xs text-neutral-500">Based on predicted performance across all platforms</p>
            </div>
          </div>
          <div className="md:ml-auto text-sm text-neutral-700">
            Post to <span className="font-semibold text-neutral-900">TikTok first</span> on{" "}
            <span className="font-semibold text-neutral-900">Tuesday at 11:00 AM</span>, then cross-post to Reels after 24h and Shorts after 48h for maximum reach.
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-white">
      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-violet-600 flex items-center justify-center">
            <Scissors className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-semibold text-neutral-900 text-sm">Clipora</span>
          <span className="text-neutral-300 mx-2">|</span>
          <span className="text-xs text-neutral-400">Built at Hacklytics 2026 @ Georgia Tech</span>
        </div>
        <p className="text-xs text-neutral-400">
          AI-powered viral clip generation. Demo data is simulated.
        </p>
      </div>
    </footer>
  );
}

// ── App ───────────────────────────────────────────────────────────────

export function App() {
  return (
    <div className="min-h-screen bg-white">
      <Nav />
      <HeroSection />
      <VideoAnalysisSection />
      <ClipCardsSection />
      <AnalyticsSection />
      <PlatformComparisonSection />
      <Footer />
    </div>
  );
}
