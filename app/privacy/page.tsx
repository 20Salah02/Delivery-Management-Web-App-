import type { Metadata } from "next";
import { CONTACT_EMAIL, LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy">
      <p>
        This policy explains what data QuickDrop collects and how it is used. QuickDrop is a demo
        application built for an evaluation project, so we collect only what is needed to make it
        work.
      </p>

      <h2>1. Data we collect</h2>
      <ul>
        <li>
          <strong>Account data:</strong> your email address and an encrypted password (we never see
          your password in plain text).
        </li>
        <li>
          <strong>Zones:</strong> names, center coordinates and radius.
        </li>
        <li>
          <strong>Products:</strong> names, prices, quantities and the zones they are assigned to.
        </li>
        <li>
          <strong>Orders:</strong> the product, quantity and delivery address you choose.
        </li>
        <li>
          <strong>Map coordinates:</strong> the latitude and longitude of points you select on the
          map.
        </li>
      </ul>

      <h2>2. Google sign-in</h2>
      <p>
        If you choose &quot;Continue with Google&quot;, Google shares your name and email address
        with us so we can create and identify your account. We do not access your contacts, files or
        any other Google data.
      </p>

      <h2>3. How we use your data</h2>
      <p>
        Only to provide the service: signing you in, showing your zones, products and orders, and
        checking that delivery addresses fall inside your zones. We don&apos;t use your data for
        advertising or profiling.
      </p>

      <h2>4. Processors</h2>
      <p>
        We use <strong>Supabase</strong> to provide authentication and to store the database. Supabase
        processes your data on our behalf. The app is hosted on Vercel, and map tiles are loaded from
        OpenStreetMap.
      </p>

      <h2>5. We don&apos;t sell your data</h2>
      <p>We never sell, rent or trade your personal data to anyone.</p>

      <h2>6. Access and deletion</h2>
      <p>
        Each account can only access its own data. You can ask us to delete your account and all
        associated data at any time by emailing us. Because this is a demo, data may also be cleared
        periodically.
      </p>

      <h2>7. Contact</h2>
      <p>
        For privacy questions or deletion requests, email{" "}
        <a href={`mailto:${CONTACT_EMAIL}`} className="font-medium text-orange-600 underline">
          {CONTACT_EMAIL}
        </a>
        .
      </p>
    </LegalPage>
  );
}
