import Link from "next/link";

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

/* ---------------------------------------------------------------- */
/* types                                                            */
/* ---------------------------------------------------------------- */
type PatchNote = {
  id: number;
  version: string;
  title: string;
  date: string;
  views: number;
};

/* ---------------------------------------------------------------- */
/* patch note data                                                  */
/* ---------------------------------------------------------------- */
const patchNotes: PatchNote[] = [
  {
    id: 5,
    version: "v0.4.0",
    title: "FAQ 페이지가 추가되었습니다.",
    date: "2026-07-05",
    views: 0,
  },
  {
    id: 4,
    version: "v0.3.0",
    title: "이용 방법 페이지가 추가되었습니다.",
    date: "2026-07-02",
    views: 28,
  },
  {
    id: 3,
    version: "v0.2.1",
    title: "기간별 분석 날짜 표시 오류를 수정했습니다.",
    date: "2026-06-30",
    views: 17,
  },
  {
    id: 2,
    version: "v0.2.0",
    title: "시간대별 평균 노출 차트가 추가되었습니다.",
    date: "2026-06-27",
    views: 34,
  },
  {
    id: 1,
    version: "v0.1.0",
    title: "OAAS 초기 버전이 배포되었습니다.",
    date: "2026-06-25",
    views: 51,
  },
];

/* ---------------------------------------------------------------- */
/* page                                                             */
/* ---------------------------------------------------------------- */
export default function ChangelogPage() {
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
            SYSTEM
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
            PATCH NOTES
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
          패치 노트
        </h1>

        <p
          style={{
            margin: "6px 0 0",
            fontSize: 13,
            color: t.muted,
          }}
        >
          OAAS의 새로운 기능과 개선 사항을 확인할 수 있습니다.
        </p>
      </div>

      {/* 패치 노트 목록 */}
      <div
        style={{
          overflow: "hidden",
          border: `1px solid ${t.lineSoft}`,
          borderRadius: 14,
          background: "#FFFFFF",
          boxShadow: "0 1px 2px rgba(13, 42, 92, 0.03)",
        }}
      >
        <div
          style={{
            width: "100%",
            overflowX: "auto",
          }}
        >
          <table
            style={{
              width: "100%",
              minWidth: 760,
              borderCollapse: "collapse",
              tableLayout: "fixed",
            }}
          >
            <thead>
              <tr
                style={{
                  borderBottom: `1px solid ${t.lineSoft}`,
                  background: t.bgWarm,
                }}
              >
                <th
                  style={{
                    width: 80,
                    padding: "13px 16px",
                    textAlign: "center",
                    fontFamily: "var(--font-mono)",
                    fontSize: 10,
                    fontWeight: 600,
                    color: t.mono,
                    letterSpacing: "0.12em",
                  }}
                >
                  번호
                </th>

                <th
                  style={{
                    width: 120,
                    padding: "13px 16px",
                    textAlign: "center",
                    fontFamily: "var(--font-mono)",
                    fontSize: 10,
                    fontWeight: 600,
                    color: t.mono,
                    letterSpacing: "0.12em",
                  }}
                >
                  버전
                </th>

                <th
                  style={{
                    padding: "13px 16px",
                    textAlign: "left",
                    fontFamily: "var(--font-mono)",
                    fontSize: 10,
                    fontWeight: 600,
                    color: t.mono,
                    letterSpacing: "0.12em",
                  }}
                >
                  제목
                </th>

                <th
                  style={{
                    width: 140,
                    padding: "13px 16px",
                    textAlign: "center",
                    fontFamily: "var(--font-mono)",
                    fontSize: 10,
                    fontWeight: 600,
                    color: t.mono,
                    letterSpacing: "0.12em",
                  }}
                >
                  등록일
                </th>

                <th
                  style={{
                    width: 100,
                    padding: "13px 16px",
                    textAlign: "center",
                    fontFamily: "var(--font-mono)",
                    fontSize: 10,
                    fontWeight: 600,
                    color: t.mono,
                    letterSpacing: "0.12em",
                  }}
                >
                  조회수
                </th>
              </tr>
            </thead>

            <tbody>
              {patchNotes.map((note, index) => (
                <tr
                  key={note.id}
                  style={{
                    borderBottom:
                      index === patchNotes.length - 1
                        ? "none"
                        : `1px solid ${t.lineSoft}`,
                    background: "#FFFFFF",
                  }}
                >
                  <td
                    style={{
                      padding: "16px",
                      textAlign: "center",
                      fontSize: 12.5,
                      color: t.mono,
                    }}
                  >
                    {note.id}
                  </td>

                  <td
                    style={{
                      padding: "16px",
                      textAlign: "center",
                      fontFamily: "var(--font-mono)",
                      fontSize: 11.5,
                      fontWeight: 700,
                      color: t.blue,
                    }}
                  >
                    {note.version}
                  </td>

                  <td
                    style={{
                      padding: "16px",
                      textAlign: "left",
                    }}
                  >
                    <Link
                      href={`/changelog/${note.id}`}
                      style={{
                        color: t.ink,
                        fontSize: 13.5,
                        fontWeight: 600,
                        textDecoration: "none",
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {note.title}
                    </Link>
                  </td>

                  <td
                    style={{
                      padding: "16px",
                      textAlign: "center",
                      fontFamily: "var(--font-sans)",
                      fontSize: 12,
                      color: t.muted,
                    }}
                  >
                    {note.date}
                  </td>

                  <td
                    style={{
                      padding: "16px",
                      textAlign: "center",
                      fontFamily: "var(--font-sans)",
                      fontSize: 12,
                      color: t.muted,
                    }}
                  >
                    {note.views}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 하단 안내 */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            padding: "12px 18px",
            borderTop: `1px solid ${t.lineSoft}`,
            background: t.bgWarm,
          }}
        >
          <span
            style={{
              fontSize: 11.5,
              color: t.muted,
            }}
          >
            총{" "}
            <strong
              style={{
                color: t.ink,
                fontWeight: 700,
              }}
            >
              {patchNotes.length}개
            </strong>
            의 패치 노트가 있습니다.
          </span>
        </div>
      </div>
    </section>
  );
}