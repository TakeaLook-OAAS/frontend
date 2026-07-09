import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  BarChart3,
  Check,
  ChevronDown,
  Clock3,
  FileCheck2,
  MapPin,
  Megaphone,
  MonitorCheck,
} from "lucide-react";
import styles from "../../app/(shell)/guide/guide.module.css";

type PreviewType = "application" | "review" | "campaign" | "dashboard";

type GuideStep = {
  number: string;
  short: string;
  eyebrow: string;
  title: string;
  description: string;
  bullets: string[];
  link?: string;
  linkLabel?: string;
  preview: PreviewType;
};

const steps: GuideStep[] = [
  {
    number: "01",
    short: "캠페인 신청",
    eyebrow: "CAMPAIGN REQUEST",
    title: "광고 캠페인 정보를 입력해 주세요",
    description:
      "메인 페이지의 ‘새 캠페인 신청’ 버튼을 누르고 브랜드, 매체, 타겟, 송출 정보를 순서대로 작성합니다.",
    bullets: [
      "브랜드명과 광고주 회사 정보를 입력합니다.",
      "광고를 송출할 위치와 타겟 연령·성별을 설정합니다.",
      "송출 기간, 시간대, 광고 슬롯을 구성합니다.",
      "담당자 정보를 확인하고 신청서를 제출합니다.",
    ],
    link: "/apply",
    linkLabel: "캠페인 신청 화면 보기",
    preview: "application",
  },
  {
    number: "02",
    short: "검토 및 연동",
    eyebrow: "REVIEW & CONNECT",
    title: "운영팀이 신청 내용을 검토합니다",
    description:
      "제출된 신청서는 OAAS 운영팀이 확인합니다. 검토가 끝나면 송출 일정과 견적을 안내하고 캠페인에 디바이스를 연결합니다.",
    bullets: [
      "운영팀이 신청 내용을 24시간 이내 검토합니다.",
      "송출 일정과 견적을 담당자에게 안내합니다.",
      "승인된 캠페인에 매체 디바이스를 연결합니다.",
      "준비가 완료되면 캠페인 상태가 ‘예정’으로 표시됩니다.",
    ],
    preview: "review",
  },
  {
    number: "03",
    short: "송출 확인",
    eyebrow: "CAMPAIGN STATUS",
    title: "메인에서 송출 상태를 확인하세요",
    description:
      "신청한 캠페인의 진행 상태와 연결된 디바이스를 한곳에서 확인할 수 있습니다.",
    bullets: [
      "진행 중·예정·종료 캠페인을 상태별로 확인합니다.",
      "캠페인 카드를 눌러 연결된 디바이스 목록을 펼칩니다.",
      "각 디바이스의 연결 상태와 설치 위치를 확인합니다.",
    ],
    link: "/main",
    linkLabel: "메인 화면 보기",
    preview: "campaign",
  },
  {
    number: "04",
    short: "성과 분석",
    eyebrow: "PERFORMANCE ANALYTICS",
    title: "대시보드에서 광고 효과를 분석하세요",
    description:
      "캠페인과 기간을 선택하면 노출, 관심, 체류, 시청 데이터를 다양한 기준으로 비교할 수 있습니다.",
    bullets: [
      "분석할 캠페인·디바이스와 조회 기간을 선택합니다.",
      "노출 인구, 관심 인구와 핵심 관심도를 확인합니다.",
      "성별·연령대·시간대별 성과를 비교합니다.",
      "필요한 결과는 CSV 파일로 내려받습니다.",
    ],
    link: "/dashboard",
    linkLabel: "대시보드 보기",
    preview: "dashboard",
  },
];

function WindowFrame({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className={styles.window}>
      <div className={styles.windowBar}>
        <div className={styles.windowDots}>
          <span />
          <span />
          <span />
        </div>

        <span className={styles.windowLabel}>{label}</span>
        <span className={styles.windowSpacer} />
      </div>

      <div className={styles.windowBody}>{children}</div>
    </div>
  );
}

