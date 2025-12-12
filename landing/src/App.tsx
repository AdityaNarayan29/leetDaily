import {
  Chrome,
  Flame,
  BarChart3,
  Tag,
  Link,
  CheckCircle,
  Github,
  Twitter,
  Target,
  Zap,
  Users,
  Star,
  Linkedin,
  Globe,
} from "lucide-react";

function App() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black'>
      {/* Hero Section */}
      <div className='relative overflow-hidden'>
        <div className='absolute inset-0 bg-gradient-to-r from-orange-600/20 to-red-600/20 backdrop-blur-3xl'></div>
        <div className='relative max-w-6xl mx-auto px-6 py-20'>
          <div className='text-center'>
            <div className='inline-flex items-center gap-2 bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-full px-4 py-2 mb-8 backdrop-blur-sm'>
              <Chrome className='w-4 h-4 text-orange-400' />
              <span className='text-sm font-medium text-orange-200'>
                Chrome Extension
              </span>
            </div>

            <h1 className='text-5xl md:text-7xl font-bold text-white mb-6 leading-tight'>
              Never Miss a LeetCode
              <br />
              <span className='bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent'>
                Daily Challenge Again
              </span>
              <span className='text-4xl md:text-6xl ml-4'>🚀</span>
            </h1>

            <p className='text-xl md:text-2xl text-gray-300 mb-10 max-w-4xl mx-auto leading-relaxed'>
              LeetDaily brings the Daily LeetCode Challenge directly to your
              browser. One-click access, real-time insights, and streak tracking
              — stay consistent, stay interview-ready.
            </p>

            <div className='flex flex-col sm:flex-row gap-4 justify-center items-center'>
              <a
                href='https://chromewebstore.google.com/detail/leetdaily/kpmmlpoonleloofchbbfnmicchmhehcf'
                target='_blank'
                rel='noopener noreferrer'
              >
                <button className='group relative inline-flex items-center gap-3 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-semibold px-8 py-4 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl'>
                  <Chrome className='w-5 h-5' />
                  <span className='text-lg'>Add to Chrome</span>
                  <div className='absolute inset-0 bg-gradient-to-r from-orange-600/50 to-red-600/50 rounded-full blur opacity-75 group-hover:opacity-100 transition-opacity duration-300 -z-10'></div>
                </button>
              </a>

              <div className='flex items-center gap-2 text-gray-400 text-sm'>
                <Star className='w-4 h-4 fill-yellow-400 text-yellow-400' />
                <span>Free • No ads • Privacy-first</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className='max-w-6xl mx-auto px-6 py-20'>
        <div className='text-center mb-16'>
          <h2 className='text-3xl md:text-4xl font-bold text-white mb-4'>
            Everything You Need to Stay Consistent
          </h2>
          <p className='text-xl text-gray-400 max-w-2xl mx-auto'>
            Designed specifically for developers who want to maintain their
            coding edge
          </p>
        </div>

        <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {/* Feature 1 */}
          <div className='group bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 rounded-2xl p-8 backdrop-blur-sm hover:border-orange-500/50 transition-all duration-300 hover:transform hover:scale-105'>
            <div className='w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300'>
              <Flame className='w-6 h-6 text-white' />
            </div>
            <h3 className='text-xl font-semibold text-white mb-3'>
              Daily Challenge at a Glance
            </h3>
            <p className='text-gray-400 leading-relaxed'>
              Always up-to-date with the latest LeetCode Daily. See today's
              problem the moment you open a new tab.
            </p>
          </div>

          {/* Feature 2 */}
          <div className='group bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 rounded-2xl p-8 backdrop-blur-sm hover:border-orange-500/50 transition-all duration-300 hover:transform hover:scale-105'>
            <div className='w-12 h-12 bg-gradient-to-br from-orange-600 to-orange-400 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300'>
              <BarChart3 className='w-6 h-6 text-white' />
            </div>
            <h3 className='text-xl font-semibold text-white mb-3'>
              Difficulty & Acceptance Rate
            </h3>
            <p className='text-gray-400 leading-relaxed'>
              Instantly know what you're up against with clear difficulty
              indicators and success rates.
            </p>
          </div>

          {/* Feature 3 */}
          <div className='group bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 rounded-2xl p-8 backdrop-blur-sm hover:border-orange-500/50 transition-all duration-300 hover:transform hover:scale-105'>
            <div className='w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-500 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300'>
              <Tag className='w-6 h-6 text-white' />
            </div>
            <h3 className='text-xl font-semibold text-white mb-3'>
              Topic Tags
            </h3>
            <p className='text-gray-400 leading-relaxed'>
              Stay focused on Arrays, DP, Graphs, and more. Know exactly what
              concepts you're practicing.
            </p>
          </div>

          {/* Feature 4 */}
          <div className='group bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 rounded-2xl p-8 backdrop-blur-sm hover:border-orange-500/50 transition-all duration-300 hover:transform hover:scale-105'>
            <div className='w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300'>
              <Link className='w-6 h-6 text-white' />
            </div>
            <h3 className='text-xl font-semibold text-white mb-3'>
              One-Click Access
            </h3>
            <p className='text-gray-400 leading-relaxed'>
              Go straight to the problem, no login needed. Skip the navigation
              and jump right into coding.
            </p>
          </div>

          {/* Feature 5 */}
          <div className='group bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 rounded-2xl p-8 backdrop-blur-sm hover:border-orange-500/50 transition-all duration-300 hover:transform hover:scale-105'>
            <div className='w-12 h-12 bg-gradient-to-br from-orange-400 to-yellow-500 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300'>
              <CheckCircle className='w-6 h-6 text-white' />
            </div>
            <h3 className='text-xl font-semibold text-white mb-3'>
              Streak Tracker
            </h3>
            <p className='text-gray-400 leading-relaxed'>
              Visualize your daily consistency and boost motivation. Watch your
              streak grow day by day.
            </p>
          </div>

          {/* Feature 6 */}
          <div className='group bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 rounded-2xl p-8 backdrop-blur-sm hover:border-orange-500/50 transition-all duration-300 hover:transform hover:scale-105'>
            <div className='w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300'>
              <Zap className='w-6 h-6 text-white' />
            </div>
            <h3 className='text-xl font-semibold text-white mb-3'>
              Lightning Fast
            </h3>
            <p className='text-gray-400 leading-relaxed'>
              No ads. No clutter. Just pure LeetCode consistency in a clean,
              distraction-free interface.
            </p>
          </div>
        </div>
      </div>

      {/* Social Proof Section */}
      <div className='max-w-6xl mx-auto px-6 py-20 border-t border-gray-800/50'>
        <div className='text-center mb-12'>
          <div className='inline-flex items-center gap-2 bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-full px-6 py-3 mb-6 backdrop-blur-sm'>
            <Users className='w-5 h-5 text-orange-400' />
            <span className='text-lg font-medium text-orange-200'>
              Loved by 1000+ LeetCoders and counting
            </span>
          </div>

          <div className='grid md:grid-cols-3 gap-8'>
            <div className='bg-gradient-to-br from-gray-800/30 to-gray-900/30 border border-gray-700/30 rounded-xl p-6 backdrop-blur-sm'>
              <div className='flex items-center gap-1 mb-3'>
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className='w-4 h-4 fill-yellow-400 text-yellow-400'
                  />
                ))}
              </div>
              <p className='text-gray-300 mb-4'>
                "Finally, a clean way to track my daily LeetCode without getting
                distracted by other features. My streak has never been longer!"
              </p>
              <div className='flex items-center gap-3'>
                <div className='w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center'>
                  <span className='text-sm font-bold text-white'>A</span>
                </div>
                <div>
                  <div className='text-sm font-medium text-white'>
                    Alex Chen
                  </div>
                  <div className='text-xs text-gray-400'>Software Engineer</div>
                </div>
              </div>
            </div>

            <div className='bg-gradient-to-br from-gray-800/30 to-gray-900/30 border border-gray-700/30 rounded-xl p-6 backdrop-blur-sm'>
              <div className='flex items-center gap-1 mb-3'>
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className='w-4 h-4 fill-yellow-400 text-yellow-400'
                  />
                ))}
              </div>
              <p className='text-gray-300 mb-4'>
                "Perfect for my #100DaysOfCode challenge. The streak tracker
                keeps me motivated and accountable every single day."
              </p>
              <div className='flex items-center gap-3'>
                <div className='w-8 h-8 bg-gradient-to-br from-orange-600 to-amber-500 rounded-full flex items-center justify-center'>
                  <span className='text-sm font-bold text-white'>S</span>
                </div>
                <div>
                  <div className='text-sm font-medium text-white'>
                    Sarah Kim
                  </div>
                  <div className='text-xs text-gray-400'>CS Student</div>
                </div>
              </div>
            </div>

            <div className='bg-gradient-to-br from-gray-800/30 to-gray-900/30 border border-gray-700/30 rounded-xl p-6 backdrop-blur-sm'>
              <div className='flex items-center gap-1 mb-3'>
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className='w-4 h-4 fill-yellow-400 text-yellow-400'
                  />
                ))}
              </div>
              <p className='text-gray-300 mb-4'>
                "As a busy professional, this extension helps me stay sharp with
                just 15 minutes a day. Interview prep made simple."
              </p>
              <div className='flex items-center gap-3'>
                <div className='w-8 h-8 bg-gradient-to-br from-red-500 to-orange-600 rounded-full flex items-center justify-center'>
                  <span className='text-sm font-bold text-white'>M</span>
                </div>
                <div>
                  <div className='text-sm font-medium text-white'>
                    Mike Rodriguez
                  </div>
                  <div className='text-xs text-gray-400'>Senior Dev</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Why It Matters Section */}
      <div className='max-w-6xl mx-auto px-6 py-20'>
        <div className='bg-gradient-to-r from-gray-900/50 to-black/50 border border-orange-500/30 rounded-3xl p-12 backdrop-blur-sm'>
          <div className='text-center'>
            <Target className='w-16 h-16 text-orange-400 mx-auto mb-6' />
            <h2 className='text-3xl md:text-4xl font-bold text-white mb-6'>
              Why Daily Consistency Matters
            </h2>
            <p className='text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed'>
              Building a daily coding habit isn't just about solving
              problems—it's about staying interview-ready, sharpening your
              problem-solving skills, and maintaining your competitive edge in
              tech.
            </p>

            <div className='grid md:grid-cols-3 gap-8 mt-12'>
              <div className='text-center'>
                <div className='text-3xl font-bold text-orange-400 mb-2'>
                  🎯
                </div>
                <h3 className='text-lg font-semibold text-white mb-2'>
                  Build Habits
                </h3>
                <p className='text-gray-400'>
                  Turn coding practice into an automatic daily routine
                </p>
              </div>

              <div className='text-center'>
                <div className='text-3xl font-bold text-orange-500 mb-2'>
                  💼
                </div>
                <h3 className='text-lg font-semibold text-white mb-2'>
                  Stay Interview-Ready
                </h3>
                <p className='text-gray-400'>
                  Always prepared for that dream job opportunity
                </p>
              </div>

              <div className='text-center'>
                <div className='text-3xl font-bold text-amber-400 mb-2'>📈</div>
                <h3 className='text-lg font-semibold text-white mb-2'>
                  Stay Accountable
                </h3>
                <p className='text-gray-400'>
                  Visual progress tracking keeps you motivated
                </p>
              </div>
            </div>

            <div className='mt-10 p-6 bg-gradient-to-r from-gray-800/50 to-gray-900/50 border border-gray-700/50 rounded-xl'>
              <p className='text-lg text-gray-300'>
                <span className='font-semibold text-white'>
                  "No ads. No clutter. Just pure LeetCode consistency."
                </span>
                <br />
                <span className='text-sm text-gray-400 mt-2 block'>
                  Focus on what matters most—your growth as a developer.
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className='border-t border-gray-800/50 py-12'>
        <div className='max-w-6xl mx-auto px-6'>
          <div className='flex flex-col md:flex-row justify-between items-center'>
            <a
              href='https://chromewebstore.google.com/detail/leetdaily/kpmmlpoonleloofchbbfnmicchmhehcf'
              target='_blank'
              rel='noopener noreferrer'
            >
              <div className='flex items-center gap-2 mb-4 md:mb-0'>
                <div className='w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center'>
                  <Flame className='w-5 h-5 text-white' />
                </div>
                <span className='text-xl font-bold text-white'>LeetDaily</span>
              </div>
            </a>

            <div className='flex items-center gap-6'>
              <a
                href='https://adityanarayan.co.in/'
                className='text-gray-400 hover:text-white transition-colors duration-300 flex items-center gap-2'
              >
                <Globe className='w-5 h-5' />
                <span>Portfolio</span>
              </a>
              <a
                href='https://www.linkedin.com/in/adityanarayan29/'
                className='text-gray-400 hover:text-white transition-colors duration-300 flex items-center gap-2'
              >
                <Linkedin className='w-5 h-5' />
                <span>LinkedIn</span>
              </a>
              <a
                href='https://github.com/AdityaNarayan29/'
                className='text-gray-400 hover:text-white transition-colors duration-300 flex items-center gap-2'
              >
                <Github className='w-5 h-5' />
                <span>GitHub</span>
              </a>
              <a
                href='https://x.com/Adityanaraynn29'
                className='text-gray-400 hover:text-white transition-colors duration-300 flex items-center gap-2'
              >
                <Twitter className='w-5 h-5' />
                <span>Twitter</span>
              </a>
            </div>
          </div>

          <div className='mt-8 pt-8 border-t border-gray-800/50 text-center'>
            <p className='text-gray-400'>
              <span className='font-medium text-white'>
                Built for developers, by developers.
              </span>
              <br />
              <span className='text-sm'>
                © 2025 LeetDaily. Privacy-first. No data collection.
              </span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
