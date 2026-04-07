import { ArrowUp, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function Capture() {
  const navigate = useNavigate();

  return (
    <main className="flex-grow pt-24 pb-32 px-6 max-w-2xl mx-auto w-full flex flex-col gap-8">
      {/* Uploaded Photo Frame */}
      <section className="relative group">
        <div className="aspect-[4/5] rounded-[3rem] overflow-hidden bg-surface-container shadow-[0px_12px_32px_rgba(55,58,28,0.06)]">
          <img 
            alt="평화로운 커피 한 잔의 순간" 
            className="w-full h-full object-cover" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuASdaluEhOIC3PWubVzzM1RHbGq3Ph10Xqw0uwAZiqAZT_Wj9qCh_s5sigzxFz27cQW-jC7tAyEH5O8l2zXIXGeNyQAxu3z3-pQPPEpnHVuJfq0EeEp33K4RphGb9NgY4SWWnkNY4nrI_XvVWx59AeDfxM1oMURjt3xUTRTrVea0vkCnmcW0dkvr9DNw6FQ56EkJUXzznu7TrpvnGlF9e-Y0ALYJ1MVx38RZmCQhoZUUspROF_zELUKHCTkxcmPcBwSEHKmg9HRr7U" 
          />
        </div>
        {/* Aesthetic Floating Badge */}
        <div className="absolute -bottom-4 -right-4 bg-tertiary-container text-on-tertiary-container px-6 py-2 rounded-full font-sans text-xs tracking-widest shadow-lg">
          순간 포착
        </div>
      </section>

      {/* Chat Conversation */}
      <section className="flex flex-col gap-6 flex-grow">
        {/* AI Message */}
        <div className="flex flex-col gap-2 max-w-[85%]">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-6 h-6 rounded-full bg-primary-container flex items-center justify-center">
              <Sparkles size={14} className="text-primary fill-primary" />
            </div>
            <span className="text-xs font-bold tracking-wider text-on-surface-variant">소화</span>
          </div>
          <div className="bg-surface-container-high rounded-tr-xl rounded-br-xl rounded-bl-xl p-5 shadow-[0px_4px_12px_rgba(55,58,28,0.03)]">
            <p className="font-serif text-lg leading-relaxed text-on-surface">
              이 사진, 왠지 마음이 편안해 보여요. <br />
              어떤 순간이었나요?
            </p>
          </div>
        </div>
        
        {/* User Typing Hint */}
        <div className="flex justify-end italic text-on-surface-variant/60 text-sm px-4 mt-auto">
          마음의 소리를 듣고 있어요...
        </div>
      </section>

      {/* Bottom Interaction Area */}
      <footer className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-surface via-surface to-transparent pt-10">
        <div className="max-w-2xl mx-auto px-6 pb-8 pt-4">
          {/* Action Buttons */}
          <div className="flex justify-between items-center mb-6 px-2">
            <button
              onClick={() => navigate("/")}
              className="text-on-surface-variant/60 font-sans text-sm hover:text-on-surface transition-colors"
            >
              건너뛰기
            </button>
            <button
              onClick={() => navigate("/insight")}
              className="text-primary font-serif font-semibold italic border-b border-primary/20 hover:border-primary transition-all"
            >
              기록 완료
            </button>
          </div>
          
          {/* Soft Input Field */}
          <div className="relative flex items-center">
            <input 
              className="w-full bg-surface-container border-none rounded-full px-6 py-5 pr-16 focus:ring-2 focus:ring-primary/10 text-on-surface placeholder:text-on-surface-variant/40 transition-all shadow-[0px_-8px_24px_rgba(55,58,28,0.04)] outline-none" 
              placeholder="작은 행복을 나눠주세요..." 
              type="text" 
            />
            <button 
              onClick={() => navigate("/insight")}
              className="absolute right-3 w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-dim text-white flex items-center justify-center active:scale-90 transition-transform shadow-md"
            >
              <ArrowUp size={20} />
            </button>
          </div>
        </div>
      </footer>
    </main>
  );
}