function ApplicationPreview() {
  return (
    <WindowFrame label="새 캠페인 신청">
      <div className={styles.appPreview}>
        <div className={styles.previewHeading}>
          <div>
            <span className={styles.miniEyebrow}>SECTION · BRAND</span>
            <h3>브랜드 정보</h3>
            <p>캠페인을 게시할 브랜드와 광고주 회사를 입력해 주세요.</p>
          </div>

          <span className={styles.stepBadge}>STEP 01 / 04</span>
        </div>

        <div className={styles.fakeFields}>
          <div>
            <label>
              브랜드 명 <b>*</b>
            </label>
            <span>OAAS</span>
          </div>

          <div>
            <label>
              광고주 회사 <b>*</b>
            </label>
            <span>Take a Look</span>
          </div>
        </div>

        <div className={styles.fakeCategory}>
          <span className={styles.fakeLabel}>업종 카테고리</span>

          <div>
            <span className={styles.selectedCategory}>IT · 테크</span>
            <span>교육</span>
            <span>공공 · 캠페인</span>
          </div>
        </div>

        <div className={styles.completion}>
          <span>COMPLETION</span>

          <div>
            <i style={{ width: "25%" }} />
          </div>

          <b>01 / 04</b>
        </div>
      </div>
    </WindowFrame>
  );
}

function ReviewPreview() {
  return (
    <WindowFrame label="신청 검토 현황">
      <div className={styles.reviewPreview}>
        <div className={styles.reviewTitle}>
          <span className={styles.iconBox}>
            <FileCheck2 size={18} />
          </span>

          <div>
            <span className={styles.miniEyebrow}>APPLICATION REVIEW</span>
            <h3>캠페인 송출 준비</h3>
          </div>

          <span className={styles.reviewPill}>검토 중</span>
        </div>

        <div className={styles.reviewFlow}>
          <div className={styles.doneNode}>
            <span>
              <Check size={14} />
            </span>
            <b>신청 완료</b>
            <small>정보 제출</small>
          </div>

          <i />

          <div className={styles.activeNode}>
            <span>
              <Clock3 size={14} />
            </span>
            <b>내용 검토</b>
            <small>24시간 이내</small>
          </div>

          <i />

          <div>
            <span>
              <MonitorCheck size={14} />
            </span>
            <b>디바이스 연동</b>
            <small>송출 준비</small>
          </div>
        </div>

        <div className={styles.notice}>
          <span>
            <Check size={15} />
          </span>

          <p>
            <b>신청서가 정상적으로 접수되었습니다.</b>
            <br />
            검토 결과는 입력한 담당자 연락처로 안내해 드립니다.
          </p>
        </div>
      </div>
    </WindowFrame>
  );
}

function CampaignPreview() {
  return (
    <WindowFrame label="OAAS · 내 캠페인">
      <div className={styles.campaignPreview}>
        <div className={styles.campaignHead}>
          <div>
            <span className={styles.miniEyebrow}>MY CAMPAIGNS</span>
            <h3>자신이 신청한 광고</h3>
          </div>

          <div className={styles.tabs}>
            <b>전체 3</b>
            <span>진행 중 1</span>
            <span>예정 1</span>
          </div>
        </div>

        <div className={styles.campaignCard}>
          <div className={styles.campaignRow}>
            <div>
              <span className={styles.livePill}>
                <i /> 진행 중
              </span>
              <b>여름 시즌 브랜드 캠페인</b>
            </div>

            <div>
              <small>DEVICES</small>
              <strong>
                2<em>대</em>
              </strong>
            </div>

            <span className={styles.chevron}>
              <ChevronDown size={16} />
            </span>
          </div>

          <div className={styles.deviceList}>
            <span className={styles.miniEyebrow}>DEVICES · 2대 연동</span>

            <div>
              <span>
                <MonitorCheck size={16} />
                <b>강남역 미디어월</b>
              </span>
              <span className={styles.online}>온라인</span>
            </div>

            <div>
              <span>
                <MapPin size={16} />
                <b>성수 팝업 스크린</b>
              </span>
              <span className={styles.online}>온라인</span>
            </div>
          </div>
        </div>
      </div>
    </WindowFrame>
  );
}

