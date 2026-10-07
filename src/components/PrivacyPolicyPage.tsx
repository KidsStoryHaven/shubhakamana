import React, { useEffect } from 'react';
import { ShieldCheck, Lock, Eye, Cookie, Info, Mail, ArrowLeft, ExternalLink } from 'lucide-react';
import { updatePageSEO } from '../utils/seoManager';

interface PrivacyPolicyPageProps {
  onGoHome: () => void;
  onNavigateTo: (path: string) => void;
}

export const PrivacyPolicyPage: React.FC<PrivacyPolicyPageProps> = ({ onGoHome, onNavigateTo }) => {
  useEffect(() => {
    updatePageSEO({
      title: 'Privacy Policy | Shubhakamna.in - Transparent Data & Cookie Policy',
      description: 'Read the official Privacy Policy for Shubhakamna.in. Learn how we handle visitor information, cookies, Google AdSense, analytics, and user privacy rights.',
      keywords: 'privacy policy, shubhakamna privacy, data policy, cookie policy, google adsense privacy',
      canonicalUrl: 'https://shubhakamna.in/privacy-policy/',
      ogType: 'article',
      robots: 'noindex, nofollow, noarchive'
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const lastUpdatedDate = 'October 2026';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-stone-400 font-medium">
        <button 
          onClick={onGoHome}
          className="hover:text-amber-400 flex items-center gap-1 transition cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Home</span>
        </button>
        <span>/</span>
        <span className="text-amber-300 font-semibold" aria-current="page">Privacy Policy</span>
      </nav>

      {/* Header */}
      <header className="space-y-3 border-b border-amber-500/20 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Last Updated: {lastUpdatedDate}</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white font-serif tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-sm sm:text-base text-stone-300 leading-relaxed max-w-3xl">
          At Shubhakamna.in, accessible from https://shubhakamna.in, protecting the privacy and personal data of our visitors is one of our primary priorities. This Privacy Policy document outlines the types of information that may be collected, recorded, and how we use it.
        </p>
      </header>

      {/* Main Content Body */}
      <div className="space-y-8 text-stone-200 text-sm sm:text-base leading-relaxed">
        
        {/* 1. Introduction */}
        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-bold text-amber-300 font-serif flex items-center gap-2">
            <span>1. Introduction & Scope</span>
          </h2>
          <p className="text-stone-300">
            This Privacy Policy applies solely to our online activities and is valid for visitors to our website with regards to the information shared and/or collected in Shubhakamna.in. This policy is not applicable to any information collected offline or via channels other than this website.
          </p>
          <p className="text-stone-300">
            By using our website, you hereby consent to our Privacy Policy and agree to its terms.
          </p>
        </section>

        {/* 2. Information We Collect */}
        <section className="space-y-3 bg-stone-900/50 border border-stone-800 rounded-2xl p-6 sm:p-7">
          <h2 className="text-lg sm:text-xl font-bold text-white font-serif">
            2. Information We May Collect
          </h2>
          
          <div className="space-y-4 text-stone-300 text-sm">
            <div>
              <h3 className="font-bold text-amber-200 mb-1">A. Information Provided Voluntarily</h3>
              <p>
                When you use certain interactive features on our site (such as entering a name or custom message for creating a personalized festive card, or when contacting us directly via email), you may provide personal details such as your name or email address. We only use this information to deliver the specific feature or reply to your inquiry.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-amber-200 mb-1">B. Automatically Collected Technical Information (Log Files)</h3>
              <p>
                Like most standard website operators, Shubhakamna.in makes use of standard log files. The information inside the log files may include:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1 text-stone-400">
                <li>Internet Protocol (IP) addresses</li>
                <li>Browser type and browser version</li>
                <li>Device type (mobile, tablet, desktop) and operating system</li>
                <li>Internet Service Provider (ISP)</li>
                <li>Date and time stamp of access</li>
                <li>Referring and exit pages</li>
                <li>Number of clicks and navigational patterns on the site</li>
              </ul>
              <p className="mt-2">
                This information is not linked to any personally identifiable information. The purpose of this information is to analyze trends, administer the site, track users' movement on the website, and gather broad demographic insights.
              </p>
            </div>
          </div>
        </section>

        {/* 3. How We Use Information */}
        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-bold text-amber-300 font-serif">
            3. How We Use Your Information
          </h2>
          <p className="text-stone-300">
            We may use the information collected in various ways, including to:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-stone-300">
            <li>Operate, maintain, and provide the features of our website</li>
            <li>Improve, personalize, and expand our website content and performance</li>
            <li>Understand and analyze how visitors use and navigate our website</li>
            <li>Develop new tools, features, festival resources, and functionalities</li>
            <li>Communicate with you to respond to customer service requests or feedback</li>
            <li>Monitor and prevent technical issues, fraud, or misuse</li>
          </ul>
        </section>

        {/* 4. Cookies & Web Beacons */}
        <section className="space-y-3 bg-stone-900/50 border border-stone-800 rounded-2xl p-6 sm:p-7">
          <h2 className="text-lg sm:text-xl font-bold text-white font-serif flex items-center gap-2">
            <Cookie className="w-5 h-5 text-amber-400" />
            <span>4. Cookies and Web Beacons</span>
          </h2>
          <p className="text-stone-300">
            Like any other website, Shubhakamna.in uses 'cookies'. These cookies are used to store information including visitors' preferences, language selection, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users' experience by customizing our web page content based on visitors' browser type and other preferences.
          </p>
          <p className="text-stone-300">
            You can choose to disable cookies through your individual browser options. Detailed information about cookie management with specific web browsers can be found at the browsers' respective websites.
          </p>
        </section>

        {/* 5. Google DoubleClick DART Cookie & Third-Party Advertising */}
        <section className="space-y-3 bg-amber-950/20 border border-amber-500/30 rounded-2xl p-6 sm:p-7">
          <h2 className="text-lg sm:text-xl font-bold text-amber-300 font-serif">
            5. Third-Party Advertising & Google AdSense
          </h2>
          <p className="text-stone-300">
            Advertisements may be displayed on our website through third-party advertising partners, including <strong>Google AdSense</strong>.
          </p>
          <p className="text-stone-300">
            Google is one of the third-party vendors on our site. It also uses cookies, known as <strong>DART cookies</strong>, to serve ads to our site visitors based upon their visit to www.shubhakamna.in and other sites on the internet.
          </p>
          <div className="bg-stone-900/90 border border-stone-700/80 rounded-xl p-4 mt-3 space-y-2 text-xs sm:text-sm text-stone-300">
            <p className="font-semibold text-amber-200">User Ad Choices & Opt-Out:</p>
            <p>
              Visitors may choose to decline the use of DART cookies by visiting the Google Ad and Content Network Privacy Policy at:
            </p>
            <a 
              href="https://policies.google.com/technologies/ads" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-amber-400 hover:text-amber-300 underline font-mono inline-flex items-center gap-1"
            >
              <span>https://policies.google.com/technologies/ads</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <p className="pt-1 text-stone-400">
              You can also manage personalized advertising preferences via the Digital Advertising Alliance consumer choice page at <a href="https://optout.aboutads.info/" target="_blank" rel="noopener noreferrer" className="text-amber-300 underline">aboutads.info</a>.
            </p>
          </div>
        </section>

        {/* 6. Third-Party Privacy Policies */}
        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-bold text-white font-serif">
            6. Third-Party Links & Advertising Partners
          </h2>
          <p className="text-stone-300">
            Shubhakamna.in's Privacy Policy does not apply to other advertisers or third-party websites. Thus, we advise you to consult the respective Privacy Policies of these third-party ad servers or websites for more detailed information. It may include their practices and instructions about how to opt-out of certain options.
          </p>
        </section>

        {/* 7. Data Security */}
        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-bold text-white font-serif flex items-center gap-2">
            <Lock className="w-5 h-5 text-amber-400" />
            <span>7. Data Security Measures</span>
          </h2>
          <p className="text-stone-300">
            We follow standard security measures, including HTTPS encryption (SSL/TLS), to protect any information submitted through our website. However, please remember that no method of transmission over the internet or method of electronic storage is 100% secure.
          </p>
        </section>

        {/* 8. Children's Privacy */}
        <section className="space-y-3 bg-stone-900/50 border border-stone-800 rounded-2xl p-6 sm:p-7">
          <h2 className="text-lg sm:text-xl font-bold text-white font-serif">
            8. Children's Information (COPPA & GDPR)
          </h2>
          <p className="text-stone-300">
            Another part of our priority is adding protection for children while using the internet. We encourage parents and guardians to observe, participate in, and/or monitor and guide their online activity.
          </p>
          <p className="text-stone-300">
            Shubhakamna.in does not knowingly collect any Personal Identifiable Information from children under the age of 13. If you think that your child provided this kind of information on our website, we strongly encourage you to contact us immediately and we will do our best efforts to promptly remove such information from our records.
          </p>
        </section>

        {/* 9. Changes to Policy */}
        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-bold text-white font-serif">
            9. Changes to This Privacy Policy
          </h2>
          <p className="text-stone-300">
            We may update our Privacy Policy from time to time. Thus, we advise you to review this page periodically for any changes. We will notify you of any changes by posting the new Privacy Policy on this page. These changes are effective immediately after they are posted.
          </p>
        </section>

        {/* 10. Contact Information */}
        <section className="border-t border-stone-800 pt-6 space-y-3">
          <h2 className="text-lg sm:text-xl font-bold text-amber-300 font-serif flex items-center gap-2">
            <Mail className="w-5 h-5 text-amber-400" />
            <span>10. Contacting Us</span>
          </h2>
          <p className="text-stone-300">
            If you have any questions, suggestions, or concerns regarding this Privacy Policy, please feel free to reach out to our official email address:
          </p>
          <div className="bg-stone-900 p-4 rounded-xl border border-stone-800 inline-block">
            <span className="text-xs text-stone-400 block mb-1">Official Privacy Email:</span>
            <a 
              href="mailto:mthawkar72@gmail.com" 
              className="text-amber-400 hover:text-amber-300 font-bold text-base font-mono underline"
            >
              mthawkar72@gmail.com
            </a>
          </div>
        </section>

      </div>
    </div>
  );
};
