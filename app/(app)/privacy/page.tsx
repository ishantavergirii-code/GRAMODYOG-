import { AppShell } from "@/components/AppShell";

export default function PrivacyPage() {
  return (
    <AppShell variant="back" title="Privacy policy">
      <article className="prose prose-zinc mx-auto max-w-3xl rounded-2xl border border-zinc-200 bg-white p-6 md:p-10">
        <h2 className="mt-0 text-xl font-semibold">Privacy policy (demo)</h2>
        <p className="text-sm leading-relaxed text-zinc-600">
          This application is a frontend demonstration. It does not send your data to a
          server. Information you enter is stored locally in your browser using
          localStorage under the key configured for this project only.
        </p>
        <h3 className="mt-6 text-lg font-semibold">Data we store locally</h3>
        <ul className="list-disc pl-5 text-sm text-zinc-700">
          <li>Sign-in email and display name (demo authentication)</li>
          <li>Business ideas, chat messages, and settings</li>
          <li>Archive status for each idea</li>
        </ul>
        <h3 className="mt-6 text-lg font-semibold">No backend</h3>
        <p className="text-sm text-zinc-600">
          Any email and password combination will sign you in. Do not use real passwords
          you use elsewhere.
        </p>
        <h3 className="mt-6 text-lg font-semibold">Contact</h3>
        <p className="text-sm text-zinc-600">
          For questions about this demo, contact:{" "}
          <span className="font-medium">privacy-demo@example.com</span>
        </p>
      </article>
    </AppShell>
  );
}
