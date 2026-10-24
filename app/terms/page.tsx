import type { Metadata } from "next";
import Link from "next/link";
import { CONTACT_EMAIL, LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = { title: "Terms of Service" };

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Service">
      <p>
        These terms govern your use of QuickDrop. By creating an account you agree to them. QuickDrop
        is a demo application built for an evaluation project, provided as-is with no guarantees of
        availability, accuracy or data retention.
      </p>

      <h2>1. The service</h2>
      <p>
        QuickDrop lets you define delivery zones on a map, add products, assign them to zones, and
        record orders. An order is accepted only when its delivery address falls inside a zone where
        the product is available.
      </p>

      <h2>2. Accounts</h2>
      <ul>
        <li>You can sign up with an email and password, or with your Google account.</li>
        <li>You are responsible for keeping your login details secure.</li>
        <li>Each account only sees and manages its own zones, products and orders.</li>
        <li>We may suspend or remove accounts that misuse the service.</li>
      </ul>

      <h2>3. Acceptable use</h2>
      <p>You agree not to:</p>
      <ul>
        <li>Enter real personal data of customers or third parties.</li>
        <li>Attempt to access other users&apos; data or disrupt the service.</li>
        <li>Use the service for anything unlawful, abusive or harmful.</li>
        <li>Upload automated or excessive traffic.</li>
      </ul>

      <h2>4. Your data</h2>
      <p>
        You keep ownership of the data you enter. How we handle it is described in our{" "}
        <Link href="/privacy" className="font-medium text-orange-600 underline">
          Privacy Policy
        </Link>
        . Because this is a demo, data may be reset or deleted at any time.
      </p>

      <h2>5. No warranty and liability</h2>
      <p>
        The service is provided &quot;as is&quot; without warranties of any kind. To the extent
        permitted by law, we are not liable for any loss arising from its use.
      </p>

      <h2>6. Changes</h2>
      <p>
        We may update these terms. The &quot;last updated&quot; date above shows the latest version.
        Continued use after changes means you accept them.
      </p>

      <h2>7. Contact</h2>
      <p>
        Questions? Email{" "}
        <a href={`mailto:${CONTACT_EMAIL}`} className="font-medium text-orange-600 underline">
          {CONTACT_EMAIL}
        </a>
        .
      </p>
    </LegalPage>
  );
}
