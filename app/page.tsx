"use client";

import { useMemo, useState } from "react";

/* =====================
  型定義
===================== */
type JobKey =
  | "SALES_NEW"
  | "SALES_ROUTE"
  | "SALES_INSIDE"
  | "SALES_FIELD"
  | "TECH_HELPDESK"
  | "TECH_DEV"
  | "TECH_INFRA"
  | "SERVICE_RETAIL"
  | "SERVICE_FOOD"
  | "SERVICE_HOTEL"
  | "OFFICE_GENERAL"
  | "OFFICE_SALES_ASSIST"
  | "HR_RECRUITER"
  | "HR_GENERALIST"
  | "MARKETER"
  | "ACCOUNTING"
  | "FINANCE"
  | "PRODUCT_MANAGER"
  | "DESIGNER"
  | "CREATIVE"
  | "MANAGEMENT"
  | "MANUFACTURING_LINE"
  | "PROF_MED_DOCTOR"
  | "PROF_MED_NURSE"
  | "PROF_MED_CARE"
  | "PROF_LAWYER"
  | "PROF_TAX"
  | "PROF_ACCOUNTING"
  | "OTHER";

type IndustryKey =
  | "IT_SAAS_B2B"
  | "IT_WEB_B2C"
  | "IT_SES"
  | "IT_SI"
  | "HR_AGENCY"
  | "HR_MEDIA"
  | "LOGI_3PL"
  | "LOGI_LASTMILE"
  | "RETAIL_CHAIN"
  | "RETAIL_LUXURY"
  | "FIN_BANK"
  | "FIN_INSURANCE"
  | "FIN_SECURITIES"
  | "MANUFACTURING_FACTORY"
  | "MANUFACTURING_ELECTRONICS"
  | "SERVICE_FOOD"
  | "SERVICE_HOTEL"
  | "MEDICAL_HOSPITAL"
  | "MEDICAL_CLINIC"
  | "PUBLIC_GOV"
  | "EDU_SCHOOL"
  | "CONSTRUCTION"
  | "REAL_ESTATE"
  | "OTHER";

type TenureKey = "LT_6M" | "M6_TO_1Y" | "Y1_TO_3Y" | "Y3_TO_5Y" | "GE_5Y";

/* =====================
  定数
===================== */
const AGE_OPTIONS = Array.from({ length: 43 }, (_, i) => String(18 + i));
const INCOME_OPTIONS = Array.from({ length: 81 }, (_, i) => String(200 + i * 10));

const JOB_GROUPS: { group: string; options: { label: string; value: JobKey }[] }[] = [
  {
    group: "営業",
    options: [
      { label: "法人営業（新規）", value: "SALES_NEW" },
      { label: "法人営業（ルート）", value: "SALES_ROUTE" },
      { label: "インサイドセールス", value: "SALES_INSIDE" },
      { label: "個人営業/フィールド", value: "SALES_FIELD" },
    ],
  },
  {
    group: "IT",
    options: [
      { label: "ヘルプデスク", value: "TECH_HELPDESK" },
      { label: "エンジニア/開発", value: "TECH_DEV" },
      { label: "インフラ/運用", value: "TECH_INFRA" },
    ],
  },
  {
    group: "バックオフィス / 企画",
    options: [
      { label: "採用（人事）", value: "HR_RECRUITER" },
      { label: "人事（制度/労務）", value: "HR_GENERALIST" },
      { label: "マーケター", value: "MARKETER" },
      { label: "経理", value: "ACCOUNTING" },
      { label: "財務/金融", value: "FINANCE" },
      { label: "PM/PdM", value: "PRODUCT_MANAGER" },
      { label: "経営/マネジメント", value: "MANAGEMENT" },
    ],
  },
  {
    group: "販売・サービス",
    options: [
      { label: "小売（販売/接客）", value: "SERVICE_RETAIL" },
      { label: "飲食（ホール/接客）", value: "SERVICE_FOOD" },
      { label: "ホテル/観光", value: "SERVICE_HOTEL" },
    ],
  },
  {
    group: "事務",
    options: [
      { label: "一般事務", value: "OFFICE_GENERAL" },
      { label: "営業事務", value: "OFFICE_SALES_ASSIST" },
    ],
  },
  {
    group: "製造",
    options: [{ label: "製造（ライン）", value: "MANUFACTURING_LINE" }],
  },
  {
    group: "医療・介護",
    options: [
      { label: "医師", value: "PROF_MED_DOCTOR" },
      { label: "看護師", value: "PROF_MED_NURSE" },
      { label: "介護職", value: "PROF_MED_CARE" },
    ],
  },
  {
    group: "士業",
    options: [
      { label: "弁護士", value: "PROF_LAWYER" },
      { label: "税理士", value: "PROF_TAX" },
      { label: "公認会計士", value: "PROF_ACCOUNTING" },
    ],
  },
  {
    group: "クリエイティブ",
    options: [
      { label: "デザイナー", value: "DESIGNER" },
      { label: "制作/クリエイティブ", value: "CREATIVE" },
    ],
  },
  {
    group: "その他",
    options: [{ label: "その他", value: "OTHER" }],
  },
];

