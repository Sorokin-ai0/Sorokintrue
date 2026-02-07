import Link from "next/link";

export default function TermsPage() {
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
            Terms of Service
          </h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="card p-8 prose dark:prose-invert max-w-none">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Last updated: January 1, 2025
          </p>

          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">1. Acceptance of Terms</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            By accessing and using SorokinAi (&quot;the Service&quot;), you agree to be bound by these Terms of Service (&quot;Terms&quot;). If you do not agree to these Terms, you may not access or use the Service. SorokinAi reserves the right to modify these Terms at any time. Continued use of the Service after changes constitutes acceptance of the updated Terms.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">2. Eligibility</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            You must be at least 13 years of age and a resident of the United States to use SorokinAi. By creating an account, you represent and warrant that you meet these eligibility requirements. SorokinAi reserves the right to verify eligibility and terminate accounts that do not comply.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">3. User Accounts</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify SorokinAi immediately of any unauthorized use. SorokinAi is not liable for losses arising from unauthorized use of your account.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">4. Use of the Service</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            SorokinAi provides access to AI-powered chat capabilities through advanced language models. The Service is provided &quot;as is&quot; and &quot;as available.&quot; AI-generated responses may not always be accurate, complete, or current. You should independently verify important information. Free tier users receive limited daily queries per model as displayed in the application.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">5. Intellectual Property</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Content generated through the Service using your prompts belongs to you, subject to applicable laws. You grant SorokinAi a limited license to process your inputs solely for the purpose of providing the Service. SorokinAi&apos;s branding, design, and platform code remain the property of SorokinAi.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">6. Limitation of Liability</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            To the fullest extent permitted by law, SorokinAi shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the Service. SorokinAi&apos;s total liability shall not exceed the amounts paid by you, if any, for access to the Service during the twelve months prior to the claim.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">7. Termination</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            SorokinAi may suspend or terminate your access to the Service at any time, with or without cause and without notice. Upon termination, your right to use the Service ceases immediately. Provisions that by their nature should survive termination shall remain in effect.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">8. Contact</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            For questions regarding these Terms, please contact us at support@sorokinai.com.
          </p>
        </div>
      </main>
    </div>
  );
}
