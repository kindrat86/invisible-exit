import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Terms = () => {
  useEffect(() => {
    document.title = "Terms of Service | Invisible Exit";
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />

      <section className="bg-[#1B2A4A] pt-32 pb-16 px-6">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold text-white">Terms of Service</h1>
          <p className="text-white/50 text-sm mt-4">Last updated: March 21, 2026</p>
        </div>
      </section>

      <section className="bg-white py-16 px-6">
        <div className="mx-auto max-w-3xl prose prose-gray">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Agreement to Terms</h2>
          <p className="text-gray-600 mb-6">
            By accessing or using the Invisible Exit platform operated by Sipiteno LTD
            ("we", "us", or "our"), you agree to be bound by these Terms of Service. If
            you do not agree to these terms, do not use our services.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Description of Service</h2>
          <p className="text-gray-600 mb-6">
            Invisible Exit provides a suite of tools including the FYM Dashboard for
            tracking recurring revenue, churn, growth metrics, and invisibility scoring
            across micro-SaaS projects. We offer both individual tool subscriptions and
            Founding Member packages.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Account Registration</h2>
          <p className="text-gray-600 mb-6">
            To access certain features, you must create an account. You are responsible
            for maintaining the confidentiality of your account credentials and for all
            activities that occur under your account. You agree to provide accurate and
            complete information during registration.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Subscriptions and Payments</h2>
          <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
            <li>Subscriptions are billed monthly on a recurring basis.</li>
            <li>Prices are listed in USD and are subject to change with reasonable notice.</li>
            <li>Founding Member pricing is locked for the lifetime of the subscription for early adopters.</li>
            <li>All payments are processed through our third-party payment provider.</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Cancellation and Refunds</h2>
          <p className="text-gray-600 mb-6">
            You may cancel your subscription at any time through your account settings.
            Cancellation takes effect at the end of the current billing period. We offer
            a 30-day money-back guarantee — if you are not satisfied within the first 30
            days, contact us for a full refund, no questions asked.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Acceptable Use</h2>
          <p className="text-gray-600 mb-3">You agree not to:</p>
          <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
            <li>Use the service for any unlawful purpose.</li>
            <li>Attempt to gain unauthorized access to any part of the platform.</li>
            <li>Interfere with or disrupt the integrity or performance of the service.</li>
            <li>Share your account credentials with third parties.</li>
            <li>Reverse engineer, decompile, or disassemble any part of the platform.</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Intellectual Property</h2>
          <p className="text-gray-600 mb-6">
            All content, features, and functionality of the Invisible Exit platform —
            including text, graphics, logos, and software — are the exclusive property of
            Sipiteno LTD and are protected by intellectual property laws. You may not
            reproduce, distribute, or create derivative works without our prior written
            consent.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Disclaimer of Warranties</h2>
          <p className="text-gray-600 mb-6">
            The service is provided "as is" and "as available" without warranties of any
            kind, whether express or implied. We do not guarantee that the service will
            be uninterrupted, secure, or error-free. The tools and metrics provided are
            for informational purposes and should not be considered financial advice.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Limitation of Liability</h2>
          <p className="text-gray-600 mb-6">
            To the maximum extent permitted by law, Sipiteno LTD shall not be liable for
            any indirect, incidental, special, consequential, or punitive damages
            arising out of or related to your use of the service, regardless of the
            theory of liability.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Changes to Terms</h2>
          <p className="text-gray-600 mb-6">
            We reserve the right to modify these Terms of Service at any time. We will
            provide notice of significant changes by posting the updated terms on this
            page. Your continued use of the service after changes constitutes acceptance
            of the revised terms.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Governing Law</h2>
          <p className="text-gray-600 mb-6">
            These terms shall be governed by and construed in accordance with the laws
            of the jurisdiction in which Sipiteno LTD is registered, without regard to
            conflict of law principles.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Contact Us</h2>
          <p className="text-gray-600">
            If you have any questions about these Terms of Service, please contact us at{" "}
            <a href="mailto:legal@invisibleexit.com" className="text-[#60A5FA] hover:underline">
              legal@invisibleexit.com
            </a>.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Terms;
