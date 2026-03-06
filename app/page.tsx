"use client";

import { useMemo, useState } from "react";

/**
 * =========================
 * 選択肢（大分類 → 小分類）
 * =========================
 */
const JOB_CATEGORIES = [
  {
    category: "営業",
    options: [
      { label: "法人営業（新規）", value: "SALES_NEW" },
      { label: "法人営業（ルート）", value: "SALES_ROUTE" },
      { label: "インサイドセールス", value: "SALES_INSIDE" },
      { label: "個人営業/フィールド", value: "SALES_FIELD" },
    ],
  },
  {
    category: "IT",
    options: [
      { label: "ヘルプデスク", value: "TECH_HELPDESK" },
      { label: "エンジニア/開発", value: "TECH_DEV" },
      { label: "インフラ/運用", value: "TECH_INFRA" },
    ],
  },
  {
    category: "バックオフィス / 企画",
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
    category: "販売・サービス",
    options: [
      { label: "小売（販売/接客）", value: "SERVICE_RETAIL" },
      { label: "飲食（接客/ホール等）", value: "SERVICE_FOOD" },
    ],
  },
  {
    category: "事務",
    options: [
      { label: "一般事務", value: "OFFICE_GENERAL" },
      { label: "営業事務", value: "OFFICE_SALES_ASSIST" },
    ],
  },
  {
    category: "製造",
    options: [{ label: "製造（ライン）", value: "MANUFACTURING_LINE" }],
  },
  {
    category: "医療・介護",
    options: [
      { label: "医師", value: "PROF_MED_DOCTOR" },
      { label: "看護師", value: "PROF_MED_NURSE" },
      { label: "介護職", value: "PROF_MED_CARE" },
    ],
  },
  {
    category: "士業",
    options: [
      { label: "弁護士", value: "PROF_LAWYER" },
      { label: "税理士", value: "PROF_TAX" },
      { label: "公認会計士", value: "PROF_ACCOUNTING" },
    ],
  },
  {
    category: "クリエイティブ",
    options: [
      { label: "デザイナー", value: "DESIGNER" },
      { label: "クリエイティブ（制作）", value: "CREATIVE" },
    ],
  },
  {
    category: "その他",
    options: [{ label: "その他", value: "OTHER" }],
  },
] as const;

