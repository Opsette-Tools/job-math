import { useNavigate } from "react-router-dom";

export default function AboutPage() {
  const navigate = useNavigate();

  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-4 text-sm text-muted-foreground leading-relaxed">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-2"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m12 19-7-7 7-7" /><path d="M19 12H5" />
        </svg>
        Back
      </button>

      <h2 className="text-2xl font-bold text-foreground">About ProfitCalc</h2>

      <p className="text-foreground font-medium text-base">
        Know what you actually made on every job.
      </p>

      <p>
        ProfitCalc is a free, offline-first calculator that shows you the real numbers
        behind your jobs — net profit, margin, and effective hourly rate — so you can
        price smarter and stop guessing.
      </p>

      <div className="space-y-3">
        <h3 className="text-foreground font-semibold">How It Works</h3>
        <ol className="list-decimal list-inside space-y-2">
          <li>Enter the amount you charged for the job</li>
          <li>Add your costs — materials, labor, mileage, and other expenses</li>
          <li>Enter how many hours you worked</li>
          <li>See your real profit, margin, and effective hourly rate instantly</li>
        </ol>
      </div>

      <div className="space-y-3">
        <h3 className="text-foreground font-semibold">Features</h3>
        <ul className="list-disc list-inside space-y-1.5">
          <li>Works offline — no internet needed after first visit</li>
          <li>Save jobs to track your history</li>
          <li>Share job summaries with a tap</li>
          <li>Dark mode support</li>
          <li>Installable as an app on your phone</li>
        </ul>
      </div>

      <div className="space-y-3">
        <h3 className="text-foreground font-semibold">Built For</h3>
        <p>
          Freelancers, contractors, cleaners, handymen, landscapers, and anyone who
          needs to know if a job was actually worth it.
        </p>
      </div>
    </div>
  );
}
