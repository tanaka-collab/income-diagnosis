"use client";

import { useEffect, useMemo, useState } from "react";

// ✅ route.ts（細分類版）に合わせる
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
  | "OFFICE_GENERAL"
  | "OFFICE_SALES_ASSIST"
  | "MANUFACTURING_LINE"
  | "PROF_MED_DOCTOR"
  | "PROF_MED_NURSE"
  | "PROF_MED_CARE"
  | "PROF_LAWYER"
  | "PROF_TAX"
  | "PROF_ACCOUNTING"
  | "HR_RECRUITER"
  | "HR_GENERALIST"
  | "MARKETER"
  | "ACCOUNTING"
  | "FINANCE"
  | "PRODUCT_MANAGER"
  | "DESIGNER"
  | "CREATIVE"
  | "MANAGEMENT"
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

// ✅ 大分類キー
type JobGroupKey =
  | "SALES"
  | "IT"
  | "BACKOFFICE"
  | "SERVICE"
  | "OFFICE"
  | "MANUFACTURING"
  | "MEDICAL"
  | "PROFESSIONAL"
  | "CREATIVE"
  | "OTHER";

const AGE_OPTIONS = Array.from({ length: 43 }, (_, i) => String(18 + i)); // 18〜60
const INCOME_OPTIONS = Array.from({ length: 81 }, (_, i) => String(200 + i * 10)); // 200〜1000（10万刻み）

