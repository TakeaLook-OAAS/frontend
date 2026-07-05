import Link from "next/link";
import { notFound } from "next/navigation";
import { changelogData } from "../changelogdata";

const t = {
  bg: "#F4F6FB",
  bgWarm: "#F9FAFD",
  ink: "#0A1A35",
  inkSoft: "#1A2C4F",
  blue: "#1E5BFF",
  blueSoft: "#DCE6FF",
  line: "#DCE0EB",
  lineSoft: "#E7EAF2",
  muted: "#5B6786",
  mono: "#8893AB",
};

type ChangelogDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ChangelogDetailPage({
  params,
}: ChangelogDetailPageProps) {
  const { id } = await params;
  const changelogId = Number(id);

  const changelog = changelogData.find(
    (item) => item.id === changelogId,
  );

  if (!changelog) {
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
      {/* 상단 경로 */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 28,
          fontFamily: "JetBrains Mono, monospace",
          fontSize: 10.5,
          letterSpacing: "0.14em",
        }}
      >
        <span style={{ color: t.muted }}>SYSTEM</span>
        <span style={{ color: t.line }}>/</span>
        <span style={{ color: t.muted }}>PATCH NOTES</span>
        <span style={{ color: t.line }}>/</span>
        <strong
          style={{
            color: t.ink,
            fontWeight: 600,
          }}
        >
          DETAIL
        </strong>
      </div>

      {/* 상세 카드 */}
      <article
        style={{
          overflow: "hidden",
          border: `1px solid ${t.lineSoft}`,
          borderRadius: 14,
          background: "#FFFFFF",
          boxShadow: "0 1px 2px rgba(13, 42, 92, 0.03)",
        }}
      >
        {/* 제목 영역 */}
        <header
          style={{
            padding: "32px 34px 28px",
            borderBottom: `1px solid ${t.lineSoft}`,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 14,
            }}
          >
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "5px 10px",
                borderRadius: 7,
                background: t.blueSoft,
                color: t.blue,
                fontFamily: "JetBrains Mono, monospace",
                fontSize: 11,
                fontWeight: 700,
              }}
            >
              {changelog.version}
            </span>

            <span
              style={{
                color: t.mono,
                fontFamily: "JetBrains Mono, monospace",
                fontSize: 10.5,
                letterSpacing: "0.1em",
              }}
            >
              PATCH NOTE #{changelog.id}
            </span>
          </div>

          <h1
            style={{
              margin: 0,
              color: t.ink,
              fontSize: 28,
              fontWeight: 800,
              lineHeight: 1.4,
              letterSpacing: "-0.035em",
            }}
          >
            {changelog.title}
          </h1>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 18,
              marginTop: 18,
              color: t.muted,
              fontSize: 12,
            }}
          >
            <span>등록일 {changelog.date}</span>

            <span
              style={{
                width: 1,
                height: 12,
                background: t.line,
              }}
            />

            <span>조회수 {changelog.views}</span>
          </div>
        </header>

        {/* 본문 영역 */}
        <div
          style={{
            minHeight: 220,
            padding: "38px 34px",
            background: t.bgWarm,
          }}
        >
          <div
            style={{
              padding: "24px 26px",
              border: `1px solid ${t.lineSoft}`,
              borderRadius: 12,
              background: "#FFFFFF",
            }}
          >
            <span
              style={{
                display: "block",
                marginBottom: 10,
                color: t.blue,
                fontFamily: "JetBrains Mono, monospace",
                fontSize: 10.5,
                fontWeight: 700,
                letterSpacing: "0.12em",
              }}
            >
              UPDATE
            </span>

            <p style={{
            margin: 0,
            color: t.inkSoft,
            fontSize: 15,
            lineHeight: 1.8,
            wordBreak: "keep-all",
            }}
            >
            {changelog.description}
</p>
          </div>
        </div>

        {/* 하단 버튼 */}
        <footer
          style={{
            display: "flex",
            justifyContent: "flex-end",
            padding: "18px 24px",
            borderTop: `1px solid ${t.lineSoft}`,
            background: "#FFFFFF",
          }}
        >
          <Link
            href="/changelog"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: 40,
              padding: "0 18px",
              border: `1px solid ${t.line}`,
              borderRadius: 8,
              color: t.ink,
              background: "#FFFFFF",
              fontSize: 12.5,
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            목록으로 돌아가기
          </Link>
        </footer>
      </article>
    </section>
  );
}