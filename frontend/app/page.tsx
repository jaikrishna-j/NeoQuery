import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-6xl font-bold mb-6 bg-linear-to-r from-[#00d4ff] to-[#0099cc] bg-clip-text text-transparent">
            NeoQuery
          </h1>
          <p className="text-2xl text-[#b0b0b0] mb-4 max-w-3xl mx-auto">
            Intelligent Question-Answering Powered by RAG
          </p>
          <p className="text-lg text-[#888] mb-12 max-w-2xl mx-auto">
            Upload your documents, images, audio, and video files. Ask questions and get intelligent answers 
            powered by OpenAI and advanced retrieval-augmented generation.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/chat"
              className="px-8 py-3 bg-[#00d4ff] text-[#0a0a0a] font-semibold rounded-lg hover:bg-[#00b8e6] transition-colors"
            >
              Start Chatting
            </Link>
            <Link
              href="/how-it-works"
              className="px-8 py-3 border border-[#333] text-[#e5e5e5] font-semibold rounded-lg hover:border-[#00d4ff] hover:text-[#00d4ff] transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>

        <div className="mt-32 grid md:grid-cols-3 gap-8">
          <div className="p-6 border border-[#333] rounded-lg hover:border-[#00d4ff]/50 transition-colors">
            <div className="text-3xl mb-4">📄</div>
            <h3 className="text-xl font-semibold mb-2 text-[#00d4ff]">Multi-Format Support</h3>
            <p className="text-[#888]">
              Upload documents, images, audio, and video files. We handle PDF, DOCX, images, audio, and more.
            </p>
          </div>
          <div className="p-6 border border-[#333] rounded-lg hover:border-[#00d4ff]/50 transition-colors">
            <div className="text-3xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2 text-[#00d4ff]">Intelligent Retrieval</h3>
            <p className="text-[#888]">
              Advanced RAG technology finds the most relevant information from your uploaded files.
            </p>
          </div>
          <div className="p-6 border border-[#333] rounded-lg hover:border-[#00d4ff]/50 transition-colors">
            <div className="text-3xl mb-4">💬</div>
            <h3 className="text-xl font-semibold mb-2 text-[#00d4ff]">Smart Answers</h3>
            <p className="text-[#888]">
              Get accurate, contextual answers powered by OpenAI&apos;s advanced language models.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
