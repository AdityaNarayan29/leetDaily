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
  Clock,
  ArrowRight,
  Sparkles,
  Shield,
  Check,
  Copy,
  Settings,
  ChevronDown,
  AlertTriangle,
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
        .from(".popup-problem", { opacity: 0, y: 20, duration: 0.5 }, "-=0.3");

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

      // Pulse animation for solve button
      gsap.to(".solve-btn", {
        boxShadow: "0 0 20px rgba(249, 115, 22, 0.5)",
        duration: 1,
        repeat: -1,
        yoyo: true,
        delay: 3,
      });

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
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 -left-4 w-96 h-96 bg-orange-500/30 rounded-full mix-blend-multiply filter blur-[128px] animate-pulse" />
        <div className="absolute top-0 -right-4 w-96 h-96 bg-red-500/20 rounded-full mix-blend-multiply filter blur-[128px] animate-pulse delay-1000" />
        <div className="absolute -bottom-8 left-1/2 w-96 h-96 bg-amber-500/20 rounded-full mix-blend-multiply filter blur-[128px] animate-pulse delay-500" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-[#0a0a0a]/80 border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
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
                Free Chrome extension for daily LeetCode challenges, FAANG company tags, streak tracking & smart coding interview reminders — one click from your toolbar.
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
            <div className="relative mx-auto lg:mx-0 max-w-sm sm:max-w-md lg:max-w-none">
              {/* Browser Mockup with Extension */}
              <div className="relative">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-3xl blur-3xl scale-110" />

            {/* Browser Window */}
            <div className="relative bg-[#1a1a1a] rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
              {/* Browser Toolbar */}
              <div className="flex items-center justify-between px-4 py-3 bg-[#0d0d0d] border-b border-white/5">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/60" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                  <div className="w-3 h-3 rounded-full bg-green-500/60" />
                </div>
                <div className="flex-1 mx-4 max-w-lg">
                  <div className="bg-white/5 rounded-lg px-4 py-1.5 text-xs text-white/40 text-center">
                    mail.google.com/mail/u/0/#inbox
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {/* Other extension icons */}
                  <div className="w-5 h-5 rounded bg-white/10" />
                  <div className="w-5 h-5 rounded bg-white/10" />

                  {/* LeetDaily Extension Icon with blinking badge */}
                  <div className="extension-icon-demo relative cursor-pointer">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-lg shadow-orange-500/30 hover:scale-110 transition-transform">
                      <Flame className="w-4 h-4 text-white" />
                    </div>
                    {/* Blinking badge */}
                    <div className="icon-badge-blink absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 flex items-center justify-center text-[9px] font-bold border-2 border-[#0d0d0d] shadow-lg shadow-red-500/50">
                      7
                    </div>
                  </div>
                </div>
              </div>

              {/* Browser Content Area with Popup */}
              <div className="relative p-3 sm:p-4 bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] min-h-[420px] sm:min-h-[620px]">
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
                  className="sm:absolute sm:top-4 sm:right-4 mt-4 sm:mt-0 bg-[#1a1a1a] rounded-2xl border border-white/10 shadow-2xl overflow-hidden z-10 w-full sm:w-[360px]"
                >
              {/* Popup Header */}
              <div className="popup-header p-4 border-b border-white/5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-sm font-bold">
                        A
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-[#1a1a1a]" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium">AdityaNarayan29</div>
                      <div className="text-xs text-white/50">
                        Daily LeetCode Kro
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-[10px] text-white/40">New in: 5h 23m</div>
                    <div className="streak-counter flex items-center gap-0.5">
                      <span className="text-sm leading-none">&#x1F525;</span>
                      <span className="text-sm font-bold text-orange-400">7</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Panel */}
              <div className="popup-stats p-4">
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-white/50">Solved</span>
                    <span className="text-lg font-bold">473</span>
                  </div>
                  <div className="flex gap-4 text-sm">
                    <div className="text-center">
                      <span className="font-semibold text-emerald-400">118</span>
                      <span className="text-white/40 ml-1">Easy</span>
                    </div>
                    <div className="text-center">
                      <span className="font-semibold text-orange-400">289</span>
                      <span className="text-white/40 ml-1">Med</span>
                    </div>
                    <div className="text-center">
                      <span className="font-semibold text-red-400">66</span>
                      <span className="text-white/40 ml-1">Hard</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 30-Day Heatmap */}
              <div className="popup-heatmap px-4 pb-4">
                <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium">30-Day Activity</span>
                      <span className="text-xs text-emerald-400 font-medium">
                        27/30 daily
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-white/40">
                      <span>Less</span>
                      <div className="flex gap-0.5">
                        <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }} />
                        <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: 'rgba(44,187,93,0.25)' }} />
                        <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: 'rgba(44,187,93,0.5)' }} />
                        <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: 'rgba(44,187,93,1)' }} />
                      </div>
                      <span>More</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-15 gap-1 w-full">
                    {[...Array(30)].map((_, i) => {
                      // Predefined pattern for realistic heatmap look
                      const pattern = [
                        3, 2, 3, 1, 3, 2, 0, 3, 3, 2, 1, 3, 2, 3, 1,
                        2, 3, 1, 3, 2, 3, 0, 2, 3, 3, 1, 2, 3, 2, 4,
                      ];
                      const level = pattern[i];
                      const colors = [
                        { bg: 'rgba(255,255,255,0.1)' }, // 0 - empty
                        { bg: 'rgba(44,187,93,0.25)' }, // 1 - low
                        { bg: 'rgba(44,187,93,0.5)' }, // 2 - medium
                        { bg: 'rgba(44,187,93,1)' }, // 3 - high
                        { bg: 'rgba(249,115,22,0.5)', ring: true }, // 4 - today
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

              {/* Problem Section */}
              <div className="popup-problem px-4 pb-4">
                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                  {/* Problem Title */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-white/50 text-sm">3417.</span>
                        <span className="font-medium">Zigzag Grid Traversal</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-emerald-400 font-medium">Easy</span>
                        <span className="text-white/30">·</span>
                        <span className="text-white/50">78.2% acceptance</span>
                      </div>
                    </div>
                    <button className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white/40 hover:text-white">
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Topics & Companies */}
                  <div className="space-y-2 mb-4">
                    {/* Topics Row */}
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1.5 text-white/50 shrink-0">
                        <svg
                          className="w-3 h-3"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                        </svg>
                        <span className="text-[10px] font-medium">Topics</span>
                        <span className="text-white/20">&rsaquo;</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        <span className="tag-chip px-2 py-0.5 rounded text-[10px] bg-white/10 text-white/70 hover:bg-white/20 cursor-pointer transition-colors">
                          Array
                        </span>
                        <span className="tag-chip px-2 py-0.5 rounded text-[10px] bg-white/10 text-white/70 hover:bg-white/20 cursor-pointer transition-colors">
                          Matrix
                        </span>
                        <span className="tag-chip px-2 py-0.5 rounded text-[10px] bg-white/10 text-white/70 hover:bg-white/20 cursor-pointer transition-colors">
                          Simulation
                        </span>
                      </div>
                    </div>

                    {/* Companies Row */}
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1.5 text-white/50 shrink-0">
                        <Building2 className="w-3 h-3" />
                        <span className="text-[10px] font-medium">Companies</span>
                        <span className="text-white/20">&rsaquo;</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        <span className="tag-chip px-2 py-0.5 rounded text-[10px] bg-orange-500/20 text-orange-300 hover:bg-orange-500/30 cursor-pointer transition-colors">
                          Google (12)
                        </span>
                        <span className="tag-chip px-2 py-0.5 rounded text-[10px] bg-orange-500/20 text-orange-300 hover:bg-orange-500/30 cursor-pointer transition-colors">
                          Meta (8)
                        </span>
                        <span className="tag-chip px-2 py-0.5 rounded text-[10px] bg-orange-500/20 text-orange-300 hover:bg-orange-500/30 cursor-pointer transition-colors">
                          +3
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Solve Button */}
                  <button className="solve-btn w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 font-semibold text-sm flex items-center justify-center gap-2 hover:from-orange-600 hover:to-red-600 transition-all">
                    <Check className="w-4 h-4" />
                    Solve Challenge
                  </button>
                </div>
              </div>

              {/* Yesterday's Problem */}
              <div className="px-4 pb-4">
                <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                  <div className="flex items-center justify-between">
                    <div className="text-left">
                      <span className="text-[10px] text-white/40 block mb-0.5">
                        Missed yesterday?
                      </span>
                      <span className="text-xs text-white/70 hover:text-orange-400 cursor-pointer transition-colors">
                        3416. Count Substrings With K-Frequency
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-white/30 shrink-0" />
                  </div>
                </div>
              </div>

              {/* Settings - Expanded */}
              <div className="px-4 pb-4">
                <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                  <div className="flex items-center justify-between text-xs text-white/50 pb-2 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <Settings className="w-3 h-3" />
                      <span>Settings</span>
                    </div>
                    <ChevronDown className="w-3 h-3 rotate-180" />
                  </div>
                  {/* Daily Reminder Toggle */}
                  <div className="flex items-center justify-between py-2.5 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <Bell className="w-3 h-3 text-white/50" />
                      <span className="text-xs text-white/70">Daily Reminder</span>
                    </div>
                    <div className="w-8 h-4 bg-orange-500 rounded-full relative">
                      <div className="absolute right-0.5 top-0.5 w-3 h-3 bg-white rounded-full" />
                    </div>
                  </div>
                  {/* Reminder Time */}
                  <div className="flex items-center justify-between py-2.5 border-b border-white/10">
                    <span className="text-xs text-white/50">Reminder Time</span>
                    <span className="text-xs text-white/70">9:00 AM</span>
                  </div>
                  {/* Show Badge */}
                  <div className="flex items-center justify-between pt-2.5">
                    <div className="flex items-center gap-2">
                      <Trophy className="w-3 h-3 text-white/50" />
                      <span className="text-xs text-white/70">Show Streak Badge</span>
                    </div>
                    <div className="w-8 h-4 bg-orange-500 rounded-full relative">
                      <div className="absolute right-0.5 top-0.5 w-3 h-3 bg-white rounded-full" />
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
      <section aria-label="LeetCode Chrome Extension Features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
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
                  "See which FAANG companies ask each problem with frequency counts.",
                gradient: "from-blue-500 to-indigo-500",
              },
              {
                icon: Bell,
                title: "Smart Reminders",
                description:
                  "Custom reminder times + urgent alert 2 hours before midnight reset.",
                gradient: "from-purple-500 to-pink-500",
              },
              {
                icon: BarChart3,
                title: "Your Stats",
                description:
                  "Total solved, Easy/Medium/Hard breakdown. Syncs with your LeetCode account.",
                gradient: "from-cyan-500 to-blue-500",
              },
              {
                icon: Clock,
                title: "Yesterday's Problem",
                description:
                  "Missed yesterday? Quick link to catch up without searching.",
                gradient: "from-red-500 to-orange-500",
              },
              {
                icon: Tag,
                title: "Topic Tags",
                description:
                  "Clickable tags for Arrays, DP, Graphs. Jump to similar problems instantly.",
                gradient: "from-amber-500 to-orange-500",
              },
              {
                icon: Zap,
                title: "Lightning Fast",
                description:
                  "One click to solve. Copy link to share. Zero ads, zero clutter.",
                gradient: "from-yellow-500 to-amber-500",
              },
              {
                icon: Flame,
                title: "Daily Challenge",
                description:
                  "Today's problem with difficulty, acceptance rate, and countdown timer.",
                gradient: "from-orange-500 to-red-500",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="group relative p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/[0.04] transition-all duration-300"
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
        className="notification-showcase py-16 px-6 border-t border-white/5"
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
      <section aria-label="How to start tracking your LeetCode streak" className="py-24 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
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
      <section aria-label="Developer reviews and testimonials" className="py-24 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
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
                className="p-6 rounded-2xl bg-white/[0.02] border border-white/5"
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
      <section aria-label="Install LeetDaily Chrome Extension" className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="relative rounded-3xl bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20 p-12 text-center overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMSIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
            <div className="relative">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
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

              <div className="flex items-center justify-center gap-6 mt-8 text-sm text-white/40">
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
      <footer className="border-t border-white/5 py-12 px-6">
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
