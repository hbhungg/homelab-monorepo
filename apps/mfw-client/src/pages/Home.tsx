// Export as default
export default function Home() {
  return (
    // 1. Page Wrapper:
    <div
      className="
        min-h-screen bg-black text-white font-mono text-xl
        flex items-center justify-center p-12
      "
    >
      {/* 2. Content Container: */}
      <div className="w-full max-w-7xl text-center flex flex-col items-center gap-6">
        <h1 className="text-3xl font-bold">mfw - motivation for win</h1>

        {/* 3. Links Wrapper: */}
        {/* We add 'items-center' here to center the row of links below */}
        <div className="flex flex-col gap-2 items-center">
          <a href="https://en.wikipedia.org/wiki/Effective_accelerationism" className="hover:text-gray-300 underline">
            How to win?
          </a>

          {/* 4. Side-by-side Links: */}
          {/* This 'flex-row' wrapper places its children side-by-side */}
          <div className="flex flex-row gap-4">
            <a href="/login" className="hover:text-gray-300 underline">
              Login
            </a>

            <a href="/signup" className="hover:text-gray-300 underline">
              Sign up
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
