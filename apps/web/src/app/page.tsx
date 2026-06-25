import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#F7F8F4] text-[#1F2933]">
      <section className="mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-6 py-20 text-center">
        <Badge className="mb-6 bg-[#F0EEFA] text-[#8B7CCB] hover:bg-[#F0EEFA]">AI-ready workday planner</Badge>

        <h1 className="max-w-4xl text-5xl font-bold tracking-tight md:text-7xl">Plan your day. Protect your focus.</h1>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-[#6B7280]">
          Flowdlee helps IT professionals plan focused work, take healthier breaks, and understand their daily rhythm with smart reminders and
          AI-assisted planning.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <Button className="h-12 rounded-xl bg-[#5C8D7B] px-8 text-white hover:bg-[#4E7B6A]">Start free</Button>

          <Button variant="outline" className="h-12 rounded-xl border-[#E5E7DF] bg-white px-8 text-[#1F2933]">
            View demo
          </Button>
        </div>

        <Card className="mt-16 w-full max-w-4xl rounded-3xl border-[#E5E7DF] bg-white/90 shadow-sm">
          <CardContent className="grid gap-6 p-6 text-left md:grid-cols-3">
            <div className="rounded-2xl bg-[#F1F5F0] p-5">
              <p className="text-sm font-medium text-[#6B7280]">Today&apos;s Flow</p>
              <h3 className="mt-3 text-2xl font-semibold">5 tasks planned</h3>
              <p className="mt-2 text-sm text-[#6B7280]">2 completed · 3 remaining</p>
            </div>

            <div className="rounded-2xl bg-[#F4EFE3] p-5">
              <p className="text-sm font-medium text-[#6B7280]">Next Break</p>
              <h3 className="mt-3 text-2xl font-semibold">18 min</h3>
              <p className="mt-2 text-sm text-[#6B7280]">Eye rest recommended</p>
            </div>

            <div className="rounded-2xl bg-[#F0EEFA] p-5">
              <p className="text-sm font-medium text-[#6B7280]">AI Suggestion</p>
              <h3 className="mt-3 text-2xl font-semibold">Plan ready</h3>
              <p className="mt-2 text-sm text-[#6B7280]">Review your focus blocks</p>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