const INDUSTRY_CATEGORIES = [
  {
    category: "IT/インターネット",
    options: [
      { label: "SaaS（BtoB）", value: "IT_SAAS_B2B" },
      { label: "Webサービス（BtoC）", value: "IT_WEB_B2C" },
      { label: "SES", value: "IT_SES" },
      { label: "SIer", value: "IT_SI" },
      { label: "受託開発", value: "IT_CONTRACT_DEV" },
      { label: "AI/データ", value: "IT_AI_DATA" },
      { label: "セキュリティ", value: "IT_SECURITY" },
      { label: "ゲーム", value: "IT_GAME" },
      { label: "ハードウェア/IoT", value: "IT_HARDWARE" },
    ],
  },
  {
    category: "人材",
    options: [
      { label: "人材紹介", value: "HR_AGENCY" },
      { label: "求人広告/求人メディア", value: "HR_MEDIA" },
      { label: "人材派遣", value: "HR_TEMP_STAFFING" },
      { label: "BPO/採用代行（RPO）", value: "HR_RPO_BPO" },
      { label: "人事SaaS/HR Tech", value: "HR_SAAS" },
      { label: "研修/組織開発", value: "HR_TRAINING_OD" },
    ],
  },
  {
    category: "不動産",
    options: [
      { label: "賃貸仲介（住居）", value: "RE_RENTAL_HOUSING" },
      { label: "賃貸仲介（オフィス/事業用）", value: "RE_RENTAL_COMMERCIAL" },
      { label: "売買仲介（実需）", value: "RE_SALES_ENDUSER" },
      { label: "売買仲介（投資用）", value: "RE_SALES_INVESTMENT" },
      { label: "投資用不動産販売", value: "RE_INVESTMENT_SALES" },
      { label: "不動産開発/デベロッパー", value: "RE_DEVELOPER" },
      { label: "不動産管理（PM/BM）", value: "RE_PROPERTY_MANAGEMENT" },
      { label: "不動産仕入れ", value: "RE_ACQUISITION" },
      { label: "不動産買取再販", value: "RE_RESALE" },
    ],
  },
  {
    category: "建設・住宅",
    options: [
      { label: "ゼネコン", value: "CON_GENERAL_CONTRACTOR" },
      { label: "サブコン", value: "CON_SUBCONTRACTOR" },
      { label: "ハウスメーカー", value: "CON_HOUSE_MAKER" },
      { label: "工務店", value: "CON_LOCAL_BUILDER" },
      { label: "住宅設備/住宅資材", value: "CON_HOUSING_MATERIALS" },
      { label: "内装/リフォーム", value: "CON_REFORM_INTERIOR" },
      { label: "建築設計/設計事務所", value: "CON_ARCHITECTURE_DESIGN" },
    ],
  },
  {
    category: "物流",
    options: [
      { label: "3PL", value: "LOGI_3PL" },
      { label: "ラストマイル", value: "LOGI_LASTMILE" },
      { label: "倉庫/センター運営", value: "LOGI_WAREHOUSE" },
      { label: "フォワーダー/国際物流", value: "LOGI_FORWARDER" },
      { label: "海運", value: "LOGI_SHIPPING" },
      { label: "航空貨物", value: "LOGI_AIR_CARGO" },
      { label: "陸運/運送会社", value: "LOGI_TRUCKING" },
    ],
  },
  {
    category: "小売・EC",
    options: [
      { label: "総合小売/量販店", value: "RETAIL_CHAIN" },
      { label: "アパレル", value: "RETAIL_APPAREL" },
      { label: "ラグジュアリー/百貨店", value: "RETAIL_LUXURY" },
      { label: "ドラッグストア", value: "RETAIL_DRUG" },
      { label: "食品スーパー", value: "RETAIL_SUPERMARKET" },
      { label: "コンビニ", value: "RETAIL_CONVENIENCE" },
      { label: "家具/インテリア", value: "RETAIL_FURNITURE" },
      { label: "EC/D2C", value: "RETAIL_EC" },
    ],
  },
  {
    category: "金融",
    options: [
      { label: "銀行", value: "FIN_BANK" },
      { label: "証券", value: "FIN_SECURITIES" },
      { label: "生命保険", value: "FIN_LIFE_INSURANCE" },
      { label: "損害保険", value: "FIN_NONLIFE_INSURANCE" },
      { label: "保険代理店", value: "FIN_INSURANCE_AGENCY" },
      { label: "クレジットカード", value: "FIN_CARD" },
      { label: "リース", value: "FIN_LEASE" },
      { label: "消費者金融/信販", value: "FIN_CREDIT" },
      { label: "Fintech", value: "FIN_FINTECH" },
      { label: "VC/PE/投資", value: "FIN_INVESTMENT" },
    ],
  },
  {
    category: "メーカー",
    options: [
      { label: "自動車", value: "MANU_AUTOMOTIVE" },
      { label: "電機/電子/精密", value: "MANU_ELECTRONICS" },
      { label: "機械/産業機器", value: "MANU_MACHINERY" },
      { label: "半導体", value: "MANU_SEMICONDUCTOR" },
      { label: "化学", value: "MANU_CHEMICAL" },
      { label: "食品/飲料", value: "MANU_FOOD" },
      { label: "医薬品/医療機器", value: "MANU_PHARMA_MEDICAL" },
      { label: "素材/金属", value: "MANU_METAL" },
      { label: "日用品/消費財", value: "MANU_FMCG" },
    ],
  },
  {
    category: "商社",
    options: [
      { label: "総合商社", value: "TRADING_GENERAL" },
      { label: "専門商社（食品）", value: "TRADING_FOOD" },
      { label: "専門商社（化学）", value: "TRADING_CHEMICAL" },
      { label: "専門商社（機械/産業材）", value: "TRADING_MACHINERY" },
      { label: "専門商社（医療）", value: "TRADING_MEDICAL" },
      { label: "専門商社（建材）", value: "TRADING_BUILDING" },
    ],
  },
  {
    category: "サービス",
    options: [
      { label: "飲食", value: "SV_RESTAURANT" },
      { label: "ホテル", value: "SV_HOTEL" },
      { label: "旅行/観光", value: "SV_TRAVEL" },
      { label: "ブライダル", value: "SV_BRIDAL" },
      { label: "教育/スクール", value: "SV_EDUCATION" },
      { label: "BPO/コールセンター", value: "SV_BPO_CS" },
      { label: "警備/清掃/施設管理", value: "SV_FACILITY" },
      { label: "美容/ウェルネス", value: "SV_BEAUTY_WELLNESS" },
    ],
  },
  {
    category: "医療・介護・福祉",
    options: [
      { label: "病院", value: "MEDICAL_HOSPITAL" },
      { label: "クリニック", value: "MEDICAL_CLINIC" },
      { label: "調剤薬局", value: "MEDICAL_PHARMACY" },
      { label: "介護施設", value: "WELFARE_CARE_FACILITY" },
      { label: "訪問介護/訪問看護", value: "WELFARE_VISITING" },
      { label: "障害福祉", value: "WELFARE_DISABILITY" },
    ],
  },
  {
    category: "公共・インフラ",
    options: [
      { label: "官公庁/自治体", value: "PUBLIC_GOV" },
      { label: "教育機関", value: "PUBLIC_EDUCATION" },
      { label: "電力/ガス", value: "INFRA_ENERGY" },
      { label: "鉄道", value: "INFRA_RAILWAY" },
      { label: "通信", value: "INFRA_TELECOM" },
      { label: "水道/公共インフラ", value: "INFRA_UTILITIES" },
    ],
  },
  {
    category: "広告・メディア",
    options: [
      { label: "総合広告代理店", value: "MEDIA_AD_AGENCY" },
      { label: "Web広告代理店", value: "MEDIA_WEB_AGENCY" },
      { label: "PR/広報支援", value: "MEDIA_PR" },
      { label: "制作会社", value: "MEDIA_PRODUCTION" },
      { label: "出版社", value: "MEDIA_PUBLISHING" },
      { label: "テレビ/映像", value: "MEDIA_TV_VIDEO" },
    ],
  },
  {
    category: "その他",
    options: [
      { label: "農業/食品一次産業", value: "OTHER_PRIMARY_INDUSTRY" },
      { label: "環境/リサイクル", value: "OTHER_ENVIRONMENT" },
      { label: "その他", value: "OTHER" },
    ],
  },
] as const;

