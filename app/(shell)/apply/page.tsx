"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface SlotItem { length: number | null; mine: boolean; }
interface AddressItem { addr: string; label: string; }
interface FormData {
  brand: string;
  company: string;
  category: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  adLength: number | null;
  slots: SlotItem[];
  placement: "indoor" | "outdoor";
  addresses: AddressItem[];
  ages: string[];
  gender: "all" | "m" | "f";
  name: string;
  phone: string;
  email: string;
}

type SetFn = <K extends keyof FormData>(k: K, v: FormData[K]) => void;

// ─── Constants ────────────────────────────────────────────────────────────────
const CATEGORY_LIST = [
  { id: "fnb",     label: "식음료",        glyph: "FB" },
  { id: "fashion", label: "패션·의류",     glyph: "FS" },
  { id: "beauty",  label: "뷰티·화장품",   glyph: "BT" },
  { id: "it",      label: "IT·전자",       glyph: "IT" },
  { id: "fin",     label: "금융·보험",     glyph: "FN" },
  { id: "edu",     label: "교육",          glyph: "ED" },
  { id: "med",     label: "의료·헬스케어", glyph: "MD" },
  { id: "pub",     label: "공공·캠페인",   glyph: "PB" },
];

const AGE_LIST = [
  { id: "10",  label: "10대" },
  { id: "20",  label: "20대" },
  { id: "30",  label: "30대" },
  { id: "40",  label: "40대" },
  { id: "50",  label: "50대" },
  { id: "60",  label: "60대" },
  { id: "70",  label: "70대+" },
  { id: "all", label: "전체" },
];

const INITIAL: FormData = {
  brand: "", company: "", category: "",
  startDate: "", endDate: "",
  startTime: "07:00", endTime: "22:00",
  adLength: 15,
  slots: [{ length: 15, mine: true }],
  placement: "indoor",
  addresses: [{ addr: "", label: "" }],
  ages: [], gender: "all",
  name: "", phone: "", email: "",
};

// ─── Icons ────────────────────────────────────────────────────────────────────
const PlusIcon = () => (
  <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
    <path d="M8 3v10M3 8h10" />
  </svg>
);

const MinusIcon = () => (
  <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
    <path d="M3 8h10" />
  </svg>
);

const XIcon = () => (
  <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
    <path d="M3.5 3.5l9 9M12.5 3.5l-9 9" />
  </svg>
);

const ArrowIcon = () => (
  <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M3 8h10M9.5 4.5L13 8l-3.5 3.5" />
  </svg>
);

const IndoorIcon = () => (
  <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 17h14M4 17V8l6-4 6 4v9M8 17v-4h4v4" />
  </svg>
);

const OutdoorIcon = () => (
  <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="10" cy="6" r="2.5" />
    <path d="M3 17c1.5-3 4-5 7-5s5.5 2 7 5M13.5 17v-3" />
  </svg>
);

const CaretIcon = () => (
  <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 6.5l4 3.5 4-3.5" />
  </svg>
);

const CheckIcon = () => (
  <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3.5 8.5l3 3 6-7" />
  </svg>
);

const RefreshIcon = () => (
  <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M13 4.5a5.5 5.5 0 1 0 1.4 5.5M13 2v3h-3" />
  </svg>
);

// ─── Shared class strings ─────────────────────────────────────────────────────
const inputCls = [
  "w-full h-11 px-[14px] bg-white border border-[#d7dce5] rounded-[10px]",
  "text-[14px] text-[#0c1424] outline-none transition-all",
  "placeholder:text-[#b3bac8]",
  "focus:border-[#0c1424] focus:shadow-[0_0_0_4px_rgba(12,20,36,0.06)]",
].join(" ");

const sectionCls = [
  "bg-white border border-[#e6e9ef] rounded-[22px] overflow-hidden",
  "shadow-[0_1px_0_rgba(12,20,36,0.02),0_8px_24px_-16px_rgba(12,20,36,0.08)]",
].join(" ");

// ─── Field ────────────────────────────────────────────────────────────────────
function Field({ label, required, optional, hint, error, children, className = "" }: {
  label?: string; required?: boolean; optional?: boolean;
  hint?: string; error?: string; children: ReactNode; className?: string;
}) {
  return (
    <div className={`flex flex-col gap-2 min-w-0 ${className}`}>
      {label && (
        <label className="flex items-center gap-2 text-[13px] font-semibold text-[#0c1424]">
          <span>{label}</span>
          {required && <span className="text-[#2A6FDB] font-mono text-[12px]">*</span>}
          {optional && (
            <span className="font-mono text-[10px] tracking-[0.08em] text-[#b3bac8] px-1.5 py-0.5 border border-[#e6e9ef] rounded-[4px]">
              선택
            </span>
          )}
        </label>
      )}
      {children}
      {error
        ? <div className="text-[12px] text-[#b91c1c] font-semibold">{error}</div>
        : hint && <div className="text-[12px] text-[#8a93a6] leading-[1.5]">{hint}</div>
      }
    </div>
  );
}

