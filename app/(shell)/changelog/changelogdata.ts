export type ChangelogData = {
  id: number;
  version: string;
  title: string;
  description: string;
  date: string;
  views: number;
};

export const changelogData: ChangelogData[] = [
  {
    id: 5,
    version: "v0.4.0",
    title: "FAQ 페이지가 추가되었습니다.",
    description:
      "OAAS 이용자들이 자주 묻는 질문과 그에 대한 답변 목록을 추가하였습니다.",
    date: "2026-07-05",
    views: 0,
  },
  {
    id: 4,
    version: "v0.3.0",
    title: "이용 방법 페이지가 추가되었습니다.",
    description:
      "처음 OAAS를 이용하는 사용자가 캠페인 신청부터 운영팀 검토, 광고 송출 확인, 성과 분석까지의 전체 과정을 쉽게 이해할 수 있도록 이용 방법 페이지를 추가했습니다.",
    date: "2026-07-02",
    views: 38,
  },
  {
    id: 3,
    version: "v0.2.1",
    title: "기간별 분석 날짜 표시 오류를 수정했습니다.",
    description:
      "기간별 분석 화면에서 일부 날짜가 실제 조회 기간과 다르게 표시되던 문제를 수정하고, 선택한 시작일과 종료일이 정확하게 반영되도록 개선했습니다.",
    date: "2026-06-30",
    views: 17,
  },
  {
    id: 2,
    version: "v0.2.0",
    title: "시간대별 평균 노출 차트가 추가되었습니다.",
    description:
      "여러 날짜를 조회할 때 시간대별 광고 노출 추이를 쉽게 비교할 수 있도록 시간대별 평균 노출 차트를 추가했습니다.",
    date: "2026-06-27",
    views: 34,
  },
  {
    id: 1,
    version: "v0.0.0",
    title: "OAAS 초기 버전이 배포되었습니다.",
    description:
      "오프라인 광고의 노출 인구, 관심 인구, 체류 시간과 성별·연령대별 성과를 확인할 수 있는 OAAS의 초기 버전을 배포했습니다.",
    date: "2026-06-25",
    views: 51,
  },
];