function DashboardPreview() {
  return (
    <WindowFrame label="캠페인 성과 분석">
      <div className={styles.dashboardScreenshot}>
        <Image
          src="/images/dashboard-guide.png"
          alt="OAAS 대시보드 실제 화면"
          width={1280}
          height={1064}
          sizes="(max-width: 860px) 100vw, 54vw"
          priority
        />
      </div>
    </WindowFrame>
  );
}

function Preview({ type }: { type: PreviewType }) {
  if (type === "application") {
    return <ApplicationPreview />;
  }

  if (type === "review") {
    return <ReviewPreview />;
  }

  if (type === "campaign") {
    return <CampaignPreview />;
  }

  return <DashboardPreview />;
}

type GuideContentProps = {
  ctaHref?: string;
  ctaLabel?: string;
};

export default function GuideContent({
  ctaHref = "/apply",
  ctaLabel = "새 캠페인 신청",
}: GuideContentProps) {
  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <div className={styles.heroGlow} />

        <div className={styles.breadcrumb}>
          <span>GUIDE</span>
          <i>/</i>
          <b>GETTING STARTED</b>
        </div>

        <div className={styles.heroContent}>
          <div>
            <span className={styles.heroKicker}>OAAS USER GUIDE</span>

            <h1>
              처음이어도, 순서대로
              <br />
              쉽게 시작할 수 있어요.
            </h1>

            <p>
              캠페인 신청부터 광고 성과 확인까지
              <br className={styles.desktopBreak} /> OAAS의 전체 이용 과정을
              안내합니다.
            </p>
          </div>

          <div className={styles.heroGraphic}>
            <div className={styles.orbit}>
              <Megaphone size={30} />
            </div>

            <div className={styles.floatCardA}>
              <BarChart3 size={17} />
              <span>
                <b>성과 분석</b>
                <small>실시간 데이터 확인</small>
              </span>
            </div>

            <div className={styles.floatCardB}>
              <MonitorCheck size={17} />
              <span>
                <b>송출 중</b>
                <small>디바이스 정상 연결</small>
              </span>
            </div>
          </div>
        </div>
      </header>

      <nav className={styles.quickSteps} aria-label="이용 단계">
        {steps.map((step, index) => (
          <a href={`#step-${step.number}`} key={step.number}>
            <span>{step.number}</span>
            <b>{step.short}</b>

            {index < steps.length - 1 && <ArrowRight size={16} />}
          </a>
        ))}
      </nav>

      <main className={styles.guide}>
        <div className={styles.sectionIntro}>
          <span>HOW IT WORKS</span>
          <h2>OAAS 이용 방법</h2>
          <p>아래 네 단계를 따라 캠페인을 시작하고 성과를 확인해 보세요.</p>
        </div>

        <div className={styles.stepList}>
          {steps.map((step, index) => (
            <section
              className={`${styles.stepSection} ${
                index % 2 === 1 ? styles.reverse : ""
              }`}
              id={`step-${step.number}`}
              key={step.number}
            >
              <div className={styles.stepRail}>
                <span>STEP</span>
                <b>{step.number}</b>
              </div>

              <div className={styles.stepCopy}>
                <span className={styles.copyEyebrow}>{step.eyebrow}</span>
                <h2>{step.title}</h2>
                <p>{step.description}</p>

                <ul>
                  {step.bullets.map((bullet) => (
                    <li key={bullet}>
                      <span>
                        <Check size={13} />
                      </span>
                      {bullet}
                    </li>
                  ))}
                </ul>

                {step.link && (
                  <Link href={step.link} className={styles.textLink}>
                    {step.linkLabel}
                    <ArrowRight size={15} />
                  </Link>
                )}
              </div>

              <div className={styles.previewWrap}>
                <Preview type={step.preview} />
              </div>
            </section>
          ))}
        </div>
      </main>

      <section className={styles.cta}>
        <div>
          <span>READY TO START?</span>
          <h2>이제 첫 캠페인을 시작해 보세요.</h2>
          <p>
            신청서를 작성하면 OAAS 운영팀이 확인 후 송출 일정을 안내해
            드립니다.
          </p>
        </div>

        <Link href={ctaHref}>
          {ctaLabel}
          <ArrowRight size={17} />
        </Link>
      </section>
    </div>
  );
}
