import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";

const Privacy = () => {
  return (
    <div className="min-h-screen">
      <SEOHead
        title="Privacy Policy | Invisible Exit"
        description="How Invisible Exit collects, uses, and protects your personal information. Read our privacy policy."
        url="/privacy"
      />
      <Navbar />

      <main>
      <section className="bg-[#1B2A4A] pt-32 pb-16 px-6">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold text-white">Privacy Policy</h1>
          <p className="text-white/50 text-sm mt-4">Last updated: March 21, 2026</p>
        </div>
      </section>

      <section className="bg-white py-16 px-6">
        <div className="mx-auto max-w-3xl prose prose-gray">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
          <p className="text-gray-600 mb-6">
            Invisible Exit ("we", "us", or "our") operates the platform at
            (https://invisibleexit.com). This Privacy Policy explains how we collect, use,
            and protect your personal information when you use our services.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Information We Collect</h2>
          <p className="text-gray-600 mb-3">We may collect the following types of information:</p>
          <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
            <li><strong>Account information:</strong> name, email address, and payment details when you create an account or subscribe.</li>
            <li><strong>Usage data:</strong> information about how you interact with our platform, including pages visited, features used, and session duration.</li>
            <li><strong>Device information:</strong> browser type, operating system, IP address, and device identifiers.</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">3. How We Use Your Information</h2>
          <p className="text-gray-600 mb-3">We use the information we collect to:</p>
          <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
            <li>Provide, maintain, and improve our services.</li>
            <li>Process transactions and send related information.</li>
            <li>Send you technical notices, updates, and support messages.</li>
            <li>Respond to your comments, questions, and requests.</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Data Sharing</h2>
          <p className="text-gray-600 mb-6">
            We do not sell your personal information. We may share your information with
            third-party service providers who assist us in operating the platform (e.g.,
            payment processors, hosting providers). These providers are contractually
            obligated to protect your data.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Data Security</h2>
          <p className="text-gray-600 mb-6">
            We implement industry-standard security measures to protect your personal
            information. However, no method of transmission over the Internet is 100%
            secure, and we cannot guarantee absolute security.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Cookies</h2>
          <p className="text-gray-600 mb-6">
            We use essential cookies to enable core platform functionality. We may also
            use analytics cookies to understand how visitors interact with our platform.
            You can control cookie preferences through your browser settings.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Your Rights</h2>
          <p className="text-gray-600 mb-3">Depending on your location, you may have the right to:</p>
          <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
            <li>Access the personal information we hold about you.</li>
            <li>Request correction or deletion of your data.</li>
            <li>Object to or restrict processing of your data.</li>
            <li>Request data portability.</li>
            <li>Withdraw consent at any time.</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Data Retention</h2>
          <p className="text-gray-600 mb-6">
            We retain your personal information for as long as your account is active or
            as needed to provide you services. We will also retain and use your
            information as necessary to comply with legal obligations and resolve disputes.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Changes to This Policy</h2>
          <p className="text-gray-600 mb-6">
            We may update this Privacy Policy from time to time. We will notify you of
            any changes by posting the new policy on this page and updating the "Last
            updated" date.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Contact Us</h2>
          <p className="text-gray-600">
            If you have any questions about this Privacy Policy, please contact us at{" "}
            <a href="mailto:privacy@invisibleexit.com" className="text-[#60A5FA] hover:underline">
              privacy@invisibleexit.com
            </a>.
          </p>
        </div>
      </section>
      </main>

      <Footer />
    </div>
  );
};

export default Privacy;
