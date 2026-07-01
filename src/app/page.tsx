import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex items-center justify-between px-6 py-4">
        <h1 className="font-fredoka text-2xl text-pink-600">POLA GO</h1>
        <nav className="flex gap-4">
          <Link href="/settings" className="text-sm font-quicksand text-gray-500 hover:text-pink-500 transition-colors">
            Settings
          </Link>
        </nav>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <h2 className="font-fredoka text-5xl md:text-7xl text-pink-600 mb-4 leading-tight">
          Snap Together
        </h2>
        <p className="font-quicksand text-lg text-gray-500 max-w-md mb-2">
          A shared virtual photo booth for you and your partner — no matter the distance.
        </p>
        <p className="font-quicksand text-sm text-gray-400 mb-10 max-w-sm">
          Create a room, share a link, and capture 4 polaroid-style photos together in real time.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/room/new"
            className="inline-flex items-center justify-center px-8 py-4 bg-pink-400 hover:bg-pink-500 text-white rounded-2xl font-fredoka text-lg shadow-lg transition-all active:scale-95"
          >
            Start a Room
          </Link>
          <Link
            href="/room/new"
            className="inline-flex items-center justify-center px-8 py-4 bg-white hover:bg-pink-50 text-pink-600 rounded-2xl font-fredoka text-lg border border-pink-200 transition-all active:scale-95"
          >
            Join a Room
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl">
          <FeatureCard number="1" title="Create & Share" description="Start a private room and send the link to your partner." />
          <FeatureCard number="2" title="Pose Together" description="See each other live, sync a countdown, and snap 4 polaroids." />
          <FeatureCard number="3" title="Style & Export" description="Add filters, stickers, frames and download your strip." />
        </div>
      </main>

      <footer className="text-center py-6 text-xs text-gray-400 font-quicksand">
        Made with 💕 for every couple counting down the days
      </footer>
    </div>
  );
}

function FeatureCard({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-pink-100 text-left">
      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-pink-100 text-pink-600 font-fredoka text-sm mb-3">
        {number}
      </span>
      <h3 className="font-fredoka text-base text-pink-700 mb-1">{title}</h3>
      <p className="font-quicksand text-sm text-gray-500 leading-relaxed">{description}</p>
    </div>
  );
}
