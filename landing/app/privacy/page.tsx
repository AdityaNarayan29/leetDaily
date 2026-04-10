export const metadata = {
  title: "Privacy Policy — LeetDaily",
  description: "Privacy policy for the LeetDaily Chrome extension.",
};

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-[#e0e0e0] px-6 py-16 max-w-2xl mx-auto font-sans">
      <h1 className="text-3xl font-bold text-white mb-2">Privacy Policy</h1>
      <p className="text-sm text-[#888] mb-10">Last updated: April 10, 2026</p>

      <section className="space-y-8 text-sm leading-relaxed text-[#bbb]">
        <div>
          <h2 className="text-lg font-semibold text-white mb-2">Overview</h2>
          <p>
            LeetDaily is a Chrome extension for LeetCode interview preparation. We are committed to
            protecting your privacy. This policy explains what data we collect, how we use it, and
            your rights.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-white mb-2">Data We Collect</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong className="text-white">LeetCode username and avatar</strong> — fetched from
              LeetCode when you are signed in. Used to display your profile and sync preferences.
            </li>
            <li>
              <strong className="text-white">Solve history</strong> — which problems you have solved,
              stored locally on your device in <code className="text-[#ffa116]">chrome.storage.local</code>.
              Never sent to any server.
            </li>
            <li>
              <strong className="text-white">Preferences</strong> — your streak settings, reminder time,
              badge display, and focus areas. Synced to our Cloudflare Workers KV store, keyed by your
              LeetCode username, so your settings appear on other devices.
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-white mb-2">Data We Do NOT Collect</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>We do not collect your email, password, or any personal information.</li>
            <li>We do not track your browsing history or activity outside of LeetCode.</li>
            <li>We do not use analytics, cookies, or third-party tracking services.</li>
            <li>We do not serve ads.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-white mb-2">How Data Is Stored</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong className="text-white">Locally</strong> — solve history, streaks, and progress
              are stored in your browser using <code className="text-[#ffa116]">chrome.storage.local</code>.
              This data never leaves your device.
            </li>
            <li>
              <strong className="text-white">Cloud (preferences only)</strong> — your settings are
              synced via <code className="text-[#ffa116]">leetdaily-prefs.leetdaily.workers.dev</code>,
              a Cloudflare Workers endpoint. Only preferences (reminder time, badge settings, focus areas)
              are synced — no solve history or personal data.
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-white mb-2">Third-Party Services</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong className="text-white">LeetCode API</strong> — we make read-only GraphQL requests
              to <code className="text-[#ffa116]">leetcode.com/graphql</code> to fetch your stats,
              streak, daily challenge, and submission history. These are the same requests your browser
              makes when you visit LeetCode.
            </li>
            <li>
              <strong className="text-white">Cloudflare Workers</strong> — used for cross-device
              preference sync. Hosted at <code className="text-[#ffa116]">leetdaily-prefs.leetdaily.workers.dev</code>.
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-white mb-2">Permissions</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong className="text-white">Storage</strong> — save your progress and settings locally.</li>
            <li><strong className="text-white">Alarms</strong> — schedule daily reminder notifications.</li>
            <li><strong className="text-white">Notifications</strong> — show streak reminders.</li>
            <li><strong className="text-white">Host permissions (leetcode.com)</strong> — detect problem submissions and fetch your data.</li>
            <li><strong className="text-white">Host permissions (leetdaily-prefs.leetdaily.workers.dev)</strong> — sync preferences only.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-white mb-2">Data Deletion</h2>
          <p>
            Uninstalling the extension removes all locally stored data. To delete your synced
            preferences from our cloud, uninstall the extension — your data will be automatically
            removed after 90 days of inactivity.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-white mb-2">Contact</h2>
          <p>
            If you have questions about this privacy policy, contact us at{" "}
            <a href="mailto:aditya@masst.dev" className="text-[#ffa116] hover:underline">
              aditya@masst.dev
            </a>
            .
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-white mb-2">Changes</h2>
          <p>
            We may update this policy from time to time. Changes will be posted on this page with an
            updated date.
          </p>
        </div>
      </section>

      <footer className="mt-16 pt-8 border-t border-[#ffffff0d] text-xs text-[#555]">
        <a href="/" className="text-[#ffa116] hover:underline">← Back to LeetDaily</a>
      </footer>
    </main>
  );
}
