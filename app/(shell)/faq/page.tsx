"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
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

const categories = [
  "이용 안내",
  "캠페인",
  "디바이스",
  "데이터 분석",
  "계정",
  "다운로드",
  "기타",
] as const;

type LocalQuestion = {
  id: number;
  category: string;
  title: string;
  content: string;
  date: string;
  views: number;
  isLocal: true;
};

/* ---------------------------------------------------------------- */
/* page                                                             */
/* ---------------------------------------------------------------- */
export default function FaqPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [category, setCategory] = useState<string>(categories[0]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [localQuestions, setLocalQuestions] = useState<LocalQuestion[]>([]);

  const faqItems = useMemo(
    () => [
      ...localQuestions,
      ...faqData.map((item) => ({
        ...item,
        isLocal: false as const,
      })),
    ],
    [localQuestions],
  );

  const closeModal = () => {
    setIsModalOpen(false);
    setError("");
  };

  const resetForm = () => {
    setCategory(categories[0]);
    setTitle("");
    setContent("");
    setError("");
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();

    if (!trimmedTitle) {
      setError("질문 제목을 입력해 주세요.");
      return;
    }

    if (!trimmedContent) {
      setError("질문 내용을 입력해 주세요.");
      return;
    }

    const today = new Date();
    const date = [
      today.getFullYear(),
      String(today.getMonth() + 1).padStart(2, "0"),
      String(today.getDate()).padStart(2, "0"),
    ].join("-");

    const nextId =
      Math.max(
        0,
        ...faqData.map((item) => item.id),
        ...localQuestions.map((item) => item.id),
      ) + 1;

    const newQuestion: LocalQuestion = {
      id: nextId,
      category,
      title: trimmedTitle,
      content: trimmedContent,
      date,
      views: 0,
      isLocal: true,
    };

    setLocalQuestions((previous) => [newQuestion, ...previous]);
    resetForm();
    setIsModalOpen(false);
  };

  return (
    <section
      style={{
        width: "100%",
        minHeight: "100vh",
        padding: "26px 36px 100px",
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
                  카테고리
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
                    width: 90,
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
              {faqItems.map((item, index) => (
                <tr
                  key={`${item.isLocal ? "local" : "faq"}-${item.id}`}
                  style={{
                    borderBottom:
                      index === faqItems.length - 1
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
                        minWidth: 76,
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "5px 10px",
                        border: `1px solid ${t.blueSoft}`,
                        borderRadius: 99,
                        color: t.blue,
                        background: t.blueMist,
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
                    {item.isLocal ? (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 9,
                        }}
                      >
                        <span
                          style={{
                            color: t.ink,
                            fontSize: 13.5,
                            fontWeight: 600,
                            letterSpacing: "-0.01em",
                          }}
                        >
                          {item.title}
                        </span>

                        <span
                          style={{
                            flexShrink: 0,
                            padding: "3px 7px",
                            borderRadius: 99,
                            color: "#7A4B12",
                            background: "#FCEDD0",
                            fontSize: 9.5,
                            fontWeight: 700,
                          }}
                        >
                          답변 대기
                        </span>
                      </div>
                    ) : (
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
                    )}
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
                    {item.date}
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
              {faqItems.length}개
            </strong>
            의 질문이 있습니다.
          </span>
        </div>
      </div>

      {/* 우측 하단 질문 추가 버튼 */}
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        style={{
          position: "fixed",
          right: 32,
          bottom: 28,
          zIndex: 20,
          display: "inline-flex",
          minHeight: 48,
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          padding: "0 20px",
          border: "none",
          borderRadius: 12,
          color: "#FFFFFF",
          background: t.blue,
          boxShadow: "0 14px 30px rgba(30, 91, 255, 0.28)",
          fontSize: 13,
          fontWeight: 700,
          cursor: "pointer",
        }}
      >
        <span
          style={{
            fontSize: 21,
            fontWeight: 400,
            lineHeight: 1,
          }}
        >
          +
        </span>
        질문 추가
      </button>

      {/* 질문 입력 모달 */}
      {isModalOpen && (
        <div
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeModal();
            }
          }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
            display: "grid",
            placeItems: "center",
            padding: 20,
            background: "rgba(10, 26, 53, 0.48)",
            backdropFilter: "blur(3px)",
          }}
        >
          <form
            onSubmit={handleSubmit}
            style={{
              width: "100%",
              maxWidth: 560,
              overflow: "hidden",
              border: `1px solid ${t.lineSoft}`,
              borderRadius: 16,
              background: "#FFFFFF",
              boxShadow: "0 24px 70px rgba(10, 26, 53, 0.24)",
            }}
          >
            <header
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: 20,
                padding: "24px 26px 20px",
                borderBottom: `1px solid ${t.lineSoft}`,
              }}
            >
              <div>
                <span
                  style={{
                    color: t.blue,
                    fontFamily: "var(--font-mono)",
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "0.14em",
                  }}
                >
                  NEW QUESTION
                </span>

                <h2
                  style={{
                    margin: "7px 0 0",
                    color: t.ink,
                    fontSize: 22,
                    fontWeight: 800,
                    letterSpacing: "-0.03em",
                  }}
                >
                  질문 추가
                </h2>

                <p
                  style={{
                    margin: "6px 0 0",
                    color: t.muted,
                    fontSize: 12.5,
                    lineHeight: 1.6,
                  }}
                >
                  OAAS 이용 중 궁금한 내용을 작성해 주세요.
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                aria-label="질문 입력 창 닫기"
                style={{
                  width: 34,
                  height: 34,
                  flexShrink: 0,
                  border: `1px solid ${t.line}`,
                  borderRadius: 8,
                  color: t.muted,
                  background: "#FFFFFF",
                  fontSize: 19,
                  cursor: "pointer",
                }}
              >
                ×
              </button>
            </header>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 19,
                padding: "24px 26px",
              }}
            >
              <label
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                <span
                  style={{
                    color: t.inkSoft,
                    fontSize: 12,
                    fontWeight: 700,
                  }}
                >
                  카테고리
                </span>

                <select
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                  style={{
                    width: "100%",
                    height: 44,
                    padding: "0 12px",
                    border: `1px solid ${t.line}`,
                    borderRadius: 9,
                    outline: "none",
                    color: t.ink,
                    background: "#FFFFFF",
                    fontSize: 13,
                  }}
                >
                  {categories.map((item) => (
                    <option value={item} key={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>

              <label
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                <span
                  style={{
                    color: t.inkSoft,
                    fontSize: 12,
                    fontWeight: 700,
                  }}
                >
                  질문 제목
                </span>

                <input
                  value={title}
                  onChange={(event) => {
                    setTitle(event.target.value);
                    setError("");
                  }}
                  maxLength={100}
                  placeholder="질문 제목을 입력해 주세요."
                  style={{
                    width: "100%",
                    height: 44,
                    boxSizing: "border-box",
                    padding: "0 12px",
                    border: `1px solid ${t.line}`,
                    borderRadius: 9,
                    outline: "none",
                    color: t.ink,
                    background: "#FFFFFF",
                    fontSize: 13,
                  }}
                />

                <span
                  style={{
                    alignSelf: "flex-end",
                    color: t.mono,
                    fontSize: 10.5,
                  }}
                >
                  {title.length} / 100
                </span>
              </label>

              <label
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                <span
                  style={{
                    color: t.inkSoft,
                    fontSize: 12,
                    fontWeight: 700,
                  }}
                >
                  질문 내용
                </span>

                <textarea
                  value={content}
                  onChange={(event) => {
                    setContent(event.target.value);
                    setError("");
                  }}
                  maxLength={1000}
                  rows={7}
                  placeholder="궁금한 내용이나 발생한 문제를 자세히 작성해 주세요."
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    padding: "12px",
                    resize: "vertical",
                    border: `1px solid ${t.line}`,
                    borderRadius: 9,
                    outline: "none",
                    color: t.ink,
                    background: "#FFFFFF",
                    fontFamily: "inherit",
                    fontSize: 13,
                    lineHeight: 1.65,
                  }}
                />

                <span
                  style={{
                    alignSelf: "flex-end",
                    color: t.mono,
                    fontSize: 10.5,
                  }}
                >
                  {content.length} / 1000
                </span>
              </label>

              {error && (
                <p
                  role="alert"
                  style={{
                    margin: 0,
                    padding: "10px 12px",
                    border: "1px solid #F2C4BC",
                    borderRadius: 8,
                    color: t.red,
                    background: "#FFF4F1",
                    fontSize: 12,
                  }}
                >
                  {error}
                </p>
              )}
            </div>

            <footer
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 9,
                padding: "17px 26px",
                borderTop: `1px solid ${t.lineSoft}`,
                background: t.bgWarm,
              }}
            >
              <button
                type="button"
                onClick={closeModal}
                style={{
                  minHeight: 40,
                  padding: "0 17px",
                  border: `1px solid ${t.line}`,
                  borderRadius: 8,
                  color: t.inkSoft,
                  background: "#FFFFFF",
                  fontSize: 12.5,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                취소
              </button>

              <button
                type="submit"
                style={{
                  minHeight: 40,
                  padding: "0 19px",
                  border: "none",
                  borderRadius: 8,
                  color: "#FFFFFF",
                  background: t.blue,
                  fontSize: 12.5,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                질문 등록
              </button>
            </footer>
          </form>
        </div>
      )}
    </section>
  );
}