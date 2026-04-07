import { Sparkles } from "lucide-react";

export function Summary() {
  return (
    <main className="pt-24 pb-32 px-6 max-w-7xl mx-auto space-y-12">
      {/* 주간 행복 요약 */}
      <section className="space-y-6">
        <div className="max-w-2xl">
          <h2 className="font-serif text-3xl md:text-5xl text-on-surface leading-tight">
            이번 주 당신의 행복 트리거는 <br />
            <span className="text-primary italic underline underline-offset-8 decoration-primary/20">[자연]</span>과{" "}
            <span className="text-primary italic underline underline-offset-8 decoration-primary/20">[커피]</span>였어요.
          </h2>
        </div>

        {/* 감정 빈도 시각화 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 감정 태그 클라우드 */}
          <div className="md:col-span-2 bg-surface-container-low rounded-[2rem] p-8 flex flex-col justify-between aspect-video md:aspect-auto min-h-[300px]">
            <div className="flex justify-between items-start">
              <span className="font-sans text-sm tracking-widest text-on-surface-variant">감정 빈도</span>
              <Sparkles className="text-primary" size={20} aria-hidden="true" />
            </div>

            <div className="relative flex-1 flex items-center justify-center py-8">
              <div className="absolute top-4 left-4 bg-tertiary-container text-on-tertiary-container px-6 py-3 rounded-full text-lg font-medium shadow-sm animate-float" style={{animationDelay: '0s'}}>자연 42%</div>
              <div className="absolute bottom-8 right-12 bg-secondary-container text-on-secondary-container px-5 py-2.5 rounded-full text-base font-medium shadow-sm animate-float" style={{animationDelay: '1s'}}>커피 28%</div>
              <div className="absolute top-1/2 left-1/3 bg-primary-container text-on-primary-container px-4 py-2 rounded-full text-sm font-medium shadow-sm animate-float" style={{animationDelay: '0.5s'}}>독서 15%</div>
              <div className="absolute bottom-4 left-10 bg-surface-container-highest text-on-surface-variant px-4 py-2 rounded-full text-xs font-medium shadow-sm animate-float" style={{animationDelay: '1.5s'}}>산책 10%</div>
              <div className="absolute top-12 right-4 bg-surface-container-high text-on-surface-variant px-3 py-1.5 rounded-full text-xs font-medium shadow-sm animate-float" style={{animationDelay: '0.2s'}}>음악 5%</div>
            </div>

            <p className="text-sm text-on-surface-variant/80">지난 7일간 기록된 당신의 평온한 순간들입니다.</p>
          </div>

          {/* 일일 평균 */}
          <div className="bg-surface-container rounded-[2rem] p-8 flex flex-col gap-4">
            <span className="font-sans text-xs tracking-widest text-on-surface-variant">일일 평균</span>
            <div className="flex items-baseline gap-1">
              <span className="text-5xl font-serif text-primary">4.8</span>
              <span className="text-on-surface-variant">/ 5</span>
            </div>
            <div className="mt-auto space-y-2">
              <div className="h-1.5 w-full bg-white/50 rounded-full overflow-hidden" role="progressbar" aria-valuenow={92} aria-valuemin={0} aria-valuemax={100} aria-label="행복 지수">
                <div className="h-full bg-primary w-[92%] rounded-full"></div>
              </div>
              <p className="text-xs text-on-surface-variant">평소보다 12% 더 높은 행복 지수를 보였어요.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 선호 시간대 */}
      <section className="space-y-6">
        <h3 className="font-serif text-2xl text-on-surface">선호 시간대</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-surface-container-low rounded-[2rem] p-6 text-center space-y-2">
            <span className="text-3xl">🌅</span>
            <p className="font-sans text-sm font-medium text-on-surface">아침</p>
            <p className="text-xs text-on-surface-variant">35%</p>
          </div>
          <div className="bg-primary-container/30 rounded-[2rem] p-6 text-center space-y-2 border-2 border-primary/20">
            <span className="text-3xl">☀️</span>
            <p className="font-sans text-sm font-medium text-primary">오후</p>
            <p className="text-xs text-primary">45%</p>
          </div>
          <div className="bg-surface-container-low rounded-[2rem] p-6 text-center space-y-2">
            <span className="text-3xl">🌆</span>
            <p className="font-sans text-sm font-medium text-on-surface">저녁</p>
            <p className="text-xs text-on-surface-variant">15%</p>
          </div>
          <div className="bg-surface-container-low rounded-[2rem] p-6 text-center space-y-2">
            <span className="text-3xl">🌙</span>
            <p className="font-sans text-sm font-medium text-on-surface">밤</p>
            <p className="text-xs text-on-surface-variant">5%</p>
          </div>
        </div>
      </section>

      {/* 선호 장소 유형 */}
      <section className="space-y-6">
        <h3 className="font-serif text-2xl text-on-surface">자주 찾는 장소</h3>
        <div className="flex flex-wrap gap-3">
          <span className="bg-primary-container text-on-primary-container px-6 py-3 rounded-full text-base font-medium">카페</span>
          <span className="bg-tertiary-container/50 text-on-tertiary-container px-5 py-2.5 rounded-full text-sm font-medium">공원</span>
          <span className="bg-secondary-container/50 text-on-secondary-container px-4 py-2 rounded-full text-sm font-medium">산책로</span>
          <span className="bg-surface-container-high text-on-surface-variant px-4 py-2 rounded-full text-xs font-medium">서점</span>
          <span className="bg-surface-container text-on-surface-variant px-3 py-1.5 rounded-full text-xs font-medium">집</span>
        </div>
      </section>
    </main>
  );
}