// ─── Input primitives ─────────────────────────────────────────────────────────
function TextInput({ value, onChange, placeholder, suffix, type = "text", maxLength }: {
  value: string; onChange: (v: string) => void; placeholder?: string;
  suffix?: string; type?: string; maxLength?: number;
}) {
  return (
    <div className="relative">
      <input
        type={type}
        className={`${inputCls}${suffix ? " pr-14" : ""}`}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
      />
      {suffix && (
        <span className="absolute right-[14px] top-1/2 -translate-y-1/2 font-mono text-[12px] text-[#8a93a6] pointer-events-none">
          {suffix}
        </span>
      )}
    </div>
  );
}

function NumberInput({ value, onChange, min, max, suffix }: {
  value: number | null; onChange: (v: number | null) => void;
  min?: number; max?: number; suffix?: string;
}) {
  return (
    <div className="relative">
      <input
        type="number"
        className={`${inputCls}${suffix ? " pr-14" : ""}`}
        value={value ?? ""}
        min={min} max={max}
        onChange={e => onChange(e.target.value === "" ? null : Number(e.target.value))}
      />
      {suffix && (
        <span className="absolute right-[14px] top-1/2 -translate-y-1/2 font-mono text-[12px] text-[#8a93a6] pointer-events-none">
          {suffix}
        </span>
      )}
    </div>
  );
}

function DateInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <input type="date" className={inputCls} value={value} onChange={e => onChange(e.target.value)} />
  );
}

function TimeInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <input type="time" className={inputCls} value={value} onChange={e => onChange(e.target.value)} />
  );
}

