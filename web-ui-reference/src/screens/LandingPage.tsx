import React, { useState, useEffect } from 'react';
import {
  Play,
  Zap,
  BarChart3,
  MessageSquare,
  Scissors,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Clock,
  CheckCircle2,
  ChevronDown,
} from 'lucide-react';

interface LandingPageProps {
  onLaunchDemo: () => void;
}

export function LandingPage({ onLaunchDemo }: LandingPageProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: Scissors,
      title: 'AI Clip Detection',
      desc: 'Finds viral-worthy moments using shot detection, speech analysis, and Gemini AI ranking.',
    },
    {
      icon: BarChart3,
      title: 'Hook Score Rating',
      desc: 'Every clip gets a 1-10 virality score based on emotional hooks, pacing, and retention patterns.',
    },
    {
      icon: MessageSquare,
      title: 'Script Co-Pilot',
      desc: 'Chat with AI to craft hooks, CTAs, and viral frameworks for your content.',
    },
    {
      icon: Zap,
      title: 'One-Click Export',
      desc: 'Approve clips and export ready-to-post vertical videos for TikTok, Reels, and Shorts.',
    },
  ];

  const stats = [
    { value: '10x', label: 'Faster editing' },
    { value: '85%', label: 'Clip approval rate' },
    { value: '<2min', label: 'Processing time' },
    { value: '3.2M+', label: 'Clips generated' },
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-y-auto">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#00D4AA] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-black" />
            </div>
            <span className="text-xl font-bold tracking-tight">Clipora</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-gray-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How it Works</a>
            <a href="#demo" className="hover:text-white transition-colors">Demo</a>
          </div>
          <button
            onClick={onLaunchDemo}
            className="px-5 py-2 bg-[#00D4AA] text-black font-semibold rounded-full text-sm hover:bg-[#00E8BA] transition-all hover:scale-105 active:scale-95"
          >
            Try Demo
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-16">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00D4AA]/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#00D4AA]/5 rounded-full blur-[200px]" />
        </div>

        {/* Badge */}
        <div
          className={`mb-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm">
            <div className="w-2 h-2 bg-[#00D4AA] rounded-full animate-pulse" />
            <span className="text-sm text-gray-300">Built at Hacklytics 2026 @ Georgia Tech</span>
          </div>
        </div>

        {/* Headline */}
        <h1
          className={`text-5xl md:text-7xl lg:text-8xl font-bold text-center max-w-5xl leading-[1.05] tracking-tight transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          Turn long videos into{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00D4AA] to-[#00E8BA]">
            viral clips
          </span>
        </h1>

        {/* Subheadline */}
        <p
          className={`mt-6 text-lg md:text-xl text-gray-400 text-center max-w-2xl leading-relaxed transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          Upload a podcast, interview, or any long-form video. Clipora uses AI to find the most
          viral moments, rank them, and export ready-to-post clips.
        </p>

        {/* CTA Buttons */}
        <div
          className={`mt-10 flex flex-col sm:flex-row gap-4 transition-all duration-1000 delay-[600ms] ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <button
            onClick={onLaunchDemo}
            className="group px-8 py-4 bg-[#00D4AA] text-black font-bold rounded-full text-lg hover:bg-[#00E8BA] transition-all hover:scale-105 active:scale-95 shadow-lg shadow-[#00D4AA]/25 flex items-center gap-2"
          >
            <Play className="w-5 h-5 fill-current" />
            Try Interactive Demo
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 animate-bounce">
          <ChevronDown className="w-6 h-6 text-gray-500" />
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-y border-white/5 bg-white/[0.02]">
        <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-[#00D4AA]">{stat.value}</div>
              <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[#00D4AA] font-semibold text-sm uppercase tracking-wider mb-3">Features</p>
            <h2 className="text-4xl md:text-5xl font-bold">
              Everything you need to go viral
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              const isActive = activeFeature === i;
              return (
                <div
                  key={i}
                  onMouseEnter={() => setActiveFeature(i)}
                  className={`p-8 rounded-2xl border transition-all duration-500 cursor-default ${
                    isActive
                      ? 'border-[#00D4AA]/30 bg-[#00D4AA]/5 scale-[1.02]'
                      : 'border-white/5 bg-white/[0.02] hover:border-white/10'
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors ${
                      isActive ? 'bg-[#00D4AA] text-black' : 'bg-white/5 text-gray-400'
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-6 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[#00D4AA] font-semibold text-sm uppercase tracking-wider mb-3">How it works</p>
            <h2 className="text-4xl md:text-5xl font-bold">Three steps to viral content</h2>
          </div>

          <div className="space-y-0">
            {[
              {
                step: '01',
                title: 'Upload your video',
                desc: 'Drop any long-form video up to 30 minutes. We support all major formats.',
                icon: TrendingUp,
              },
              {
                step: '02',
                title: 'AI finds viral moments',
                desc: 'Our pipeline uses Video Intelligence, Speech-to-Text, and Gemini to detect and rank the best clips.',
                icon: Sparkles,
              },
              {
                step: '03',
                title: 'Review & export',
                desc: 'Approve the clips you love. Export perfectly formatted vertical videos ready for any platform.',
                icon: CheckCircle2,
              },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="flex gap-6 md:gap-10 group">
                  <div className="flex flex-col items-center">
                    <div className="w-14 h-14 rounded-full border-2 border-[#00D4AA] flex items-center justify-center text-[#00D4AA] font-bold text-lg group-hover:bg-[#00D4AA] group-hover:text-black transition-all">
                      {item.step}
                    </div>
                    {i < 2 && <div className="w-px h-20 bg-white/10 my-2" />}
                  </div>
                  <div className="pb-12">
                    <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
                    <p className="text-gray-400 max-w-md leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Demo CTA */}
      <section id="demo" className="py-32 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            See it in action
          </h2>
          <p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto">
            Try the interactive demo to experience how Clipora transforms long videos into viral-ready clips.
          </p>
          <button
            onClick={onLaunchDemo}
            className="group px-10 py-5 bg-[#00D4AA] text-black font-bold rounded-full text-xl hover:bg-[#00E8BA] transition-all hover:scale-105 active:scale-95 shadow-xl shadow-[#00D4AA]/25 inline-flex items-center gap-3"
          >
            <Play className="w-6 h-6 fill-current" />
            Launch Interactive Demo
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-[#00D4AA] flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-black" />
            </div>
            <span className="font-bold">Clipora</span>
          </div>
          <p className="text-sm text-gray-500">
            Built with GCP AI + FFmpeg. Hacklytics 2026 @ Georgia Tech.
          </p>
        </div>
      </footer>
    </div>
  );
}
