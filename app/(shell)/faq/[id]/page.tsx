import Link from "next/link";
import { notFound } from "next/navigation";
import { faqData } from "../faqdata";

/* ---------------------------------------------------------------- */
/* design tokens                                                    */
/* ---------------------------------------------------------------- */
const t = {
  bg: "#F4F6FB",
  bgWarm: "#F9FAFD",
  ink: "#0A1A35",
  inkSoft: "#1A2C4F",
  navy: "#0D2A5C",
  blue: "#1E5BFF",
  blueLight: "#5C8BFF",
  blueSoft: "#DCE6FF",
  blueMist: "#EEF3FF",
  blueGhost: "#F4F7FF",
  green: "#0FA968",
  greenSoft: "#D6F4E5",
  amber: "#E89B2A",
  red: "#D7563D",
  line: "#DCE0EB",
  lineSoft: "#E7EAF2",
  muted: "#5B6786",
  mono: "#8893AB",
};

type FaqDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function FaqDetailPage({
  params,
}: FaqDetailPageProps) {
  const { id } = await params;
  const faqId = Number(id);

  const faq = faqData.find((item) => item.id === faqId);

  if (!faq) {
    notFound();
  }

  return (
    <section
      style={{
        width: "100%",
        minHeight: "100vh",
        padding: "26px 36px 60px",
        background: t.bg,
      }}
    >
      {/* 페이지 제목 */}
      <div
        style={{
          marginBottom: 28,
          textAlign: "left",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 6,
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10.5,
              color: t.muted,
              letterSpacing: "0.14em",
            }}
          >
            GUIDE
          </span>

          <span style={{ color: t.line }}>/</span>

          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10.5,
              color: t.muted,
              letterSpacing: "0.14em",
            }}
          >
            FAQ
          </span>

          <span style={{ color: t.line }}>/</span>

          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10.5,
              color: t.ink,
              letterSpacing: "0.14em",
              fontWeight: 600,
            }}
          >
            DETAIL
          </span>
        </div>

        <h1
          style={{
            margin: 0,
            fontSize: 26,
            fontWeight: 800,
            letterSpacing: "-0.03em",
            color: t.ink,
          }}
        >
          자주 묻는 질문
        </h1>

        <p
          style={{
            margin: "6px 0 0",
            fontSize: 13,
            color: t.muted,
          }}
        >
          선택한 질문에 대한 상세 답변을 확인할 수 있습니다.
        </p>
      </div>

      {/* 질문 및 답변 */}
      <article
        style={{
          overflow: "hidden",
          background: "#FFFFFF",
          border: `1px solid ${t.lineSoft}`,
          borderRadius: 14,
          boxShadow: "0 1px 2px rgba(13,42,92,0.03)",
        }}
      >
        {/* 질문 영역 */}
        <div
          style={{
            padding: "24px 26px",
            borderBottom: `1px solid ${t.lineSoft}`,
            background: t.bgWarm,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 12,
            }}
          >
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                minWidth: 76,
                padding: "5px 10px",
                borderRadius: 99,
                background: t.blueMist,
                border: `1px solid ${t.blueSoft}`,
                color: t.blue,
                fontSize: 11,
                fontWeight: 700,
                whiteSpace: "nowrap",
              }}
            >
              {faq.category}
            </span>

            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10.5,
                color: t.mono,
                letterSpacing: "0.08em",
              }}
            >
              FAQ #{faq.id}
            </span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 12,
            }}
          >
            <span
              style={{
                color: t.blue,
                fontSize: 22,
                fontWeight: 800,
                lineHeight: 1.4,
              }}
            >
              Q.
            </span>

            <h2
              style={{
                margin: 0,
                color: t.ink,
                fontSize: 20,
                fontWeight: 800,
                lineHeight: 1.45,
                letterSpacing: "-0.025em",
              }}
            >
              {faq.title}
            </h2>
          </div>

          <div
            style={{
              display: "flex",
              gap: 18,
              marginTop: 16,
              paddingLeft: 36,
              color: t.muted,
              fontSize: 11.5,
            }}
          >
            <span>등록햣일 {faq.date}</span>
            <span>조회수 {faq.views.toLocaleString()}</span>
          </div>
        </div>

        {/* 답변 영역 */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 14,
            minHeight: 240,
            padding: "30px 26px 38px",
          }}
        >
          <span
            style={{
              color: t.green,
              fontSize: 22,
              fontWeight: 800,
              lineHeight: 1.6,
            }}
          >
            A.
          </span>

          <div
            style={{
              color: t.inkSoft,
              fontSize: 14,
              lineHeight: 1.8,
              letterSpacing: "-0.01em",
            }}
          >
            {faq.answer.map((paragraph, index) => (
              <p
                key={index}
                style={{
                  margin: index === 0 ? 0 : "14px 0 0",
                }}
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </article>

      {/* 목록 버튼 */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginTop: 18,
        }}
      >
        <Link
          href="/faq"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 7,
            padding: "9px 16px",
            border: `1px solid ${t.line}`,
            borderRadius: 9,
            background: "#FFFFFF",
            color: t.ink,
            fontSize: 13,
            fontWeight: 600,
            textDecoration: "none",
          }}
        >
          ← 목록으로 돌아가기
        </Link>
      </div>
    </section>
  );
}