import Link from "next/link";
import { faqData } from "./faqdata";

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
/* page                                                             */
/* ---------------------------------------------------------------- */
export default function FaqPage() {
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
              fontFamily: "JetBrains Mono, monospace",
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
              fontFamily: "JetBrains Mono, monospace",
              fontSize: 10.5,
              color: t.ink,
              letterSpacing: "0.14em",
              fontWeight: 600,
            }}
          >
            FAQ
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
          OAAS 이용자들이 자주 묻는 질문과 그에 대한 답변을 확인할 수
          있습니다.
        </p>
      </div>

      {/* FAQ 목록 */}
      <div
        style={{
          background: "#FFFFFF",
          border: `1px solid ${t.lineSoft}`,
          borderRadius: 14,
          boxShadow: "0 1px 2px rgba(13,42,92,0.03)",
          overflow: "hidden",
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
                  background: t.bgWarm,
                  borderBottom: `1px solid ${t.lineSoft}`,
                }}
              >
                <th
                  style={{
                    width: 80,
                    padding: "13px 16px",
                    textAlign: "center",
                    fontFamily: "JetBrains Mono, monospace",
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
                    width: 140,
                    padding: "13px 16px",
                    textAlign: "center",
                    fontFamily: "JetBrains Mono, monospace",
                    fontSize: 10,
                    fontWeight: 600,
                    color: t.mono,
                    letterSpacing: "0.12em",
                  }}
                >
                  카테고리
                </th>

                <th
                  style={{
                    padding: "13px 16px",
                    textAlign: "left",
                    fontFamily: "JetBrains Mono, monospace",
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
                    fontFamily: "JetBrains Mono, monospace",
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
                    width: 90,
                    padding: "13px 16px",
                    textAlign: "center",
                    fontFamily: "JetBrains Mono, monospace",
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
              {faqData.map((item, index) => (
                <tr
                  key={item.id}
                  style={{
                    background: "#FFFFFF",
                    borderBottom:
                      index === faqData.length - 1
                        ? "none"
                        : `1px solid ${t.lineSoft}`,
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
                    {item.id}
                  </td>

                  <td
                    style={{
                      padding: "16px",
                      textAlign: "center",
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
                      {item.category}
                    </span>
                  </td>

                  <td
                    style={{
                      padding: "16px",
                      textAlign: "left",
                    }}
                  >
                    <Link
                      href={`/faq/${item.id}`}
                      style={{
                        color: t.ink,
                        fontSize: 13.5,
                        fontWeight: 600,
                        textDecoration: "none",
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {item.title}
                    </Link>
                  </td>

                  <td
                    style={{
                      padding: "16px",
                      textAlign: "center",
                      fontFamily: "Inter, sans-serif",
                      fontSize: 12,
                      color: t.muted,
                    }}
                  >
                    {item.date}
                  </td>

                  <td
                    style={{
                      padding: "16px",
                      textAlign: "center",
                      fontFamily: "Inter, sans-serif",
                      fontSize: 12,
                      color: t.muted,
                    }}
                  >
                    {item.views.toLocaleString()}
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
              {faqData.length}개
            </strong>
            의 자주 묻는 질문이 있습니다.
          </span>
        </div>
      </div>
    </section>
  );
}