// ✅ 大分類→小分類（2段プルダウン用）
const JOB_GROUPS_2STEP: {
  groupKey: JobGroupKey;
  groupLabel: string;
  options: { label: string; value: JobKey }[];
}[] = [
  {
    groupKey: "SALES",
    groupLabel: "営業",
    options: [
      { label: "法人営業（新規）", value: "SALES_NEW" },
      { label: "法人営業（ルート）", value: "SALES_ROUTE" },
      { label: "インサイドセールス", value: "SALES_INSIDE" },
      { label: "個人営業/フィールド", value: "SALES_FIELD" },
    ],
  },
  {
    groupKey: "IT",
    groupLabel: "IT",
    options: [
      { label: "ヘルプデスク", value: "TECH_HELPDESK" },
      { label: "エンジニア/開発", value: "TECH_DEV" },
      { label: "インフラ/運用", value: "TECH_INFRA" },
    ],
  },
  {
    groupKey: "BACKOFFICE",
    groupLabel: "バックオフィス / 企画",
    options: [
      { label: "採用（人事）", value: "HR_RECRUITER" },
      { label: "人事（制度/労務など）", value: "HR_GENERALIST" },
      { label: "マーケター", value: "MARKETER" },
      { label: "経理", value: "ACCOUNTING" },
      { label: "財務/金融", value: "FINANCE" },
      { label: "PM/PdM", value: "PRODUCT_MANAGER" },
      { label: "経営/マネジメント", value: "MANAGEMENT" },
    ],
  },
  {
    groupKey: "SERVICE",
    groupLabel: "販売・サービス",
    options: [
      { label: "小売（販売/接客）", value: "SERVICE_RETAIL" },
      { label: "飲食（接客/ホール等）", value: "SERVICE_FOOD" },
    ],
  },
  {
    groupKey: "OFFICE",
    groupLabel: "事務",
    options: [
      { label: "一般事務", value: "OFFICE_GENERAL" },
      { label: "営業事務", value: "OFFICE_SALES_ASSIST" },
    ],
  },
  {
    groupKey: "MANUFACTURING",
    groupLabel: "製造",
    options: [{ label: "製造（ライン）", value: "MANUFACTURING_LINE" }],
  },
  {
    groupKey: "MEDICAL",
    groupLabel: "医療・介護",
    options: [
      { label: "医師", value: "PROF_MED_DOCTOR" },
      { label: "看護師", value: "PROF_MED_NURSE" },
      { label: "介護職", value: "PROF_MED_CARE" },
    ],
  },
  {
    groupKey: "PROFESSIONAL",
    groupLabel: "士業",
    options: [
      { label: "弁護士", value: "PROF_LAWYER" },
      { label: "税理士", value: "PROF_TAX" },
      { label: "公認会計士", value: "PROF_ACCOUNTING" },
    ],
  },
  {
    groupKey: "CREATIVE",
    groupLabel: "クリエイティブ",
    options: [
      { label: "デザイナー", value: "DESIGNER" },
      { label: "クリエイティブ（制作）", value: "CREATIVE" },
    ],
  },
  {
    groupKey: "OTHER",
    groupLabel: "その他",
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
  { label: "ラグジュアリー/百貨店", value: "RETAIL_LUXURY" },
  { label: "銀行", value: "FIN_BANK" },
  { label: "保険", value: "FIN_INSURANCE" },
  { label: "証券", value: "FIN_SECURITIES" },
  { label: "メーカー工場", value: "MANUFACTURING_FACTORY" },
  { label: "メーカー（電機/精密）", value: "MANUFACTURING_ELECTRONICS" },
  { label: "飲食サービス", value: "SERVICE_FOOD" },
  { label: "ホテル/観光", value: "SERVICE_HOTEL" },
  { label: "医療（病院）", value: "MEDICAL_HOSPITAL" },
  { label: "医療（クリニック）", value: "MEDICAL_CLINIC" },
  { label: "官公庁/自治体", value: "PUBLIC_GOV" },
  { label: "教育（学校）", value: "EDU_SCHOOL" },
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

function labelIndustry(ind: IndustryKey) {
  return INDUSTRY_OPTIONS.find((o) => o.value === ind)?.label ?? "その他";
}
function labelTenure(t: TenureKey) {
  return TENURE_OPTIONS.find((o) => o.value === t)?.label ?? "";
}
function labelJob(jobKey: JobKey) {
  for (const g of JOB_GROUPS_2STEP) {
    const hit = g.options.find((o) => o.value === jobKey);
    if (hit) return hit.label;
  }
  return "その他";
}

export default function Home() {
  // ✅ “毎回空白で始める” の初期値
  const [age, setAge] = useState("");
  const [currentIncomeMan, setCurrentIncomeMan] = useState("");

  // ✅ 大分類→小分類（2段）
  const [jobGroupKey, setJobGroupKey] = useState<JobGroupKey>("SALES");
  const [jobKey, setJobKey] = useState<JobKey>("SALES_FIELD");

  const [industryKey, setIndustryKey] = useState<IndustryKey>("IT_SAAS_B2B");
  const [tenureKey, setTenureKey] = useState<TenureKey>("Y1_TO_3Y]
");

  const [message, setMessage] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // ✅ ページ表示時に「保存された入力」を消して初期化（必要ならキー変更）
  useEffect(() => {
    try {
      localStorage.removeItem("income-diagnosis");
    } catch {}
    setAge("");
    setCurrentIncomeMan("");
    setMessage("");
    setResult(null);
  }, []);

  // ✅ 大分類が変わったら、小分類をその大分類の先頭に合わせる
  useEffect(() => {
    const group = JOB_GROUPS_2STEP.find((g) => g.groupKey === jobGroupKey);
    if (!group) return;
    // もし今の jobKey がそのグループに無いなら先頭へ
    const exists = group.options.some((o) => o.value === jobKey);
    if (!exists) setJobKey(group.options[0].value);
  }, [jobGroupKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const jobOptionsForGroup = useMemo(() => {
    return JOB_GROUPS_2STEP.find((g) => g.groupKey === jobGroupKey)?.options ?? [];
  }, [jobGroupKey]);

  const payload = useMemo(
    () => ({
      age: Number(age || 0),
      currentIncomeMan: Number(currentIncomeMan || 0),
      jobKey,
      industryKey,
      tenureYears: tenureKey, // route.ts 側が拾えるキー
      // 互換用（残してOK）
      job: labelJob(jobKey),
      industry: labelIndustry(industryKey),
    }),
    [age, currentIncomeMan, jobKey, industryKey, tenureKey]
  );

  const submit = async () => {
    setLoading(true);
    setMessage("");
    setResult(null);

    if (!age || !currentIncomeMan) {
      setLoading(false);
      setMessage("年齢と年収を選択してください。");
      return;
    }

    try {
      const res = await fetch("/api/diagnose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok || json?.ok === false) {
        setMessage("診断エラー：" + (json?.saveError ?? json?.error ?? "不明なエラー"));
      } else {
        setMessage("");
        setResult(json);
      }
    } catch (e: any) {
      setMessage("通信エラー：" + (e?.message ?? "不明なエラー"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white text-zinc-900">
      <div className="mx-auto max-w-4xl px-4 py-12 space-y-10">
        {/* ヘッダー */}
        <div className="mx-auto max-w-3xl rounded-2xl border bg-white p-8 shadow-sm">
          <div className="inline-flex items-center gap-2 rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700">
            無料・30秒
          </div>
          <h1 className="mt-4 text-2xl font-bold tracking-tight">次の転職で狙える年収レンジ診断</h1>
          <p className="mt-2 text-sm text-zinc-600">
            在籍年数・職種・業界から「現実的に狙える年収レンジ」と「次に付ける職種」を提示します。
          </p>
          <div className="mt-5 rounded-xl bg-zinc-50 px-4 py-3 text-xs text-zinc-600">
            ※診断は目安です。最終的な年収は「実績の言語化」「職種の寄せ方」「企業選び（評価制度）」で変わります。
          </div>
        </div>

        {/* 入力 */}
        <div className="mx-auto max-w-3xl rounded-2xl border bg-white p-8 shadow-sm">
          <h2 className="text-sm font-bold mb-5">入力（全てプルダウン）</h2>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium">年齢</label>
              <select className="mt-2 w-full rounded-xl border px-4 py-3" value={age} onChange={(e) => setAge(e.target.value)}>
                <option value="">選択してください</option>
                {AGE_OPTIONS.map((v) => (
                  <option key={v} value={v}>
                    {v}歳
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">現年収（万円）</label>
              <select
                className="mt-2 w-full rounded-xl border px-4 py-3"
                value={currentIncomeMan}
                onChange={(e) => setCurrentIncomeMan(e.target.value)}
              >
                <option value="">選択してください</option>
                {INCOME_OPTIONS.map((v) => (
                  <option key={v} value={v}>
                    {v}万円
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* ✅ 職種（大分類→小分類） */}
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium">職種（大分類）</label>
              <select
                className="mt-2 w-full rounded-xl border px-4 py-3"
                value={jobGroupKey}
                onChange={(e) => setJobGroupKey(e.target.value as JobGroupKey)}
              >
                {JOB_GROUPS_2STEP.map((g) => (
                  <option key={g.groupKey} value={g.groupKey}>
                    {g.groupLabel}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">職種（小分類）</label>
              <select
                className="mt-2 w-full rounded-xl border px-4 py-3"
                value={jobKey}
                onChange={(e) => setJobKey(e.target.value as JobKey)}
              >
                {jobOptionsForGroup.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-6">
            <label className="text-sm font-medium">業界</label>
            <select className="mt-2 w-full rounded-xl border px-4 py-3" value={industryKey} onChange={(e) => setIndustryKey(e.target.value as IndustryKey)}>
              {INDUSTRY_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-6">
            <label className="text-sm font-medium">在籍年数</label>
            <select className="mt-2 w-full rounded-xl border px-4 py-3" value={tenureKey} onChange={(e) => setTenureKey(e.target.value as TenureKey)}>
              {TENURE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={submit}
            disabled={loading}
            className="mt-7 w-full rounded-2xl bg-black px-5 py-4 text-white font-semibold disabled:opacity-60"
          >
            {loading ? "診断中..." : "診断する"}
          </button>

          {message && <p className="mt-3 text-sm text-zinc-700">{message}</p>}
        </div>

        {/* 結果 */}
        {result && (
          <div className="mx-auto max-w-3xl rounded-2xl border bg-white p-8 shadow-sm space-y-4">
            <h3 className="text-lg font-bold">診断結果</h3>

            {result.incomeRangeMan && (
              <p className="text-base">
                想定レンジ：<span className="font-bold">{result.incomeRangeMan.min}</span>〜
                <span className="font-bold">{result.incomeRangeMan.max}</span> 万円
              </p>
            )}

            <p className="text-sm text-zinc-600">
              入力：{labelJob(jobKey)} / {labelIndustry(industryKey)} / {labelTenure(tenureKey)}
            </p>

            {result.reasoning && <p className="text-sm">{result.reasoning}</p>}

            {Array.isArray(result.recommendedRoles) && result.recommendedRoles.length > 0 && (
              <div>
                <p className="text-sm font-bold">次に付ける（おすすめ）</p>
                <ul className="mt-2 list-disc pl-6 text-sm">
                  {result.recommendedRoles.map((r: string) => (
                    <li key={r}>{r}</li>
                  ))}
                </ul>
              </div>
            )}

            <a
              href="https://timerex.net/s/info_2b5b_c8f1/468b156b"
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-flex w-full items-center justify-center rounded-2xl border bg-white px-5 py-4 text-sm font-semibold"
            >
              無料で相談する（面談予約）
            </a>
          </div>
        )}

        {/* フッター */}
        <footer className="py-8 text-center text-xs text-zinc-400">© UP-STREAM / Income Diagnosis</footer>
      </div>
    </main>
  );
}