const INDUSTRY_OPTIONS: { label: string; value: IndustryKey }[] = [
  { label: "SaaS（BtoB）", value: "IT_SAAS_B2B" },
  { label: "Webサービス（BtoC）", value: "IT_WEB_B2C" },
  { label: "SES", value: "IT_SES" },
  { label: "SIer", value: "IT_SI" },
  { label: "人材紹介", value: "HR_AGENCY" },
  { label: "求人メディア", value: "HR_MEDIA" },
  { label: "物流（3PL）", value: "LOGI_3PL" },
  { label: "物流（ラストマイル）", value: "LOGI_LASTMILE" },
  { label: "小売チェーン", value: "RETAIL_CHAIN" },
  { label: "ラグジュアリー", value: "RETAIL_LUXURY" },
  { label: "銀行", value: "FIN_BANK" },
  { label: "保険", value: "FIN_INSURANCE" },
  { label: "証券", value: "FIN_SECURITIES" },
  { label: "メーカー工場", value: "MANUFACTURING_FACTORY" },
  { label: "メーカー（電機/精密）", value: "MANUFACTURING_ELECTRONICS" },
  { label: "飲食", value: "SERVICE_FOOD" },
  { label: "ホテル/観光", value: "SERVICE_HOTEL" },
  { label: "医療（病院）", value: "MEDICAL_HOSPITAL" },
  { label: "医療（クリニック）", value: "MEDICAL_CLINIC" },
  { label: "官公庁/自治体", value: "PUBLIC_GOV" },
  { label: "教育", value: "EDU_SCHOOL" },
  { label: "建設", value: "CONSTRUCTION" },
  { label: "不動産", value: "REAL_ESTATE" },
  { label: "その他", value: "OTHER" },
];

const TENURE_OPTIONS: { label: string; value: TenureKey }[] = [
  { label: "半年未満", value: "LT_6M" },
  { label: "半年〜1年", value: "M6_TO_1Y" },
  { label: "1〜3年", value: "Y1_TO_3Y" },
  { label: "3〜5年", value: "Y3_TO_5Y" },
  { label: "5年以上", value: "GE_5Y" },
];

/* =====================
  ラベル取得
===================== */
const labelJob = (key: JobKey) =>
  JOB_GROUPS.flatMap((g) => g.options).find((o) => o.value === key)?.label ?? "その他";
const labelIndustry = (key: IndustryKey) =>
  INDUSTRY_OPTIONS.find((o) => o.value === key)?.label ?? "その他";
const labelTenure = (key: TenureKey) =>
  TENURE_OPTIONS.find((o) => o.value === key)?.label ?? "";

/* =====================
  コンポーネント
===================== */
export default function Home() {
  const [age, setAge] = useState("");
  const [currentIncomeMan, setCurrentIncomeMan] = useState("");
  const [jobKey, setJobKey] = useState<JobKey>("SALES_FIELD");
  const [industryKey, setIndustryKey] = useState<IndustryKey>("IT_SAAS_B2B");
  const [tenureKey, setTenureKey] = useState<TenureKey>("Y1_TO_3Y");

  const [result, setResult] = useState<any>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const payload = useMemo(
    () => ({
      age: Number(age),
      currentIncomeMan: Number(currentIncomeMan),
      jobKey,
      industryKey,
      tenureYears: tenureKey,
    }),
    [age, currentIncomeMan, jobKey, industryKey, tenureKey]
  );

  const submit = async () => {
    if (!age || !currentIncomeMan) {
      setMessage("年齢と年収を選択してください。");
      return;
    }
    setLoading(true);
    setMessage("");
    setResult(null);

    const res = await fetch("/api/diagnose", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    setResult(json);
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-white text-zinc-900">
      <div className="mx-auto max-w-3xl px-4 py-10 space-y-6">
        <h1 className="text-2xl font-bold">年収診断</h1>

        {/* 入力 */}
        <div className="rounded-xl border p-6 space-y-4">
          <select className="w-full border p-2" value={age} onChange={(e) => setAge(e.target.value)}>
            <option value="">年齢</option>
            {AGE_OPTIONS.map((v) => (
              <option key={v}>{v}</option>
            ))}
          </select>

          <select
            className="w-full border p-2"
            value={currentIncomeMan}
            onChange={(e) => setCurrentIncomeMan(e.target.value)}
          >
            <option value="">年収（万円）</option>
            {INCOME_OPTIONS.map((v) => (
              <option key={v}>{v}</option>
            ))}
          </select>

          <select className="w-full border p-2" value={jobKey} onChange={(e) => setJobKey(e.target.value as JobKey)}>
            {JOB_GROUPS.map((g) => (
              <optgroup key={g.group} label={g.group}>
                {g.options.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>

          <select className="w-full border p-2" value={industryKey} onChange={(e) => setIndustryKey(e.target.value as IndustryKey)}>
            {INDUSTRY_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>

          <select className="w-full border p-2" value={tenureKey} onChange={(e) => setTenureKey(e.target.value as TenureKey)}>
            {TENURE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>

          <button onClick={submit} className="w-full rounded-lg bg-black py-3 text-white">
            {loading ? "診断中..." : "診断する"}
          </button>
        </div>

        {/* 結果 */}
        {result && (
          <div className="rounded-xl border p-6 space-y-3">
            <p className="font-bold">
              想定レンジ：{result?.incomeRangeMan?.min}〜{result?.incomeRangeMan?.max}万円
            </p>
            <p className="text-sm">
              入力：{labelJob(jobKey)} / {labelIndustry(industryKey)} / {labelTenure(tenureKey)}
            </p>
            <p className="text-sm">{result?.reasoning}</p>

            <a
              href="https://timerex.net/s/info_2b5b_c8f1/468b156b"
              target="_blank"
              className="inline-block w-full rounded-lg border py-3 text-center font-bold"
            >
              無料で相談する（面談予約）
            </a>
          </div>
        )}

        <footer className="pt-8 text-center text-xs text-zinc-500">
          © {new Date().getFullYear()} UP-STREAM
        </footer>
      </div>
    </main>
  );
}
