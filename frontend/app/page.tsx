import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#0f0f0f] to-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        {/* Hero Section */}
        <div className="text-center mb-16 sm:mb-20 lg:mb-24">
          <div className="inline-block mb-6">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-4 gradient-text">
              NeoQuery
            </h1>
            <div className="h-1 w-24 mx-auto bg-gradient-to-r from-[#00d4ff] to-[#0099cc] rounded-full"></div>
          </div>
          <p className="text-xl sm:text-2xl lg:text-3xl text-[#b0b0b0] mb-4 sm:mb-6 max-w-3xl mx-auto px-4 font-light">
            Intelligent Question-Answering Powered by RAG
          </p>
          <p className="text-base sm:text-lg text-[#888] mb-8 sm:mb-12 max-w-2xl mx-auto px-4 leading-relaxed">
            Upload your documents, images, audio, and video files. Ask questions and get intelligent answers 
            powered by OpenAI and advanced retrieval-augmented generation.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
            <Link
              href="/chat"
              className="group px-8 sm:px-10 py-3 sm:py-4 bg-gradient-to-r from-[#00d4ff] to-[#0099cc] text-[#0a0a0a] font-semibold rounded-2xl hover:from-[#00b8e6] hover:to-[#0088bb] transition-all duration-200 shadow-lg hover:shadow-[#00d4ff]/30 text-sm sm:text-base flex items-center justify-center gap-2"
            >
              <span>Start Chatting</span>
              <svg
                className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link
              href="/how-it-works"
              className="px-8 sm:px-10 py-3 sm:py-4 border-2 border-[#2a2a2a] text-[#e5e5e5] font-semibold rounded-2xl hover:border-[#00d4ff] hover:text-[#00d4ff] transition-all duration-200 text-sm sm:text-base"
            >
              Learn More
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-16 sm:mt-24 lg:mt-32 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 px-4 sm:px-0">
          <div className="group p-6 sm:p-8 bg-gradient-to-br from-[#111] to-[#0a0a0a] border border-[#2a2a2a] rounded-2xl hover:border-[#00d4ff]/50 transition-all duration-300 hover:shadow-lg hover:shadow-[#00d4ff]/10 hover:-translate-y-1">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-br from-[#00d4ff]/20 to-[#0099cc]/20 border border-[#00d4ff]/30 flex items-center justify-center text-3xl sm:text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
              📄
            </div>
            <h3 className="text-xl sm:text-2xl font-semibold mb-3 text-[#00d4ff]">Multi-Format Support</h3>
            <p className="text-sm sm:text-base text-[#888] leading-relaxed">
              Upload documents, images, audio, and video files. We handle PDF, DOCX, images, audio, and more.
            </p>
          </div>
          <div className="group p-6 sm:p-8 bg-gradient-to-br from-[#111] to-[#0a0a0a] border border-[#2a2a2a] rounded-2xl hover:border-[#00d4ff]/50 transition-all duration-300 hover:shadow-lg hover:shadow-[#00d4ff]/10 hover:-translate-y-1">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-br from-[#00d4ff]/20 to-[#0099cc]/20 border border-[#00d4ff]/30 flex items-center justify-center text-3xl sm:text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
              🔍
            </div>
            <h3 className="text-xl sm:text-2xl font-semibold mb-3 text-[#00d4ff]">Intelligent Retrieval</h3>
            <p className="text-sm sm:text-base text-[#888] leading-relaxed">
              Advanced RAG technology finds the most relevant information from your uploaded files.
            </p>
          </div>
          <div className="group p-6 sm:p-8 bg-gradient-to-br from-[#111] to-[#0a0a0a] border border-[#2a2a2a] rounded-2xl hover:border-[#00d4ff]/50 transition-all duration-300 hover:shadow-lg hover:shadow-[#00d4ff]/10 hover:-translate-y-1 sm:col-span-2 lg:col-span-1">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-br from-[#00d4ff]/20 to-[#0099cc]/20 border border-[#00d4ff]/30 flex items-center justify-center text-3xl sm:text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
              💬
            </div>
            <h3 className="text-xl sm:text-2xl font-semibold mb-3 text-[#00d4ff]">Smart Answers</h3>
            <p className="text-sm sm:text-base text-[#888] leading-relaxed">
              Get accurate, contextual answers powered by OpenAI&apos;s advanced language models.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