function SelectInput({ value, onChange, options, placeholder }: {
  value: string; onChange: (v: string) => void;
  options: { value: string; label: string }[]; placeholder?: string;
}) {
  return (
    <div className="relative">
      <select
        className={`${inputCls} appearance-none pr-9 cursor-pointer`}
        value={value}
        onChange={e => onChange(e.target.value)}
      >
        <option value="" disabled>{placeholder || "선택해 주세요"}</option>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <span className="absolute right-[14px] top-1/2 -translate-y-1/2 pointer-events-none text-[#8a93a6]">
        <CaretIcon />
      </span>
    </div>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-9 px-[14px] rounded-full border text-[13px] cursor-pointer inline-flex items-center gap-1.5 transition-all ${
        active
          ? "bg-[#0c1424] border-[#0c1424] text-white font-semibold"
          : "bg-white border-[#d7dce5] text-[#475066] font-medium hover:border-[#8a93a6] hover:text-[#0c1424]"
      }`}
    >
      {children}
    </button>
  );
}

function Segment({ value, onChange, options }: {
  value: string; onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="inline-grid grid-flow-col p-1 bg-[#f7f9fc] border border-[#e6e9ef] rounded-[10px]">
      {options.map(o => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          className={`border-0 cursor-pointer px-[18px] py-2 text-[13px] font-semibold min-w-[84px] rounded-[7px] transition-all ${
            value === o.value ? "bg-[#0c1424] text-white" : "bg-transparent text-[#475066]"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

// ─── Section header helper ────────────────────────────────────────────────────
function SectionHead({ eyebrow, title, desc, step }: {
  eyebrow: string; title: string; desc: string; step: string;
}) {
  return (
    <div className="px-7 pt-[22px] pb-1 flex items-baseline justify-between">
      <div>
        <div className="font-mono text-[11px] tracking-[0.12em] text-[#2A6FDB] font-semibold uppercase">{eyebrow}</div>
        <h2 className="text-[22px] font-extrabold tracking-[-0.01em] mt-1.5 mb-0">{title}</h2>
        <div className="text-[#475066] text-[13px] mt-1.5">{desc}</div>
      </div>
      <div className="font-mono text-[12px] text-[#b3bac8] shrink-0 ml-4">{step}</div>
    </div>
  );
}

// ─── Section 01: 브랜드 정보 ───────────────────────────────────────────────────
function SectionBrand({ data, set }: { data: FormData; set: SetFn }) {
  return (
    <section className={sectionCls}>
      <SectionHead eyebrow="SECTION · BRAND" title="브랜드 정보" desc="캠페인을 게시할 브랜드와 광고주 회사를 입력해 주세요." step="STEP 01 / 04" />
      <div className="px-7 pt-[22px] pb-[26px] grid grid-cols-12 gap-x-5 gap-y-[18px]">
        <div className="col-span-6">
          <Field label="브랜드 명" required hint="대시보드와 송출 화면에 노출되는 이름입니다.">
            <TextInput value={data.brand} onChange={v => set("brand", v)} placeholder="예: NOON 커피랩" maxLength={40} />
          </Field>
        </div>
        <div className="col-span-6">
          <Field label="회사 명" required hint="사업자 등록 상의 정식 회사명을 적어 주세요.">
            <TextInput value={data.company} onChange={v => set("company", v)} placeholder="예: 주식회사 누온" maxLength={60} />
          </Field>
        </div>
        <div className="col-span-12">
          <Field label="광고 카테고리" required hint="하나만 선택할 수 있습니다. 카테고리에 따라 노출 가능한 디바이스가 달라질 수 있어요.">
            <div className="grid grid-cols-4 gap-[10px]">
              {CATEGORY_LIST.map(c => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => set("category", c.id)}
                  className={`flex items-center gap-[10px] px-[14px] py-3 border rounded-[12px] cursor-pointer transition-all text-left ${
                    data.category === c.id
                      ? "border-[#0c1424] bg-[#0c1424] text-white"
                      : "border-[#d7dce5] bg-white hover:border-[#8a93a6]"
                  }`}
                >
                  <span className={`w-7 h-7 rounded-[8px] flex items-center justify-center font-mono text-[11px] font-bold shrink-0 ${
                    data.category === c.id
                      ? "bg-white/10 border border-white/20 text-white"
                      : "bg-[#f7f9fc] border border-[#e6e9ef] text-[#475066]"
                  }`}>
                    {c.glyph}
                  </span>
                  <span className="text-[13px] font-semibold">{c.label}</span>
                </button>
              ))}
            </div>
          </Field>
        </div>
      </div>
    </section>
  );
}

// ─── Section 02: 광고 정보 ────────────────────────────────────────────────────
function SectionCampaign({ data, set }: { data: FormData; set: SetFn }) {
  const myIdx = data.slots.findIndex(s => s.mine);
  const totalLoop = data.slots.reduce((a, b) => a + (Number(b.length) || 0), 0);

  function setSlotCount(n: number) {
    const next = [...data.slots];
    while (next.length < n) next.push({ length: 15, mine: false });
    while (next.length > n) next.pop();
    if (!next.some(s => s.mine)) next[0].mine = true;
    set("slots", next);
  }

  function chooseMine(i: number) {
    set("slots", data.slots.map((s, k) => ({ ...s, mine: k === i })));
  }

  function setSlotLen(i: number, v: number | null) {
    const next = data.slots.map((s, k) => k === i ? { ...s, length: v } : s);
    set("slots", next);
    if (next[i].mine) set("adLength", v);
  }

  return (
    <section className={sectionCls}>
      <SectionHead
        eyebrow="SECTION · CAMPAIGN"
        title="광고 정보"
        desc="송출 기간, 시간대, 슬롯 구성을 설정합니다. 슬롯의 위치는 시선 데이터 수집 구간과 직접 연결돼요."
        step="STEP 02 / 04"
      />
      <div className="px-7 pt-[22px] pb-[26px] grid grid-cols-12 gap-x-5 gap-y-[18px]">
        {/* 기간 */}
        <div className="col-span-12">
          <Field label="광고 게재 기간" required hint="시작일·종료일을 모두 선택해 주세요. 종료일 24:00에 자동 종료됩니다.">
            <div className="grid gap-[10px] items-center" style={{ gridTemplateColumns: "1fr auto 1fr" }}>
              <DateInput value={data.startDate} onChange={v => set("startDate", v)} />
              <span className="text-[#b3bac8]"><ArrowIcon /></span>
              <DateInput value={data.endDate} onChange={v => set("endDate", v)} />
            </div>
          </Field>
        </div>

        {/* 시간대 */}
        <div className="col-span-6">
          <Field label="광고 송출 시간" required hint="이 시간대에만 송출됩니다. (디바이스 운영 시간 내에서 적용)">
            <div className="grid gap-[10px] items-center" style={{ gridTemplateColumns: "1fr auto 1fr" }}>
              <TimeInput value={data.startTime} onChange={v => set("startTime", v)} />
              <span className="text-[#b3bac8]"><ArrowIcon /></span>
              <TimeInput value={data.endTime} onChange={v => set("endTime", v)} />
            </div>
          </Field>
        </div>

        {/* 광고 길이 */}
        <div className="col-span-6">
          <Field label="광고 길이" required hint="프리셋을 누르거나 직접 입력할 수 있어요. 선택한 슬롯의 길이가 함께 갱신됩니다.">
            <div className="flex items-center gap-[10px] flex-wrap">
              <div className="flex gap-2">
                {[15, 30, 60].map(s => (
                  <Chip key={s} active={Number(data.adLength) === s} onClick={() => {
                    set("adLength", s);
                    if (myIdx >= 0) set("slots", data.slots.map((sl, k) => k === myIdx ? { ...sl, length: s } : sl));
                  }}>{s}초</Chip>
                ))}
              </div>
              <div className="w-[140px]">
                <NumberInput value={data.adLength} onChange={v => {
                  set("adLength", v);
                  if (myIdx >= 0 && v != null) set("slots", data.slots.map((sl, k) => k === myIdx ? { ...sl, length: v } : sl));
                }} min={5} max={300} suffix="초" />
              </div>
            </div>
          </Field>
        </div>

        {/* divider */}
        <div className="col-span-12 h-px bg-[#e6e9ef] my-1" />

        {/* 슬롯 구성 */}
        <div className="col-span-12">
          <Field
            label="광고 송출 주기 · 슬롯 구성"
            required
            hint="한 디바이스에서 여러 광고가 번갈아 송출될 때, 우리 광고의 순서를 지정합니다. 선택된 슬롯의 시간대에만 시선 데이터를 수집해요."
          >
            <div className="flex flex-col gap-[14px]">
              {/* controls */}
              <div className="flex gap-3 items-end flex-wrap">
                <div className="flex flex-col gap-1.5">
                  <span className="text-[13px] font-semibold text-[#0c1424]">총 슬롯 수</span>
                  <span className="text-[12px] text-[#8a93a6]">한 사이클에 포함되는 광고 개수입니다.</span>
                  <div className="inline-flex items-center h-11 border border-[#d7dce5] rounded-[10px] overflow-hidden bg-white">
                    <button
                      type="button"
                      onClick={() => setSlotCount(Math.max(1, data.slots.length - 1))}
                      className="w-[42px] h-full border-0 bg-transparent text-[#475066] cursor-pointer flex items-center justify-center hover:bg-[#f7f9fc] hover:text-[#0c1424] transition-colors"
                    >
                      <MinusIcon />
                    </button>
                    <span className="min-w-[42px] text-center font-mono font-semibold text-[14px]">{data.slots.length}</span>
                    <button
                      type="button"
                      onClick={() => setSlotCount(Math.min(8, data.slots.length + 1))}
                      className="w-[42px] h-full border-0 bg-transparent text-[#475066] cursor-pointer flex items-center justify-center hover:bg-[#f7f9fc] hover:text-[#0c1424] transition-colors"
                    >
                      <PlusIcon />
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <span className="text-[13px] font-semibold text-[#0c1424]">내 광고 순서</span>
                  <span className="text-[12px] text-[#8a93a6]">슬롯을 직접 눌러서 지정할 수도 있어요.</span>
                  <SelectInput
                    value={String(myIdx + 1)}
                    onChange={v => chooseMine(Number(v) - 1)}
                    options={data.slots.map((_, i) => ({ value: String(i + 1), label: `${i + 1}번째 슬롯` }))}
                  />
                </div>

                <div className="flex flex-col gap-1.5 min-w-[200px]">
                  <span className="text-[13px] font-semibold text-[#0c1424]">한 사이클 총 길이</span>
                  <span className="text-[12px] text-[#8a93a6] invisible">placeholder</span>
                  <div className="h-11 px-[14px] bg-white border border-[#d7dce5] rounded-[10px] flex items-center font-mono font-semibold text-[14px]">
                    {totalLoop}초
                    <span className="ml-2 font-normal font-sans text-[#8a93a6] text-[12px]">
                      · 약 {Math.round((3600 / Math.max(1, totalLoop)) * 10) / 10}회 / 시간
                    </span>
                  </div>
                </div>
              </div>

              {/* slot track */}
              <div className="flex gap-[10px] p-[18px] bg-[#f7f9fc] border border-dashed border-[#d7dce5] rounded-[14px] overflow-x-auto">
                {data.slots.map((s, i) => (
                  <div
                    key={i}
                    role="button"
                    onClick={() => chooseMine(i)}
                    className={`flex-1 min-w-[120px] rounded-[12px] p-[14px] cursor-pointer relative transition-all flex flex-col gap-2 ${
                      s.mine
                        ? "bg-[#0c1424] border border-[#0c1424] shadow-[0_8px_20px_-10px_rgba(12,20,36,0.45)]"
                        : "bg-white border border-[#d7dce5] hover:border-[#8a93a6]"
                    }`}
                  >
                    {s.mine && (
                      <span className="absolute -top-2 right-[10px] bg-[#2A6FDB] text-white font-mono text-[10px] tracking-[0.08em] px-2 py-0.5 rounded-[4px] font-bold">
                        MY AD
                      </span>
                    )}
                    <span className={`font-mono text-[11px] tracking-[0.08em] uppercase ${s.mine ? "text-white/60" : "text-[#8a93a6]"}`}>
                      SLOT {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className={`text-[13px] ${s.mine ? "text-white font-bold" : "text-[#475066] font-medium"}`}>
                      {s.mine ? (data.brand || "내 광고") : "다른 광고"}
                    </span>
                    <div onClick={e => e.stopPropagation()} className="flex items-center gap-1">
                      <input
                        type="number"
                        value={s.length ?? ""}
                        onChange={e => setSlotLen(i, e.target.value === "" ? null : Number(e.target.value))}
                        min={5} max={300}
                        className={`w-full border-0 bg-transparent p-0 font-mono text-[13px] font-semibold outline-none ${s.mine ? "text-white" : "text-[#475066]"}`}
                      />
                      <span className={`font-mono text-[12px] ${s.mine ? "text-white/80" : "text-[#475066]"}`}>초</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* legend */}
              <div className="flex gap-[18px] text-[#8a93a6] text-[12px]">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-[3px] bg-[#0c1424] border border-[#0c1424] shrink-0" />
                  내 광고 슬롯 — 이 구간만 시선 데이터를 DB에 저장합니다
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-[3px] bg-white border border-[#d7dce5] shrink-0" />
                  다른 광고 — 데이터 미수집
                </span>
              </div>
            </div>
          </Field>
        </div>
      </div>
    </section>
  );
}

// ─── Section 03: 매체·타겟 정보 ───────────────────────────────────────────────
function SectionMediaTarget({ data, set }: { data: FormData; set: SetFn }) {
  function addAddr() {
    set("addresses", [...data.addresses, { addr: "", label: "" }]);
  }
  function setAddr(i: number, key: keyof AddressItem, v: string) {
    set("addresses", data.addresses.map((a, k) => k === i ? { ...a, [key]: v } : a));
  }
  function delAddr(i: number) {
    if (data.addresses.length === 1) return;
    set("addresses", data.addresses.filter((_, k) => k !== i));
  }
  function toggleAge(a: string) {
    const has = data.ages.includes(a);
    set("ages", has ? data.ages.filter(x => x !== a) : [...data.ages, a]);
  }

  return (
    <section className={sectionCls}>
      <SectionHead
        eyebrow="SECTION · MEDIA & TARGET"
        title="매체 · 타겟 정보"
        desc="디바이스가 설치된 위치와, 광고를 보여 주고 싶은 타겟군을 설정합니다."
        step="STEP 03 / 04"
      />
      <div className="px-7 pt-[22px] pb-[26px] grid grid-cols-12 gap-x-5 gap-y-[18px]">
        {/* 위치 */}
        <div className="col-span-12">
          <Field label="광고 위치" required hint="실내·실외에 따라 노출 환경, 시선 추적 정확도, 단가가 달라집니다.">
            <div className="grid grid-cols-2 gap-3">
              {([
                { id: "indoor" as const, label: "실내 INDOOR", desc: "카페·로비·매장 등 실내 설치 디바이스", Icon: IndoorIcon },
                { id: "outdoor" as const, label: "실외 OUTDOOR", desc: "옥외 사이니지·버스 정류장·지하철 등", Icon: OutdoorIcon },
              ] as const).map(loc => (
                <button
                  key={loc.id}
                  type="button"
                  onClick={() => set("placement", loc.id)}
                  className={`border rounded-[12px] p-4 cursor-pointer flex items-center gap-[14px] transition-all text-left ${
                    data.placement === loc.id
                      ? "border-[#0c1424] bg-[#0c1424] text-white"
                      : "border-[#d7dce5] bg-white hover:border-[#8a93a6]"
                  }`}
                >
                  <span className={`w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0 ${
                    data.placement === loc.id
                      ? "bg-white/10 border border-white/20 text-white"
                      : "bg-[#f7f9fc] border border-[#e6e9ef] text-[#475066]"
                  }`}>
                    <loc.Icon />
                  </span>
                  <div>
                    <div className="text-[14px] font-bold">{loc.label}</div>
                    <div className={`text-[12px] mt-0.5 ${data.placement === loc.id ? "text-white/60" : "text-[#8a93a6]"}`}>
                      {loc.desc}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </Field>
        </div>

        {/* 주소 */}
        <div className="col-span-12">
          <Field label="광고 주소 (디바이스 위치)" required hint="디바이스가 설치될 주소를 입력해 주세요. 여러 디바이스에 송출하려면 행을 추가하세요.">
            <div className="flex flex-col gap-[10px]">
              {data.addresses.map((a, i) => (
                <div
                  key={i}
                  className="items-center p-[10px_12px] bg-[#f7f9fc] border border-[#e6e9ef] rounded-[12px]"
                  style={{ display: "grid", gridTemplateColumns: "32px 1fr 220px 40px", gap: 10 }}
                >
                  <span className="w-8 h-8 rounded-[8px] bg-white border border-[#d7dce5] grid place-items-center font-mono text-[12px] font-semibold text-[#475066]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <input
                    className={inputCls}
                    style={{ height: 38 }}
                    value={a.addr}
                    onChange={e => setAddr(i, "addr", e.target.value)}
                    placeholder="예: 서울특별시 마포구 양화로 45, 3층 (서교동)"
                  />
                  <input
                    className={inputCls}
                    style={{ height: 38 }}
                    value={a.label}
                    onChange={e => setAddr(i, "label", e.target.value)}
                    placeholder="별칭 (예: 홍대 1호점)"
                  />
                  <button
                    type="button"
                    onClick={() => delAddr(i)}
                    title="주소 삭제"
                    className="w-8 h-8 rounded-[8px] border border-[#e6e9ef] bg-white text-[#8a93a6] cursor-pointer flex items-center justify-center hover:text-[#b91c1c] hover:border-[#b91c1c] transition-all"
                  >
                    <XIcon />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addAddr}
                className="self-start h-[38px] px-3 inline-flex items-center gap-2 border border-[#e6e9ef] bg-transparent rounded-[8px] text-[13px] font-semibold text-[#0c1424] cursor-pointer hover:border-[#8a93a6] transition-all"
              >
                <PlusIcon /> 주소 추가
              </button>
            </div>
          </Field>
        </div>

        {/* divider */}
        <div className="col-span-12 h-px bg-[#e6e9ef] my-1" />

        {/* 연령대 */}
        <div className="col-span-8">
          <Field label="타겟 연령층" required hint="복수 선택 가능. 시선 데이터의 인구 통계 추정값과 매칭됩니다.">
            <div className="grid grid-cols-8 gap-2">
              {AGE_LIST.map(a => (
                <Chip key={a.id} active={data.ages.includes(a.id)} onClick={() => toggleAge(a.id)}>
                  {data.ages.includes(a.id) && <CheckIcon />}
                  {a.label}
                </Chip>
              ))}
            </div>
          </Field>
        </div>

        {/* 성별 */}
        <div className="col-span-4">
          <Field label="타겟 성별" required hint="기본값은 전체입니다.">
            <Segment
              value={data.gender}
              onChange={v => set("gender", v as FormData["gender"])}
              options={[
                { value: "all", label: "전체" },
                { value: "m",   label: "남성" },
                { value: "f",   label: "여성" },
              ]}
            />
          </Field>
        </div>
      </div>
    </section>
  );
}

// ─── Section 04: 담당자 정보 ───────────────────────────────────────────────────
function SectionContact({ data, set }: { data: FormData; set: SetFn }) {
  return (
    <section className={sectionCls}>
      <SectionHead
        eyebrow="SECTION · CONTACT"
        title="담당자 정보"
        desc="신청 검토 결과와 송출 보고서를 받아 보실 담당자의 정보를 입력해 주세요."
        step="STEP 04 / 04"
      />
      <div className="px-7 pt-[22px] pb-[26px] grid grid-cols-12 gap-x-5 gap-y-[18px]">
        <div className="col-span-4">
          <Field label="담당자 이름" required>
            <TextInput value={data.name} onChange={v => set("name", v)} placeholder="홍길동" maxLength={30} />
          </Field>
        </div>
        <div className="col-span-4">
          <Field label="연락처" required hint="'-' 없이 숫자만 입력해도 자동 포맷됩니다.">
            <TextInput value={data.phone} onChange={v => set("phone", v)} placeholder="010-0000-0000" />
          </Field>
        </div>
        <div className="col-span-4">
          <Field label="이메일" required hint="검토 결과와 인보이스가 발송됩니다.">
            <TextInput value={data.email} onChange={v => set("email", v)} placeholder="name@company.com" type="email" />
          </Field>
        </div>
      </div>
    </section>
  );
}

// ─── Summary sidebar ──────────────────────────────────────────────────────────
function SummaryRow({ k, v, sub, placeholder }: { k: string; v: string | null; sub?: string | null; placeholder?: string }) {
  return (
    <div className="grid gap-3 items-start text-[13px]" style={{ gridTemplateColumns: "92px 1fr" }}>
      <span className="font-mono text-[11px] tracking-[0.08em] text-[#8a93a6] uppercase pt-0.5">{k}</span>
      <span className={`font-semibold leading-[1.5] break-all ${v ? "text-[#0c1424]" : "text-[#b3bac8] font-medium"}`}>
        {v || placeholder || "—"}
        {sub && v && <span className="block font-medium text-[#475066] text-[12px] mt-0.5">{sub}</span>}
      </span>
    </div>
  );
}

function formatDate(iso: string) {
  const [y, m, d] = iso.split("-");
  return `${y}. ${m}. ${d}`;
}

function truncate(s: string, n: number) {
  return s.length > n ? s.slice(0, n) + "…" : s;
}

function Summary({ data }: { data: FormData }) {
  const cat = CATEGORY_LIST.find(c => c.id === data.category);
  const ages = data.ages.length
    ? (data.ages.includes("all") ? "전체 연령" : data.ages.filter(a => a !== "all").map(a => a === "70" ? "70대+" : a + "대").join(", "))
    : null;
  const genderLabel = { all: "전체", m: "남성", f: "여성" }[data.gender];
  const myIdx = data.slots.findIndex(s => s.mine);
  const totalLoop = data.slots.reduce((a, b) => a + (Number(b.length) || 0), 0);
  const period = (data.startDate && data.endDate)
    ? `${formatDate(data.startDate)} → ${formatDate(data.endDate)}`
    : null;
  const days = (data.startDate && data.endDate)
    ? Math.max(1, Math.round((new Date(data.endDate).getTime() - new Date(data.startDate).getTime()) / 86400000) + 1)
    : null;
  const addrs = data.addresses.filter(a => a.addr.trim());

  const checks = [
    !!data.brand, !!data.company, !!data.category,
    !!data.startDate, !!data.endDate, !!data.startTime, !!data.endTime,
    !!data.adLength, !!data.placement, addrs.length > 0,
    !!data.ages.length, !!data.gender, !!data.name, !!data.phone, !!data.email,
  ];
  const filled = checks.filter(Boolean).length;
  const pct = Math.round((filled / checks.length) * 100);

  return (
    <aside className={sectionCls}>
      <div className="px-[22px] py-[18px] border-b border-[#e6e9ef] flex items-center justify-between">
        <div>
          <div className="font-mono text-[11px] tracking-[0.12em] text-[#2A6FDB] font-semibold">CAMPAIGN PREVIEW</div>
          <div className="text-[18px] font-extrabold mt-1">신청 요약</div>
        </div>
        <span className="font-mono text-[10px] tracking-[0.06em] px-[7px] py-[3px] rounded-[4px] bg-[#e8efff] text-[#2A6FDB] font-semibold uppercase">
          DRAFT
        </span>
      </div>

      <div className="px-[22px] py-[18px] flex flex-col gap-4 max-h-[calc(100vh-280px)] overflow-y-auto">
        <SummaryRow k="BRAND" v={data.brand || null} sub={data.company || null} placeholder="브랜드 명 미입력" />
        <SummaryRow k="CATEGORY" v={cat ? cat.label : null} placeholder="카테고리 미선택" />
        <SummaryRow k="PERIOD" v={period} sub={days ? `총 ${days}일간 송출` : null} placeholder="기간 미선택" />
        <SummaryRow
          k="DAYPART"
          v={(data.startTime && data.endTime) ? `${data.startTime} ~ ${data.endTime}` : null}
          placeholder="시간대 미설정"
        />
        <SummaryRow
          k="AD LENGTH"
          v={data.adLength ? `${data.adLength}초` : null}
          sub={myIdx >= 0 ? `${data.slots.length}개 슬롯 중 ${myIdx + 1}번째` : null}
          placeholder="광고 길이 미설정"
        />
        <SummaryRow
          k="LOOP"
          v={totalLoop > 0 ? `한 사이클 ${totalLoop}초` : null}
          sub={totalLoop > 0 ? `1시간당 약 ${Math.round((3600 / totalLoop) * 10) / 10}회 송출` : null}
          placeholder="—"
        />
        <SummaryRow
          k="PLACEMENT"
          v={data.placement === "indoor" ? "실내 INDOOR" : data.placement === "outdoor" ? "실외 OUTDOOR" : null}
          placeholder="위치 미선택"
        />
        <SummaryRow
          k="DEVICES"
          v={addrs.length ? `${addrs.length}곳` : null}
          sub={addrs.length
            ? addrs.slice(0, 2).map(a => a.label || truncate(a.addr, 22)).join(" · ") + (addrs.length > 2 ? ` 외 ${addrs.length - 2}곳` : "")
            : null}
          placeholder="주소 미입력"
        />
        <SummaryRow
          k="TARGET"
          v={(ages || genderLabel) ? `${genderLabel || ""}${ages ? " · " + ages : ""}` : null}
          placeholder="타겟 미설정"
        />
        <SummaryRow
          k="CONTACT"
          v={data.name || null}
          sub={[data.phone, data.email].filter(Boolean).join(" · ") || null}
          placeholder="담당자 미입력"
        />
      </div>

      <div className="px-[22px] py-4 border-t border-[#e6e9ef] flex flex-col gap-[10px] bg-[#f7f9fc]">
        <div className="flex items-center justify-between font-mono text-[11px] text-[#8a93a6] tracking-[0.08em]">
          <span>COMPLETION</span>
          <span className="text-[#0c1424] font-bold">{filled} / {checks.length} · {pct}%</span>
        </div>
        <div className="h-1.5 bg-[#e6e9ef] rounded-full overflow-hidden">
          <div className="h-full bg-[#0c1424] rounded-full transition-all duration-300" style={{ width: `${pct}%` }} />
        </div>
        <button
          type="button"
          disabled={pct < 100}
          className="w-full h-12 flex items-center justify-center text-[15px] font-semibold rounded-[10px] bg-[#0c1424] text-white border-0 cursor-pointer transition-colors hover:bg-[#1a2236] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {pct < 100 ? `남은 항목 ${checks.length - filled}개` : "캠페인 신청 제출하기"}
        </button>
      </div>
    </aside>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ApplyPage() {
  const router = useRouter();
  const [data, setData] = useState<FormData>(INITIAL);
  const set: SetFn = (k, v) => setData(d => ({ ...d, [k]: v }));

  return (
    <div className="bg-[#f3f5f8] px-9 pt-7 pb-20 min-h-full">
      {/* Breadcrumb */}
      <div className="flex items-center gap-3 font-mono text-[12px] tracking-[0.08em] text-[#8a93a6]">
        <span>MAIN</span>
        <span className="text-[#b3bac8]">/</span>
        <span>CAMPAIGNS</span>
        <span className="text-[#b3bac8]">/</span>
        <span className="text-[#0c1424] font-semibold">NEW</span>
      </div>

      {/* Page header */}
      <header className="flex items-end justify-between mt-4 mb-7 gap-6">
        <div>
          <h1 className="text-[36px] font-extrabold tracking-[-0.02em] leading-[1.1] m-0">새 캠페인 신청</h1>
          <p className="text-[#475066] mt-2 text-[14px] m-0">
            아래 항목을 작성하면 <strong className="text-[#0c1424] font-bold">OAAS 운영팀</strong>이 24시간 이내 검토 후 송출 일정과 견적을 안내드립니다.
          </p>
        </div>
        <div className="flex gap-[10px] shrink-0">
          <button
            type="button"
            className="inline-flex items-center gap-2 h-11 px-[18px] rounded-[10px] border border-[#d7dce5] bg-white text-[14px] font-semibold text-[#0c1424] cursor-pointer hover:border-[#8a93a6] transition-all"
          >
            <RefreshIcon /> 임시 저장
          </button>
          <button
            type="button"
            onClick={() => router.push("/main")}
            className="inline-flex items-center gap-2 h-11 px-[18px] rounded-[10px] border border-[#e6e9ef] bg-transparent text-[14px] font-semibold text-[#0c1424] cursor-pointer hover:border-[#8a93a6] transition-all"
          >
            <XIcon /> 취소하고 메인으로
          </button>
        </div>
      </header>

      {/* 2-column layout */}
      <div className="grid gap-7 items-start" style={{ gridTemplateColumns: "minmax(0, 1fr) 380px" }}>
        <div className="flex flex-col gap-5 min-w-0">
          <SectionBrand data={data} set={set} />
          <SectionCampaign data={data} set={set} />
          <SectionMediaTarget data={data} set={set} />
          <SectionContact data={data} set={set} />

          {/* Form footer */}
          <div className={`flex justify-between gap-3 items-center px-7 py-[22px] ${sectionCls}`}>
            <div className="text-[#8a93a6] text-[12px] font-mono tracking-[0.05em]">
              모든 항목은 신청 후에도 운영팀에 요청해 수정할 수 있어요.
            </div>
            <div className="flex gap-[10px] shrink-0">
              <button
                type="button"
                className="inline-flex items-center gap-2 h-11 px-[18px] rounded-[10px] border border-[#d7dce5] bg-white text-[14px] font-semibold text-[#0c1424] cursor-pointer hover:border-[#8a93a6] transition-all"
              >
                임시 저장
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-2 h-11 px-[18px] rounded-[10px] border-0 bg-[#0c1424] text-[14px] font-semibold text-white cursor-pointer hover:bg-[#1a2236] transition-all"
              >
                캠페인 신청 제출
              </button>
            </div>
          </div>
        </div>

        <div className="sticky top-6">
          <Summary data={data} />
        </div>
      </div>
    </div>
  );
}
