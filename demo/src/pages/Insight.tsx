import { Home, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function Insight() {
  const navigate = useNavigate();

  return (
    <main className="pt-24 px-6 max-w-2xl mx-auto space-y-8 pb-32">
      {/* 사용자 기록 섹션 */}
      <section className="space-y-6">
        <div className="relative group">
          <div className="overflow-hidden rounded-[3rem] aspect-[4/5] shadow-sm">
            <img
              alt="조용한 카페에서 촬영한 커피 사진"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAFpGdABzlKtI0ipij77_HoWEso_8Wl8CoXfMZbzm0Bf-tW8Fy5E1XbKGTVRmvIYIRtDsQdT3tU9PaKiO0WwGAUnSXF0bYV7_3gFgKV6JLZnwMfKvRAc483z0rEP-4hJf8Amxq4zOV_24QwL5OV9hmVttJwsOed1EqiH0PLOg4JPASQVHtPCu5LvnGpO70H6EffZJMgHnPClel6zEYsrnpMkjiZmwBPNgpIgI9X0CSB4GqYrMblm2u941UErw3hKlw6k7P3UDRtnsk"
            />
          </div>
          <div className="absolute -bottom-4 -right-4 bg-surface-container-lowest p-6 rounded-2xl shadow-[0px_8px_24px_rgba(55,58,28,0.06)] max-w-[80%] border border-primary/5">
            <p className="text-on-surface italic font-serif text-lg leading-relaxed">
              따뜻한 커피 한 잔과 함께하는 이 시간이 오늘의 가장 큰 행복이었어요.
            </p>
          </div>
        </div>
      </section>

      {/* AI 코멘트 카드 - 1~2문장 짧은 감성 피드백 */}
      <section className="pt-8">
        <div className="bg-surface-container-low rounded-[2rem] p-10 text-center space-y-6 border border-primary/5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/20 via-primary to-primary/20"></div>

          <div className="flex justify-center">
            <Sparkles className="text-primary" size={32} aria-hidden="true" />
          </div>

          <h2 className="font-serif text-2xl md:text-3xl font-medium leading-snug text-on-surface">
            "잠시 멈춰 쉬는 시간도 충분히 소중한 행복이 될 수 있어요."
          </h2>

          {/* 감정 태그 칩 */}
          <div className="flex flex-wrap justify-center gap-3">
            <span className="bg-surface-container px-5 py-2 rounded-full text-sm font-medium text-primary tracking-wide">편안함</span>
            <span className="bg-surface-container px-5 py-2 rounded-full text-sm font-medium text-primary tracking-wide">나만의 시간</span>
            <span className="bg-tertiary-container/30 px-5 py-2 rounded-full text-sm font-medium text-on-tertiary-container tracking-wide">따뜻함</span>
          </div>
        </div>
      </section>

      {/* 저장하고 홈으로 돌아가기 */}
      <section className="pt-4">
        <button
          onClick={() => navigate("/")}
          aria-label="저장하고 홈으로 돌아가기"
          className="w-full bg-gradient-to-br from-primary to-primary-dim text-on-primary py-5 rounded-full font-semibold text-lg flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all shadow-md"
        >
          <Home size={24} />
          저장하고 돌아가기
        </button>
      </section>
    </main>
  );
}
