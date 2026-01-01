export default function HowItWorksPage() {
  return (
    <main className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <h1 className="text-3xl sm:text-4xl font-bold mb-8 sm:mb-12 text-center">How It Works</h1>

        <div className="space-y-8 sm:space-y-12">
          <section>
            <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-[#00d4ff]">What is RAG?</h2>
            <p className="text-sm sm:text-base text-[#b0b0b0] leading-relaxed">
              Retrieval-Augmented Generation (RAG) is an AI technique that combines information retrieval 
              with language generation. Instead of relying solely on pre-trained knowledge, RAG systems 
              retrieve relevant information from your uploaded documents and use it to generate accurate, 
              context-aware answers.
            </p>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-[#00d4ff]">The Process</h2>
            <div className="space-y-5 sm:space-y-6">
              <div className="border-l-4 border-[#00d4ff] pl-4 sm:pl-6">
                <h3 className="text-lg sm:text-xl font-semibold mb-2">1. File Upload & Processing</h3>
                <p className="text-sm sm:text-base text-[#b0b0b0]">
                  When you upload a file, NeoQuery processes it based on its type:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1 text-sm sm:text-base text-[#888] ml-2 sm:ml-4">
                  <li><strong>Text documents</strong> (PDF, DOCX, TXT, MD): Direct text extraction</li>
                  <li><strong>Structured files</strong> (CSV, JSON, XML): Converted to readable format</li>
                  <li><strong>Images</strong> (PNG, JPG, SVG): OCR (Optical Character Recognition)</li>
                  <li><strong>Audio</strong> (MP3, WAV): Speech-to-text transcription</li>
                  <li><strong>Video</strong> (MP4): Audio extraction + transcription</li>
                </ul>
              </div>

              <div className="border-l-4 border-[#00d4ff] pl-4 sm:pl-6">
                <h3 className="text-lg sm:text-xl font-semibold mb-2">2. Text Chunking & Embedding</h3>
                <p className="text-sm sm:text-base text-[#b0b0b0]">
                  The extracted text is split into smaller chunks for efficient processing. Each chunk is 
                  then converted into a vector embedding using OpenAI&apos;s embedding models via OpenRouter API. These 
                  embeddings capture the semantic meaning of the text.
                </p>
              </div>

              <div className="border-l-4 border-[#00d4ff] pl-4 sm:pl-6">
                <h3 className="text-lg sm:text-xl font-semibold mb-2">3. Vector Storage</h3>
                <p className="text-sm sm:text-base text-[#b0b0b0]">
                  Embeddings are stored in separate FAISS indexes organized by file type. This allows 
                  for efficient similarity search across different types of content.
                </p>
              </div>

              <div className="border-l-4 border-[#00d4ff] pl-4 sm:pl-6">
                <h3 className="text-lg sm:text-xl font-semibold mb-2">4. Question Processing</h3>
                <p className="text-sm sm:text-base text-[#b0b0b0]">
                  When you ask a question, it&apos;s converted to an embedding and used to search the 
                  vector indexes. The system retrieves the most relevant chunks from your uploaded files.
                </p>
              </div>

              <div className="border-l-4 border-[#00d4ff] pl-4 sm:pl-6">
                <h3 className="text-lg sm:text-xl font-semibold mb-2">5. Answer Generation</h3>
                <p className="text-sm sm:text-base text-[#b0b0b0]">
                  The retrieved context is passed to advanced language models via OpenRouter API along with your 
                  question. The model generates an accurate answer based on the retrieved information, 
                  citing sources when applicable.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-[#00d4ff]">Powered by OpenRouter API</h2>
            <p className="text-sm sm:text-base text-[#b0b0b0] leading-relaxed">
              NeoQuery uses OpenRouter API to access state-of-the-art language models for both embeddings and chat completion. 
              The system uses <code className="bg-[#1a1a1a] px-2 py-1 rounded text-[#00d4ff] text-xs sm:text-sm">text-embedding-3-small</code> for 
              generating embeddings and advanced language models via OpenRouter for 
              generating answers. This ensures high-quality, accurate responses to your questions.
            </p>
          </section>

          <section className="mt-8 sm:mt-12 p-4 sm:p-6 bg-[#1a1a1a] border border-[#333] rounded-lg">
            <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-[#00d4ff]">Privacy & Security</h2>
            <p className="text-sm sm:text-base text-[#b0b0b0]">
              All processing happens in memory during your session. Files are processed and stored in 
              FAISS indexes that exist only while the backend is running. No data persists beyond your 
              current session.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}

