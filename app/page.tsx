"use client";

import { useMemo, useState } from "react";

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

// ※ route.ts 側が string で受けてるならここは自由に増やせる
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

const AGE_OPTIONS = Array.from({ length: 43 }, (_, i) => String(18 + i)); // 18〜60
const INCOME_OPTIONS = Array.from({ length: 81 }, (_, i) => String(200 + i * 10)); // 200〜1000（10万刻み）

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
      { label: "人事（制度/労務など）", value: "HR_GENERALIST" },
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
      { label: "飲食（接客/ホール等）", value: "SERVICE_FOOD" },
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
      { label: "クリエイティブ（制作）", value: "CREATIVE" },
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

function labelJob(jobKey: JobKey) {
  for (const g of JOB_GROUPS) {
    const hit = g.options.find((o) => o.value === jobKey);
    if (hit) return hit.label;
  }
  return "その他";
}
function labelIndustry(ind: IndustryKey) {
  return INDUSTRY_OPTIONS.find((o) => o.value === ind)?.label ?? "その他";
}
function labelTenure(t: TenureKey) {
  return TENURE_OPTIONS.find((o) => o.value === t)?.label ?? "";
}

export default function Home() {
  // ✅ 初期値は空にしてスタート（インスタ導線向け）
  const [age, setAge] = useState("");
  const [currentIncomeMan, setCurrentIncomeMan] = useState("");
  const [jobKey, setJobKey] = useState<JobKey | "">("");
  const [industryKey, setIndustryKey] = useState<IndustryKey | "">("");
  const [tenureKey, setTenureKey] = useState<TenureKey | "">("");

  const [message, setMessage] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

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

    // 最低限バリデーション
    if (!age || !currentIncomeMan || !jobKey || !industryKey || !tenureKey) {
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
        setMessage("診断しました！");
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
      <div className="mx-auto max-w-3xl px-4 py-10 space-y-6">
        {/* ヘッダー */}
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-bold tracking-tight">年収診断</h1>
          <p className="mt-2 text-sm text-zinc-600">
            年齢・年収・職種・業界・在籍年数から「次の転職で狙える現実的レンジ」を返します。
          </p>
        </div>

        {/* 入力 */}
        <div className="rounded-2xl border bg-white p-6 shadow-sm space-y-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium">年齢</label>
              <select className="mt-1 w-full rounded-lg border p-2" value={age} onChange={(e) => setAge(e.target.value)}>
                <option value="">選択してください</option>
                {AGE_OPTIONS.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">現年収（万円）</label>
              <select
                className="mt-1 w-full rounded-lg border p-2"
                value={currentIncomeMan}
                onChange={(e) => setCurrentIncomeMan(e.target.value)}
              >
                <option value="">選択してください</option>
                {INCOME_OPTIONS.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">職種</label>
            <select className="mt-1 w-full rounded-lg border p-2" value={jobKey} onChange={(e) => setJobKey(e.target.value as any)}>
              <option value="">選択してください</option>
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

          </div>

          <div>
            <label className="text-sm font-medium">業界</label>
            <select className="mt-1 w-full rounded-lg border p-2" value={industryKey} onChange={(e) => setIndustryKey(e.target.value as any)}>
              <option value="">選択してください</option>
              {INDUSTRY_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">在籍年数</label>
            <select className="mt-1 w-full rounded-lg border p-2" value={tenureKey} onChange={(e) => setTenureKey(e.target.value as any)}>
              <option value="">選択してください</option>
              {TENURE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>

          </div>

          <button onClick={submit} disabled={loading} className="w-full rounded-xl bg-black px-4 py-3 text-white disabled:opacity-60">
            {loading ? "診断中..." : "診断する"}
          </button>

          {message && <p className="text-sm">{message}</p>}
        </div>

        {/* 結果 */}
        {result && (
          <div className="rounded-2xl border bg-white p-6 shadow-sm space-y-3">
            <h2 className="text-lg font-bold">診断結果</h2>

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

            {/* 予約導線（あなたのTimerex） */}
            <a
              href="https://timerex.net/s/info_2b5b_c8f1/468b156b"
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-flex w-full items-center justify-center rounded-xl border bg-white px-4 py-3 text-sm font-semibold"
            >
              無料で相談する（面談予約）
            </a>
          </div>
        )}
      </div>
    </main>
  );
}
