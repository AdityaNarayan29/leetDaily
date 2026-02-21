"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Chrome,
  Flame,
  BarChart3,
  Tag,
  Github,
  Twitter,
  Zap,
  Users,
  Star,
  Linkedin,
  Globe,
  Building2,
  Bell,
  Calendar,
  Trophy,
  ArrowRight,
  Sparkles,
  Shield,
  Check,
  Settings,
  AlertTriangle,
  BookOpen,
  Search,
  Database,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subtextRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const notificationSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial states
      gsap.set([headingRef.current, subtextRef.current, ctaRef.current], {
        opacity: 0,
        y: 30,
      });
      gsap.set(badgeRef.current, { opacity: 0, y: -20 });
      gsap.set(popupRef.current, { opacity: 0, y: 60, scale: 0.95 });

      // Main timeline
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.to(badgeRef.current, { opacity: 1, y: 0, duration: 0.6 }, 0.2)
        .to(headingRef.current, { opacity: 1, y: 0, duration: 0.8 }, 0.4)
        .to(subtextRef.current, { opacity: 1, y: 0, duration: 0.8 }, 0.6)
        .to(ctaRef.current, { opacity: 1, y: 0, duration: 0.8 }, 0.8)
        .to(
          popupRef.current,
          { opacity: 1, y: 0, scale: 1, duration: 1, ease: "power2.out" },
          1
        );

      // Popup internal animations
      const popupTl = gsap.timeline({ delay: 1.5 });

      // Animate popup sections sequentially
      popupTl
        .from(".popup-header", { opacity: 0, x: -20, duration: 0.5 })
        .from(".popup-stats", { opacity: 0, y: 20, duration: 0.5 }, "-=0.3")
        .from(".popup-heatmap", { opacity: 0, y: 20, duration: 0.5 }, "-=0.3")
        .from(".popup-lists", { opacity: 0, y: 20, duration: 0.5 }, "-=0.3")
        .from(".popup-problem", { opacity: 0, y: 20, duration: 0.5 }, "-=0.3")
        .from(".popup-explorer", { opacity: 0, y: 20, duration: 0.5 }, "-=0.3");

      // Heatmap cells stagger animation
      gsap.fromTo(".heatmap-cell",
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.3,
          stagger: {
            each: 0.02,
            from: "start",
          },
          delay: 2.2,
          ease: "back.out(1.7)",
        }
      );

      // Tags stagger animation
      gsap.fromTo(".tag-chip",
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.3,
          stagger: 0.1,
          delay: 2.8,
          ease: "back.out(1.7)",
        }
      );

      // Floating animation for popup
      gsap.to(popupRef.current, {
        y: -10,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 2.5,
      });

      // Streak counter animation
      gsap.fromTo(".streak-counter",
        { scale: 1.5, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.6,
          delay: 2,
          ease: "elastic.out(1, 0.5)",
        }
      );

      // Study list progress bars fill animation
      gsap.fromTo(".list-progress-bar",
        { width: "0%" },
        {
          width: (i: number) => ["70%", "56%", "55%"][i] || "50%",
          duration: 0.8,
          stagger: 0.15,
          delay: 2.8,
          ease: "power2.out",
        }
      );

      // Extension icon badge blink animation (in hero)
      gsap.to(".icon-badge-blink", {
        opacity: 0.3,
        duration: 0.5,
        repeat: -1,
        yoyo: true,
        delay: 2.5,
        ease: "sine.inOut",
      });

      // Notification section animations with ScrollTrigger
      ScrollTrigger.create({
        trigger: ".notification-showcase",
        start: "top 80%",
        onEnter: () => {
          // Chrome notification slide in
          gsap.fromTo(
            ".chrome-notification",
            { x: 300, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
          );

          // Streak at risk warning shake
          gsap.fromTo(
            ".streak-warning",
            { y: 50, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6, delay: 0.3, ease: "power3.out" }
          );

          // Urgent shake animation
          gsap.to(".streak-warning", {
            x: -3,
            duration: 0.1,
            repeat: 5,
            yoyo: true,
            delay: 1.2,
            ease: "none",
          });
        },
        once: true,
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden">
      {/* Animated background gradient */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 -left-4 w-64 sm:w-96 h-64 sm:h-96 bg-orange-500/30 rounded-full mix-blend-multiply filter blur-[128px] animate-pulse" />
        <div className="absolute top-0 -right-4 w-64 sm:w-96 h-64 sm:h-96 bg-red-500/20 rounded-full mix-blend-multiply filter blur-[128px] animate-pulse delay-1000" />
        <div className="absolute -bottom-8 left-1/2 w-64 sm:w-96 h-64 sm:h-96 bg-amber-500/20 rounded-full mix-blend-multiply filter blur-[128px] animate-pulse delay-500" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-[#0a0a0a]/80 border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
              <Flame className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-semibold">LeetDaily</span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="/blog"
              className="text-sm text-white/60 hover:text-white transition-colors"
            >
              Blog
            </a>
            <a
              href="https://chromewebstore.google.com/detail/leetdaily/kpmmlpoonleloofchbbfnmicchmhehcf"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/15 border border-white/10 text-sm font-medium transition-all duration-300"
            >
              <Chrome className="w-4 h-4" />
              Add to Chrome
            </a>
            <a
              href="https://chromewebstore.google.com/detail/leetdaily/kpmmlpoonleloofchbbfnmicchmhehcf"
              target="_blank"
              rel="noopener noreferrer"
              className="sm:hidden inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/10 hover:bg-white/15 border border-white/10 transition-all duration-300"
            >
              <Chrome className="w-4 h-4" />
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section ref={heroRef} aria-label="LeetDaily Chrome Extension for LeetCode" className="relative pt-24 sm:pt-28 pb-12 px-4 sm:px-6 lg:px-12">
        <div className="max-w-[1200px] mx-auto">
          {/* Two column layout on desktop */}
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left side - Text content */}
            <div className="text-center lg:text-left">
              {/* Badge */}
              <div
                ref={badgeRef}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 mb-6"
              >
                <Sparkles className="w-3 h-3 text-orange-400" />
                <span className="text-xs text-orange-200/90">
                  Free Chrome Extension
                </span>
              </div>

              {/* Main heading */}
              <h1
                ref={headingRef}
                className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4"
              >
                <span className="text-white">Build your</span>
                <br />
                <span className="bg-gradient-to-r from-orange-400 via-red-400 to-amber-400 bg-clip-text text-transparent">
                  LeetCode streak daily
                </span>
              </h1>

              <p
                ref={subtextRef}
                className="text-sm sm:text-base text-white/60 max-w-sm sm:max-w-md mx-auto lg:mx-0 mb-6 leading-relaxed"
              >
                Free Chrome extension for daily LeetCode challenges, Blind 75 / NeetCode 150 tracking, FAANG company tags, problems explorer & smart coding interview reminders — one click from your toolbar.
              </p>

              {/* CTA Buttons */}
              <div
                ref={ctaRef}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center"
              >
                <a
                  href="https://chromewebstore.google.com/detail/leetdaily/kpmmlpoonleloofchbbfnmicchmhehcf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2.5 sm:py-3 rounded-full bg-gradient-to-r from-orange-500 to-red-500 font-semibold text-xs sm:text-sm transition-all duration-300 hover:shadow-[0_0_40px_rgba(249,115,22,0.4)] hover:scale-105"
                >
                  <Chrome className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>Add to Chrome — Free</span>
                  <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
                </a>

                <div className="flex items-center gap-3 text-xs text-white/50">
                  <div className="flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    <span>Privacy-first</span>
                  </div>
                  <span className="w-1 h-1 rounded-full bg-white/30" />
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span>1000+ users</span>
                  </div>
                </div>
              </div>

              {/* Stats row */}
              <div className="flex justify-center lg:justify-start gap-6 mt-6 pt-6 border-t border-white/5">
                <div className="text-center lg:text-left">
                  <div className="text-xl sm:text-2xl font-bold text-orange-400">1K+</div>
                  <div className="text-[10px] sm:text-xs text-white/40">Active Users</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-xl sm:text-2xl font-bold text-emerald-400">365</div>
                  <div className="text-[10px] sm:text-xs text-white/40">Max Streak</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-xl sm:text-2xl font-bold text-blue-400">50+</div>
                  <div className="text-[10px] sm:text-xs text-white/40">Companies</div>
                </div>
              </div>
            </div>

            {/* Right side - Browser mockup */}
            <div className="relative mx-auto lg:mx-0 max-w-[340px] sm:max-w-md lg:max-w-none">
              {/* Browser Mockup with Extension */}
              <div className="relative">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-3xl blur-3xl scale-110" />

            {/* Browser Window */}
            <div className="relative bg-[#1a1a1a] rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
              {/* Browser Toolbar */}
              <div className="flex items-center justify-between px-2.5 sm:px-4 py-2.5 sm:py-3 bg-[#0d0d0d] border-b border-white/5">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-500/60" />
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-yellow-500/60" />
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-500/60" />
                </div>
                <div className="flex-1 mx-2 sm:mx-4 max-w-lg">
                  <div className="bg-white/5 rounded-lg px-2 sm:px-4 py-1.5 text-[10px] sm:text-xs text-white/40 text-center truncate">
                    mail.google.com/mail/u/0/#inbox
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  {/* Other extension icons */}
                  <div className="hidden sm:block w-5 h-5 rounded bg-white/10" />
                  <div className="hidden sm:block w-5 h-5 rounded bg-white/10" />

                  {/* LeetDaily Extension Icon with blinking badge */}
                  <div className="extension-icon-demo relative cursor-pointer">
                    <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-lg shadow-orange-500/30 hover:scale-110 transition-transform">
                      <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                    </div>
                    {/* Blinking badge */}
                    <div className="icon-badge-blink absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 flex items-center justify-center text-[9px] font-bold border-2 border-[#0d0d0d] shadow-lg shadow-red-500/50">
                      7
                    </div>
                  </div>
                </div>
              </div>

              {/* Browser Content Area with Popup */}
              <div className="relative p-2 sm:p-4 bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] sm:min-h-[620px]">
                {/* Email Content - Stacked Emails (hidden on mobile, muted background) */}
                <div className="hidden sm:block space-y-2 opacity-40">
                  {/* Email 1 - Boogle */}
                  <div className="bg-white/[0.02] rounded-lg p-3 border border-white/[0.03]">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500/50 via-red-500/50 to-yellow-500/50 flex items-center justify-center text-[10px] font-bold text-white/70">
                        B
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-xs text-white/60">Boogle Recruiting</span>
                          <span className="text-[9px] text-white/30">2 min ago</span>
                        </div>
                        <span className="text-[10px] text-white/40">careers@boogle.com</span>
                      </div>
                    </div>
                    <div className="mt-2 pt-2 border-t border-white/[0.03]">
                      <h3 className="text-xs text-emerald-400/70 mb-1">Your Offer Letter from Boogle</h3>
                      <p className="text-[10px] text-white/40 leading-relaxed">
                        We are thrilled to extend an offer for Software Engineer L4...
                      </p>
                    </div>
                  </div>

                  {/* Email 2 - Leta */}
                  <div className="bg-white/[0.02] rounded-lg p-3 border border-white/[0.03]">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600/50 to-blue-400/50 flex items-center justify-center text-[10px] font-bold text-white/70">
                        L
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-xs text-white/60">Leta Recruiting</span>
                          <span className="text-[9px] text-white/30">1 hour ago</span>
                        </div>
                        <span className="text-[10px] text-white/40">careers@leta.com</span>
                      </div>
                    </div>
                    <div className="mt-2 pt-2 border-t border-white/[0.03]">
                      <h3 className="text-xs text-blue-400/70 mb-1">Offer Letter - Software Engineer E5</h3>
                      <p className="text-[10px] text-white/40 leading-relaxed">
                        We&apos;re excited to offer you the role of Software Engineer E5...
                      </p>
                    </div>
                  </div>

                  {/* Email 3 - Nilezon */}
                  <div className="bg-white/[0.02] rounded-lg p-3 border border-white/[0.03]">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500/50 to-yellow-500/50 flex items-center justify-center text-[10px] font-bold text-white/70">
                        N
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-xs text-white/60">Nilezon Recruiting</span>
                          <span className="text-[9px] text-white/30">3 hours ago</span>
                        </div>
                        <span className="text-[10px] text-white/40">jobs@nilezon.com</span>
                      </div>
                    </div>
                    <div className="mt-2 pt-2 border-t border-white/[0.03]">
                      <h3 className="text-xs text-orange-400/70 mb-1">Welcome to Nilezon - SDE II</h3>
                      <p className="text-[10px] text-white/40 leading-relaxed">
                        We&apos;re excited to offer you the SDE II position...
                      </p>
                    </div>
                  </div>

                  {/* Email 4 - Mapple */}
                  <div className="bg-white/[0.02] rounded-lg p-3 border border-white/[0.03]">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-400/50 to-gray-600/50 flex items-center justify-center text-[10px] font-bold text-white/70">
                        M
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-xs text-white/60">Mapple Recruiting</span>
                          <span className="text-[9px] text-white/30">Yesterday</span>
                        </div>
                        <span className="text-[10px] text-white/40">careers@mapple.com</span>
                      </div>
                    </div>
                    <div className="mt-2 pt-2 border-t border-white/[0.03]">
                      <h3 className="text-xs text-gray-300/70 mb-1">Offer Letter - Software Engineer</h3>
                      <p className="text-[10px] text-white/40 leading-relaxed">
                        We&apos;re pleased to offer you a position at Mapple...
                      </p>
                    </div>
                  </div>
                </div>

                {/* The Popup - Overlapping from top right */}
                <div
                  ref={popupRef}
                  className="sm:absolute sm:top-4 sm:right-4 mt-2 sm:mt-0 bg-[#1a1a1a] rounded-xl sm:rounded-2xl border border-white/10 shadow-2xl overflow-hidden z-10 w-full sm:w-[360px]"
                >
              {/* Popup Header */}
              <div className="popup-header px-3 sm:px-4 py-2.5 sm:py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-xs font-bold">
                      A
                    </div>
                    <div className="text-left">
                      <div className="text-[13px] font-semibold leading-tight">AdityaNarayan29</div>
                      <div className="text-[11px] text-white/40 leading-tight">Daily LeetCode Kro</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="text-[11px] text-white/40 tabular-nums">5h 23m</span>
                    <div className="streak-counter text-[13px] font-semibold text-[#ffa116]">&#x1F525; 7</div>
                    <span className="text-white/10">|</span>
                    <Settings className="w-3.5 h-3.5 text-white/40" />
                  </div>
                </div>
              </div>

              {/* Stats Panel */}
              <div className="popup-stats px-3 sm:px-4 pb-2.5 sm:pb-3">
                <div className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-[#282828] border border-white/5">
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-white/40">Solved</span>
                    <span className="text-[13px] font-semibold">473</span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px]">
                    <span><span className="font-semibold text-[#00b8a3]">118</span> <span className="text-white/40">Easy</span></span>
                    <span><span className="font-semibold text-[#ffa116]">289</span> <span className="text-white/40">Med</span></span>
                    <span><span className="font-semibold text-[#ff375f]">66</span> <span className="text-white/40">Hard</span></span>
                  </div>
                </div>
              </div>

              {/* 30-Day Heatmap */}
              <div className="popup-heatmap px-3 sm:px-4 pb-2.5 sm:pb-3">
                <div className="p-3 rounded-xl bg-[#282828] border border-white/5">
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[12px] font-semibold">30-Day Activity</span>
                      <span className="text-[10px] text-emerald-400 font-medium">27/30 daily</span>
                    </div>
                    <div className="flex items-center gap-1 text-[9px] text-white/40">
                      <span>Less</span>
                      <div className="flex gap-0.5">
                        <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }} />
                        <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: 'rgba(44,187,93,0.25)' }} />
                        <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: 'rgba(44,187,93,0.5)' }} />
                        <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: 'rgba(44,187,93,1)' }} />
                      </div>
                      <span>More</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-15 gap-[3px] w-full">
                    {[...Array(30)].map((_, i) => {
                      const pattern = [
                        3, 2, 3, 1, 3, 2, 0, 3, 3, 2, 1, 3, 2, 3, 1,
                        2, 3, 1, 3, 2, 3, 0, 2, 3, 3, 1, 2, 3, 2, 4,
                      ];
                      const level = pattern[i];
                      const colors = [
                        { bg: 'rgba(255,255,255,0.05)' },
                        { bg: 'rgba(44,187,93,0.25)' },
                        { bg: 'rgba(44,187,93,0.5)' },
                        { bg: 'rgba(44,187,93,1)' },
                        { bg: 'rgba(249,115,22,0.5)', ring: true },
                      ];
                      const color = colors[level];
                      return (
                        <div
                          key={i}
                          className={`heatmap-cell aspect-square rounded-[3px] transition-all hover:scale-110 cursor-pointer ${color.ring ? 'ring-1 ring-orange-500' : ''}`}
                          style={{ backgroundColor: color.bg }}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Your Progress — List Progress */}
              <div className="popup-lists px-3 sm:px-4 pb-2.5 sm:pb-3">
                <div className="p-3 rounded-xl bg-[#282828] border border-white/5">
                  <div className="flex items-center justify-between mb-3.5">
                    <span className="text-[12px] font-semibold">Your Progress</span>
                    <span className="text-[10px] text-white/40">Track curated lists</span>
                  </div>
                  <div className="space-y-3.5">
                    {/* Blind 75 */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[12px] font-semibold text-white hover:text-[#00b8a3] cursor-pointer transition-colors">Blind 75</span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] text-white/40"><span className="text-white/70">52/74</span> <span className="text-[#00b8a3] font-semibold">70%</span></span>
                          <div className="w-4 h-4 rounded flex items-center justify-center text-white/25 hover:text-[#00b8a3] hover:bg-[#00b8a3]/10 cursor-pointer transition-all">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                          </div>
                        </div>
                      </div>
                      <div className="h-[7px] rounded-full bg-white/10 overflow-hidden">
                        <div className="list-progress-bar h-full rounded-full bg-[#00b8a3]" style={{ width: '70%' }} />
                      </div>
                    </div>
                    {/* NeetCode 150 */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[12px] font-semibold text-white hover:text-[#ffa116] cursor-pointer transition-colors">NC 150</span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] text-white/40"><span className="text-white/70">89/158</span> <span className="text-[#ffa116] font-semibold">56%</span></span>
                          <div className="w-4 h-4 rounded flex items-center justify-center text-white/25 hover:text-[#ffa116] hover:bg-[#ffa116]/10 cursor-pointer transition-all">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                          </div>
                        </div>
                      </div>
                      <div className="h-[7px] rounded-full bg-white/10 overflow-hidden">
                        <div className="list-progress-bar h-full rounded-full bg-[#ffa116]" style={{ width: '56%' }} />
                      </div>
                    </div>
                    {/* LeetCode 75 */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[12px] font-semibold text-white hover:text-[#ff375f] cursor-pointer transition-colors">LC 75</span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] text-white/40"><span className="text-white/70">41/75</span> <span className="text-[#ff375f] font-semibold">55%</span></span>
                          <div className="w-4 h-4 rounded flex items-center justify-center text-white/25 hover:text-[#ff375f] hover:bg-[#ff375f]/10 cursor-pointer transition-all">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                          </div>
                        </div>
                      </div>
                      <div className="h-[7px] rounded-full bg-white/10 overflow-hidden">
                        <div className="list-progress-bar h-full rounded-full bg-[#ff375f]" style={{ width: '55%' }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Daily Challenge */}
              <div className="popup-problem px-3 sm:px-4 pb-2.5 sm:pb-3">
                <div className="p-3 rounded-xl bg-[#282828] border border-white/5">
                  {/* Title row */}
                  <div className="flex items-start gap-2 mb-3">
                    <div className="flex-1 text-[13px] leading-snug">
                      <span className="text-white/40">1.</span>{" "}
                      <span className="font-medium">Two Sum</span>{" "}
                      <span className="float-right text-[10px] whitespace-nowrap">
                        <span className="font-medium text-[#00b8a3]">Easy</span>
                        <span className="text-white/40">&nbsp;·&nbsp;</span>
                        <span className="text-white/40">54.1%</span>
                      </span>
                    </div>
                    <div className="text-white/60 hover:text-[#ffa116] cursor-pointer transition-colors shrink-0 mt-0.5">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                    </div>
                  </div>

                  {/* Topics row */}
                  <div className="flex items-start gap-2 text-white/40 px-2.5 py-2 border border-white/10 rounded-t-lg">
                    <div className="flex items-center gap-1.5 shrink-0">
                      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>
                      <span className="text-[10px] font-medium">Topics</span>
                      <span className="text-white/20 text-[10px]">&rsaquo;</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      <span className="tag-chip px-1.5 py-0.5 rounded text-[10px] bg-white/5 text-white/60 hover:bg-white/10 cursor-pointer transition-colors">Array</span>
                      <span className="tag-chip px-1.5 py-0.5 rounded text-[10px] bg-white/5 text-white/60 hover:bg-white/10 cursor-pointer transition-colors">Hash Table</span>
                    </div>
                  </div>
                  {/* Companies row */}
                  <div className="flex items-start gap-2 text-white/40 px-2.5 py-2 border border-white/10 border-t-0 rounded-b-lg">
                    <div className="flex items-center gap-1.5 shrink-0">
                      <Building2 className="w-3 h-3" />
                      <span className="text-[10px] font-medium">Companies</span>
                      <span className="text-white/20 text-[10px]">&rsaquo;</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      <span className="tag-chip px-1.5 py-0.5 rounded text-[10px] bg-[#ffa116]/10 text-[#ffa116] hover:bg-[#ffa116]/20 cursor-pointer transition-colors">Google (45)</span>
                      <span className="tag-chip px-1.5 py-0.5 rounded text-[10px] bg-[#ffa116]/10 text-[#ffa116] hover:bg-[#ffa116]/20 cursor-pointer transition-colors">Amazon (38)</span>
                      <span className="tag-chip px-1.5 py-0.5 rounded text-[10px] bg-white/5 text-white/60 hover:bg-white/10 cursor-pointer transition-colors">+5</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Problems Explorer Card */}
              <div className="popup-explorer px-3 sm:px-4 pb-3 sm:pb-4">
                <div className="px-3 py-2.5 rounded-xl bg-[#282828] border border-white/5">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[12px] font-semibold">Problems Explorer</span>
                      <p className="text-[10px] text-white/40 mt-0.5">Browse &amp; filter all LeetCode problems</p>
                    </div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/8 text-[11px] font-medium hover:bg-white/12 cursor-pointer transition-colors">
                      <Search className="w-3 h-3" />
                      Browse
                    </div>
                  </div>
                </div>
              </div>
              </div>
              </div>
              </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section aria-label="LeetCode Chrome Extension Features" className="py-12 sm:py-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
              LeetCode Chrome Extension{" "}
              <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                features
              </span>
            </h2>
            <p className="text-white/50 max-w-xl mx-auto">
              Packed with features to help you build a daily coding habit and
              ace your FAANG interviews
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                icon: Flame,
                title: "Daily Challenge",
                description:
                  "Today's problem with difficulty, acceptance rate, topic tags, and company frequency data.",
                gradient: "from-orange-500 to-red-500",
              },
              {
                icon: BookOpen,
                title: "Curated Study Lists",
                description:
                  "Track Blind 75, NeetCode 150, and LeetCode 75 with live progress bars and next-unsolved navigation.",
                gradient: "from-cyan-500 to-blue-500",
              },
              {
                icon: Search,
                title: "Problems Explorer",
                description:
                  "Browse 2000+ problems with filters for difficulty, topics, companies, and curated lists.",
                gradient: "from-indigo-500 to-purple-500",
              },
              {
                icon: Trophy,
                title: "Streak Milestones",
                description:
                  "Celebrate at 7, 14, 30, 50, 100, and 365 days. Badge shows your streak on the icon.",
                gradient: "from-orange-500 to-red-500",
              },
              {
                icon: Calendar,
                title: "30-Day Heatmap",
                description:
                  "Beautiful activity visualization. Color intensity shows problems solved each day.",
                gradient: "from-emerald-500 to-green-500",
              },
              {
                icon: Building2,
                title: "Company Tags",
                description:
                  "See which FAANG companies ask each problem with frequency counts. Track company-specific progress.",
                gradient: "from-blue-500 to-indigo-500",
              },
              {
                icon: Tag,
                title: "Topic & Company Progress",
                description:
                  "Track solved/total for your target topics and companies with intersection views.",
                gradient: "from-amber-500 to-orange-500",
              },
              {
                icon: Bell,
                title: "Smart Reminders",
                description:
                  "Custom reminder times + urgent alert 2 hours before midnight streak reset.",
                gradient: "from-purple-500 to-pink-500",
              },
              {
                icon: Settings,
                title: "Flexible Streak Rules",
                description:
                  "Choose what counts: Daily Challenge, curated lists, topic/company problems, or any submission.",
                gradient: "from-red-500 to-orange-500",
              },
              {
                icon: BarChart3,
                title: "Your Stats",
                description:
                  "Total solved, Easy/Medium/Hard breakdown. Syncs automatically with your LeetCode account.",
                gradient: "from-cyan-500 to-blue-500",
              },
              {
                icon: Database,
                title: "Data Export & Import",
                description:
                  "Backup and restore all your progress as JSON. Your data, your control.",
                gradient: "from-emerald-500 to-teal-500",
              },
              {
                icon: Shield,
                title: "Privacy-First",
                description:
                  "All data stored locally. No tracking, no ads, no account required. Free forever.",
                gradient: "from-yellow-500 to-amber-500",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="group relative p-4 sm:p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/[0.04] transition-all duration-300"
              >
                <div
                  className={`w-10 h-10 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Smart Reminders Showcase */}
      <section
        ref={notificationSectionRef}
        aria-label="Smart LeetCode Reminders"
        className="notification-showcase py-12 sm:py-16 px-4 sm:px-6 border-t border-white/5 overflow-hidden"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 mb-4">
              <Bell className="w-3 h-3 text-purple-400" />
              <span className="text-xs text-purple-200/90">Smart Reminders</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">
              Smart LeetCode{" "}
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                streak reminders
              </span>
            </h2>
            <p className="text-sm text-white/50 max-w-md mx-auto">
              Intelligent notifications that nudge you before your daily coding streak resets
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
            {/* Chrome Notification + Badge States */}
            <div className="chrome-notification">
              <div className="bg-[#1a1a1a] rounded-xl p-5 border border-white/10">
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-xs text-white/50">Daily Reminder</span>
                </div>
                <div className="bg-[#2a2a2a] rounded-lg p-3 mb-4">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shrink-0">
                      <Flame className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <span className="font-medium text-sm block">LeetDaily</span>
                      <p className="text-xs text-white/60">&#x1F525; Your 7-day streak is waiting!</p>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center text-xs text-white/40">
                  <span>Reminder at 9:00 AM</span>
                  <div className="flex gap-3">
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded bg-emerald-500 flex items-center justify-center text-[7px]">&#x2713;</div>
                      <span>Solved</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded bg-orange-500 flex items-center justify-center text-[7px]">7</div>
                      <span>Pending</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Streak Warning + Schedule */}
            <div className="streak-warning">
              <div className="bg-gradient-to-br from-red-500/10 to-orange-500/10 rounded-xl p-5 border border-red-500/20">
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle className="w-3 h-3 text-red-400" />
                  <span className="text-xs text-white/50">Urgent Alert (10:00 PM)</span>
                </div>
                <div className="bg-red-500/10 rounded-lg p-3 border border-red-500/20 mb-4">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-full bg-red-500/30 flex items-center justify-center shrink-0 animate-pulse">
                      <AlertTriangle className="w-5 h-5 text-red-400" />
                    </div>
                    <div className="flex-1">
                      <span className="font-semibold text-red-400 block">Streak at Risk!</span>
                      <p className="text-xs text-white/60">&#x23F0; 2 hours left before reset</p>
                    </div>
                  </div>
                </div>
                <button className="w-full py-2 rounded-lg bg-red-500 text-xs font-medium flex items-center justify-center gap-2 hover:bg-red-600 transition-colors">
                  <Zap className="w-3 h-3" />
                  Solve Now — Save Your Streak
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section aria-label="How to start tracking your LeetCode streak" className="py-12 sm:py-24 px-4 sm:px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
              Start tracking your LeetCode streak in{" "}
              <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                30 seconds
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Install",
                description: "Add LeetDaily from Chrome Web Store. It's free.",
              },
              {
                step: "2",
                title: "Sign in",
                description:
                  "Log into LeetCode to sync your streak and progress.",
              },
              {
                step: "3",
                title: "Stay consistent",
                description: "Click daily, solve, and watch your streak grow.",
              },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  {item.step}
                </div>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-white/50">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social proof */}
      <section aria-label="Developer reviews and testimonials" className="py-12 sm:py-24 px-4 sm:px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="sr-only">Trusted by 1000+ LeetCode developers</h2>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
              <Users className="w-4 h-4 text-orange-400" />
              <span className="text-sm text-white/70">
                Trusted by 1000+ developers
              </span>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                quote:
                  "The company tags are a game-changer for my Google interview prep!",
                name: "Alex Chen",
                role: "Software Engineer",
              },
              {
                quote:
                  "Hit my 100-day streak thanks to the milestone celebrations!",
                name: "Sarah Kim",
                role: "CS Student",
              },
              {
                quote:
                  "Smart reminders saved my streak multiple times. Love the 2-hour alert!",
                name: "Mike Rodriguez",
                role: "Senior Dev @ Meta",
              },
            ].map((testimonial, i) => (
              <div
                key={i}
                className="p-4 sm:p-6 rounded-2xl bg-white/[0.02] border border-white/5"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star
                      key={j}
                      className="w-4 h-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-white/70 mb-4 text-sm leading-relaxed">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-xs font-bold">
                    {testimonial.name[0]}
                  </div>
                  <div>
                    <div className="text-sm font-medium">{testimonial.name}</div>
                    <div className="text-xs text-white/40">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section aria-label="Install LeetDaily Chrome Extension" className="py-12 sm:py-24 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="relative rounded-2xl sm:rounded-3xl bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20 p-5 sm:p-12 text-center overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMSIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
            <div className="relative">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
                Start your daily LeetCode challenge streak
              </h2>
              <p className="text-white/60 mb-8 max-w-md mx-auto">
                Join thousands of developers who never miss a daily coding challenge
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a
                  href="https://chromewebstore.google.com/detail/leetdaily/kpmmlpoonleloofchbbfnmicchmhehcf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white text-[#0a0a0a] font-semibold transition-all duration-300 hover:shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:scale-105"
                >
                  <Chrome className="w-5 h-5" />
                  <span>Add to Chrome — Free</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 mt-6 sm:mt-8 text-xs sm:text-sm text-white/40">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Free forever</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>No account required</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>No ads</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 sm:py-12 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                <Flame className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold">LeetDaily</span>
            </div>

            <div className="flex items-center gap-6">
              <a
                href="/blog"
                className="text-white/40 hover:text-white transition-colors text-sm"
              >
                Blog
              </a>
              {[
                {
                  icon: Globe,
                  href: "https://adityanarayan.co.in/",
                  label: "Portfolio",
                },
                {
                  icon: Linkedin,
                  href: "https://www.linkedin.com/in/adityanarayan29/",
                  label: "LinkedIn",
                },
                {
                  icon: Github,
                  href: "https://github.com/AdityaNarayan29/",
                  label: "GitHub",
                },
                {
                  icon: Twitter,
                  href: "https://x.com/Adityanaraynn29",
                  label: "Twitter",
                },
              ].map((link, i) => (
                <a
                  key={i}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/40 hover:text-white transition-colors"
                  title={link.label}
                >
                  <link.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-white/5 text-center text-sm text-white/40">
            <p>
              Built for developers, by developers. &copy; 2026 LeetDaily.
              Privacy-first.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
