import AILegalAssistant from '@/components/AILegalAssistant';

export default function AIAssistantPage() {
  return (
    <div className="w-full max-w-[1800px] 2xl:max-w-[2200px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold font-display mb-2 text-white">AI Legal Assistant</h1>
        <p className="text-sm text-ehb-textMuted">Get instant legal guidance powered by advanced AI</p>
      </div>
      <div className="max-w-3xl mx-auto">
        <AILegalAssistant />
      </div>
    </div>
  );
}
