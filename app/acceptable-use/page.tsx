import Link from "next/link";

export default function AcceptableUsePage() {
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
            Acceptable Use Policy
          </h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="card p-8 prose dark:prose-invert max-w-none">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Last updated: January 1, 2025
          </p>

          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">1. Purpose</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            This Acceptable Use Policy (&quot;AUP&quot;) governs your use of SorokinAi and is designed to ensure a safe, respectful, and productive environment for all users. By using the Service, you agree to comply with this policy. Violations may result in suspension or termination of your account.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">2. Prohibited Uses</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-2">You may not use SorokinAi to:</p>
          <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4 space-y-1">
            <li>Generate content that is illegal, harmful, threatening, abusive, harassing, defamatory, or otherwise objectionable</li>
            <li>Create, distribute, or facilitate the spread of malware, viruses, or malicious code</li>
            <li>Attempt to gain unauthorized access to other users&apos; accounts or data</li>
            <li>Circumvent or attempt to circumvent usage limits or security measures</li>
            <li>Use the Service for spam, phishing, or social engineering attacks</li>
            <li>Generate content that infringes upon intellectual property rights of others</li>
            <li>Impersonate another person or entity</li>
            <li>Use automated tools, bots, or scripts to access the Service beyond normal use</li>
          </ul>

          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">3. Content Guidelines</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            While SorokinAi supports a wide range of queries and creative uses, users must not use the Service to generate content promoting violence, hate speech, discrimination, exploitation of minors, or non-consensual intimate imagery. AI-generated content should be used responsibly and ethically. Users are responsible for how they use and share AI-generated outputs.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">4. Usage Limits</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Free tier users are subject to daily usage limits as displayed in the application. These limits reset at midnight UTC each day. Attempting to circumvent these limits through multiple accounts, automated requests, or other means is strictly prohibited and may result in account termination.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">5. Image Uploads</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            When uploading images for analysis, you must ensure you have the right to share those images. Do not upload images containing sensitive personal information of others, explicit content, or copyrighted material without authorization. Uploaded images are processed through our AI provider and are subject to their content policies.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">6. Enforcement</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            SorokinAi reserves the right to investigate and take action against any violations of this AUP. Actions may include warnings, temporary suspension, permanent account termination, or reporting to law enforcement if required by law. We encourage users to report violations to abuse@sorokinai.com.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">7. Contact</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            For questions about this policy, please contact us at abuse@sorokinai.com.
          </p>
        </div>
      </main>
    </div>
  );
}