type JobCategory = (typeof JOB_CATEGORIES)[number]["category"];
type JobKey = (typeof JOB_CATEGORIES)[number]["options"][number]["value"];
type IndustryCategory = (typeof INDUSTRY_CATEGORIES)[number]["category"];
type IndustryKey = (typeof INDUSTRY_CATEGORIES)[number]["options"][number]["value"];

type TenureKey = "LT_6M" | "M6_TO_1Y" | "Y1_TO_3Y" | "Y3_TO_5Y" | "GE_5Y";
const TENURE_OPTIONS: { label: string; value: TenureKey }[] = [
  { label: "半年未満", value: "LT_6M" },
  { label: "半年〜1年", value: "M6_TO_1Y" },
  { label: "1〜3年", value: "Y1_TO_3Y" },
  { label: "3〜5年", value: "Y3_TO_5Y" },
  { label: "5年以上", value: "GE_5Y" },
];

const AGE_OPTIONS = Array.from({ length: 43 }, (_, i) => String(18 + i)); // 18〜60
const INCOME_OPTIONS = Array.from({ length: 81 }, (_, i) => String(200 + i * 10)); // 200〜1000（10万刻み）

function labelJob(jobKey: JobKey) {
  for (const c of JOB_CATEGORIES) {
    const hit = c.options.find((o) => o.value === jobKey);
    if (hit) return hit.label;
  }
  return "その他";
}
function labelIndustry(ind: IndustryKey) {
  for (const c of INDUSTRY_CATEGORIES) {
    const hit = c.options.find((o) => o.value === ind);
    if (hit) return hit.label;
  }
  return "その他";
}
function labelTenure(t: TenureKey) {
  return TENURE_OPTIONS.find((o) => o.value === t)?.label ?? "";
}

