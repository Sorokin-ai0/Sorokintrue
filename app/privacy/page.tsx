import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <header className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link
            href="/"
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </Link>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Privacy Policy
          </h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="card p-8 prose dark:prose-invert max-w-none">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Last updated: January 1, 2025
          </p>

          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">1. Information We Collect</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            SorokinAi collects the following information: your email address during account registration; chat messages and prompts you send through the Service; images you upload for analysis; usage data including model selection and frequency of use; and basic device and browser information for security and analytics purposes.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">2. How We Use Your Information</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            We use your information to: provide and maintain the Service, including processing your queries through our AI models; manage your account and authentication; enforce usage limits and track daily quotas; improve the Service and user experience; communicate with you about Service updates; and comply with legal obligations.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">3. Data Storage and Security</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Your data is stored securely using Supabase, which provides enterprise-grade security with Row Level Security (RLS) policies ensuring that users can only access their own data. Chat history and user data are encrypted at rest and in transit. We implement industry-standard security measures to protect against unauthorized access, alteration, or destruction.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">4. Third-Party Services</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            SorokinAi integrates with third-party AI services for processing. Your prompts and uploaded images are sent to our AI provider&apos;s servers for processing. Please review our provider&apos;s privacy policies for information on how they handle data. We also use Supabase for authentication and data storage, subject to Supabase&apos;s privacy policy.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">5. Data Retention</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Your chat history is retained until you choose to delete it through the Settings page. Account information is retained for the duration of your account. Usage logs are retained for operational purposes and may be aggregated for analytics. Upon account deletion, we will remove your personal data within 30 days.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">6. Your Rights</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            You have the right to: access your personal data; delete your chat history at any time; request deletion of your account and associated data; opt out of non-essential communications; and request a copy of your data. To exercise these rights, contact us at privacy@sorokinai.com.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">7. Children&apos;s Privacy</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            SorokinAi is not intended for children under 13. We do not knowingly collect personal information from children under 13. If we learn that we have collected personal information from a child under 13, we will take steps to delete that information promptly.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">8. Contact</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            For privacy-related inquiries, please contact us at privacy@sorokinai.com.
          </p>
        </div>
      </main>
    </div>
  );
}
