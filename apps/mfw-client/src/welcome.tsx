export function WelcomePage() {
  return (
    <div
      className="
        min-h-screen bg-black text-white font-mono text-xl
        flex flex-col items-center justify-center
        max-w-7xl mx-auto px-12 box-border
      "
    >
      {/* This inner div applies the '.landing' styles */}
      <div
        className="
          flex flex-col items-center justify-center
          text-center w-full
        "
      >
        <h1 className="text-3xl font-bold">mfw - motivation for win</h1>
        <br />
        <div>
          <a
            href="https://en.wikipedia.org/wiki/Effective_accelerationism"
            className="text-white hover:text-gray-300 underline"
          >
            How to win?
          </a>
        </div>
      </div>
    </div>
  );
}

// Export as default if this is the main page component
export default WelcomePage;