export default function Home() {
  // ✅ 毎回「空白スタート」
  const [age, setAge] = useState("");
  const [currentIncomeMan, setCurrentIncomeMan] = useState("");

  // ✅ 大分類 → 小分類
  const [jobCategory, setJobCategory] = useState<JobCategory | "">("");
  const [jobKey, setJobKey] = useState<JobKey | "">("");

  const [industryCategory, setIndustryCategory] = useState<IndustryCategory | "">("");
  const [industryKey, setIndustryKey] = useState<IndustryKey | "">("");

  const [tenureKey, setTenureKey] = useState<TenureKey>("Y1_TO_3Y");

  const [message, setMessage] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const jobSubOptions = useMemo(() => {
    if (!jobCategory) return [];
    return JOB_CATEGORIES.find((c) => c.category === jobCategory)?.options ?? [];
  }, [jobCategory]);

  const industrySubOptions = useMemo(() => {
    if (!industryCategory) return [];
    return INDUSTRY_CATEGORIES.find((c) => c.category === industryCategory)?.options ?? [];
  }, [industryCategory]);

  const payload = useMemo(() => {
    return {
      age: Number(age || 0),
      currentIncomeMan: Number(currentIncomeMan || 0),
      jobKey: jobKey || "OTHER",
      industryKey: industryKey || "OTHER",
      tenureYears: tenureKey || "Y1_TO_3Y",
      // 互換用（残してOK）
      job: jobKey ? labelJob(jobKey as JobKey) : "",
      industry: industryKey ? labelIndustry(industryKey as IndustryKey) : "",
    };
  }, [age, currentIncomeMan, jobKey, industryKey, tenureKey]);

  const submit = async () => {
    setLoading(true);
    setMessage("");
    setResult(null);

    // バリデーション（必須）
    if (!age || !currentIncomeMan || !jobCategory || !jobKey || !industryCategory || !industryKey || !tenureKey) {
      setLoading(false);
      setMessage("すべて選択してください。");
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
        setResult(json);
        setMessage("");
      }
    } catch (e: any) {
      setMessage("通信エラー：" + (e?.message ?? "不明なエラー"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-zinc-50 to-white text-zinc-900">
      <div className="mx-auto max-w-3xl px-4 py-10 space-y-6">
        {/* ヘッダー */}
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700">
                無料・30秒
              </p>
              <h1 className="mt-3 text-2xl font-bold tracking-tight">次の転職で狙える年収レンジ診断</h1>
              <p className="mt-2 text-sm text-zinc-600">
                年齢・年収・職種・業界・在籍年数から「現実的に狙える年収レンジ」と「次に付ける職種」を提示します。
              </p>
            </div>

            <a
              href="https://timerex.net/s/info_2b5b_c8f1/468b156b"
              target="_blank"
              rel="noreferrer"
              className="shrink-0 rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white"
            >
              無料面談を予約
            </a>
          </div>

          <div className="mt-4 rounded-xl bg-zinc-50 p-4 text-xs text-zinc-600">
            ※診断は目安です。最終的な年収は「実績の言語化」「職種の寄せ方」「企業選び（評価制度）」で変わります。
          </div>
        </div>

        {/* 入力 */}
        <div className="rounded-2xl border bg-white p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-zinc-800">入力（全てプルダウン）</h2>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium">年齢</label>
              <select className="mt-1 w-full rounded-xl border px-3 py-2" value={age} onChange={(e) => setAge(e.target.value)}>
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
                className="mt-1 w-full rounded-xl border px-3 py-2"
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

          {/* 職種：大分類 → 小分類 */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium">職種（大分類）</label>
              <select
                className="mt-1 w-full rounded-xl border px-3 py-2"
                value={jobCategory}
                onChange={(e) => {
                  const v = e.target.value as JobCategory | "";
                  setJobCategory(v);
                  setJobKey(""); // 大分類変更時は小分類リセット
                }}
              >
                <option value="">選択してください</option>
                {JOB_CATEGORIES.map((c) => (
                  <option key={c.category} value={c.category}>
                    {c.category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">職種（小分類）</label>
              <select
                className="mt-1 w-full rounded-xl border px-3 py-2"
                value={jobKey}
                onChange={(e) => setJobKey(e.target.value as JobKey | "")}
                disabled={!jobCategory}
              >
                <option value="">{jobCategory ? "選択してください" : "先に大分類を選択"}</option>
                {jobSubOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 業界：大分類 → 小分類 */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium">業界（大分類）</label>
              <select
                className="mt-1 w-full rounded-xl border px-3 py-2"
                value={industryCategory}
                onChange={(e) => {
                  const v = e.target.value as IndustryCategory | "";
                  setIndustryCategory(v);
                  setIndustryKey(""); // リセット
                }}
              >
                <option value="">選択してください</option>
                {INDUSTRY_CATEGORIES.map((c) => (
                  <option key={c.category} value={c.category}>
                    {c.category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">業界（小分類）</label>
              <select
                className="mt-1 w-full rounded-xl border px-3 py-2"
                value={industryKey}
                onChange={(e) => setIndustryKey(e.target.value as IndustryKey | "")}
                disabled={!industryCategory}
              >
                <option value="">{industryCategory ? "選択してください" : "先に大分類を選択"}</option>
                {industrySubOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 在籍年数 */}
          <div>
            <label className="text-sm font-medium">在籍年数</label>
            <select
              className="mt-1 w-full rounded-xl border px-3 py-2"
              value={tenureKey}
              onChange={(e) => setTenureKey(e.target.value as TenureKey | "")}
            >
              <option value="">選択してください</option>
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
            className="w-full rounded-xl bg-black px-4 py-3 text-white disabled:opacity-60"
          >
            {loading ? "診断中..." : "診断する"}
          </button>

          {message && <p className="text-sm text-red-600">{message}</p>}
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
              入力：{jobKey ? labelJob(jobKey as JobKey) : ""} / {industryKey ? labelIndustry(industryKey as IndustryKey) : ""} /{" "}
              {tenureKey ? labelTenure(tenureKey as TenureKey) : ""}
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
              className="mt-2 inline-flex w-full items-center justify-center rounded-xl border bg-white px-4 py-3 text-sm font-semibold"
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