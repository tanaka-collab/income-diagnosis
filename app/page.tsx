
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
  | "OTHER";

type IndustryKey =
  | "HR"
  | "IT"
  | "RETAIL"
  | "LOGISTICS"
  | "FINANCE"
  | "MANUFACTURING"
  | "SERVICE"
  | "OTHER";

type TenureKey = "LT_6M" | "M6_TO_1Y" | "Y1_TO_3Y" | "Y3_TO_5Y" | "GE_5Y";

const TIMEREX_URL = "https://timerex.net/s/info_2b5b_c8f1/468b156b";

// ✅ UI
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
  { group: "製造", options: [{ label: "製造（ライン）", value: "MANUFACTURING_LINE" }] },
  { group: "その他", options: [{ label: "その他", value: "OTHER" }] },
];

const INDUSTRY_OPTIONS: { label: string; value: IndustryKey }[] = [
  { label: "IT/インターネット", value: "IT" },
  { label: "人材（紹介/派遣/HR）", value: "HR" },
  { label: "金融（銀行/証券/保険）", value: "FINANCE" },
  { label: "物流（倉庫/配送/3PL）", value: "LOGISTICS" },
  { label: "小売（店舗/EC）", value: "RETAIL" },
  { label: "メーカー/製造業", value: "MANUFACTURING" },
  { label: "サービス（宿泊/飲食/その他）", value: "SERVICE" },
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

// ✅ “毎回空白で始める”ための初期値
const DEFAULTS = {
  age: "",
  currentIncomeMan: "",
  jobKey: "SALES_FIELD" as JobKey,
  industryKey: "IT" as IndustryKey,
  tenureKey: "Y1_TO_3Y" as TenureKey,
};

export default function Home() {
  const [age, setAge] = useState(DEFAULTS.age);
  const [currentIncomeMan, setCurrentIncomeMan] = useState(DEFAULTS.currentIncomeMan);
  const [jobKey, setJobKey] = useState<JobKey>(DEFAULTS.jobKey);
  const [industryKey, setIndustryKey] = useState<IndustryKey>(DEFAULTS.industryKey);
  const [tenureKey, setTenureKey] = useState<TenureKey>(DEFAULTS.tenureKey);

  const [message, setMessage] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // ✅ ここがポイント：保存された入力が残っても、ページ表示時に必ず“初期化”
  useEffect(() => {
    // もし以前 localStorage を使ってた場合に備えて、念のため消す（キー名が違うならここ変更）
    try {
      localStorage.removeItem("income-diagnosis");
    } catch {}
    // 入力を初期値へ
    setAge(DEFAULTS.age);
    setCurrentIncomeMan(DEFAULTS.currentIncomeMan);
    setJobKey(DEFAULTS.jobKey);
    setIndustryKey(DEFAULTS.industryKey);
    setTenureKey(DEFAULTS.tenureKey);
    setResult(null);
    setMessage("");
  }, []);

  const payload = useMemo(
    () => ({
      age: age ? Number(age) : null,
      currentIncomeMan: currentIncomeMan ? Number(currentIncomeMan) : null,
      jobKey,
      industryKey,
      tenureYears: tenureKey, // route.ts側で拾う想定
      // 互換用
      job: labelJob(jobKey),
      industry: labelIndustry(industryKey),
    }),
    [age, currentIncomeMan, jobKey, industryKey, tenureKey]
  );

  const canSubmit =
    !!age && !!currentIncomeMan && Number.isFinite(Number(age)) && Number.isFinite(Number(currentIncomeMan));

  const submit = async () => {
    if (!canSubmit) {
      setMessage("年齢と現年収を入力してください（プルダウンでOK）");
      return;
    }

    setLoading(true);
    setMessage("");
    setResult(null);

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
    <main className="min-h-screen bg-gradient-to-b from-zinc-50 to-white">
      <div style={{ padding: 12, background: "yellow", color: "black" }}>
  DEPLOY CHECK 123
</div>
      <div className="mx-auto max-w-3xl px-4 py-10">
        {/* ヘッダー */}
        <div className="mb-6 rounded-2xl border bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700">
                無料・30秒
              </p>
              <h1 className="mt-3 text-2xl font-bold tracking-tight text-zinc-900">
                次の転職で狙える年収レンジ診断
              </h1>
              <p className="mt-2 text-sm text-zinc-600">
                在籍年数・職種・業界から「現実的に狙える年収レンジ」と「次に付ける職種」を提示します。
              </p>
            </div>

            <a
              href={TIMEREX_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden shrink-0 rounded-xl bg-black px-4 py-2 text-sm font-medium text-white shadow-sm hover:opacity-90 md:inline-flex"
            >
              無料面談を予約
            </a>
          </div>

          <div className="mt-4 rounded-xl bg-zinc-50 p-4 text-xs text-zinc-600">
            ※診断は目安です。最終的な年収は「実績の言語化」「職種の寄せ方」「企業選び（評価制度）」で変わります。
          </div>
        </div>

        {/* フォーム */}
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="text-base font-semibold text-zinc-900">入力（全てプルダウン）</h2>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <Field label="年齢">
              <select className="w-full rounded-xl border px-3 py-2" value={age} onChange={(e) => setAge(e.target.value)}>
                <option value="">選択してください</option>
                {AGE_OPTIONS.map((v) => (
                  <option key={v} value={v}>
                    {v}歳
                  </option>
                ))}
              </select>
            </Field>

            <Field label="現年収（万円）">
              <select
                className="w-full rounded-xl border px-3 py-2"
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
            </Field>

            <Field label="職種">
              <select
                className="w-full rounded-xl border px-3 py-2"
                value={jobKey}
                onChange={(e) => setJobKey(e.target.value as JobKey)}
              >
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
            </Field>

            <Field label="業界">
              <select
                className="w-full rounded-xl border px-3 py-2"
                value={industryKey}
                onChange={(e) => setIndustryKey(e.target.value as IndustryKey)}
              >
                {INDUSTRY_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="在籍年数">
              <select
                className="w-full rounded-xl border px-3 py-2"
                value={tenureKey}
                onChange={(e) => setTenureKey(e.target.value as TenureKey)}
              >
                {TENURE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </Field>

            <div className="flex items-end">
              <button
                onClick={submit}
                disabled={loading || !canSubmit}
                className="w-full rounded-xl bg-black px-4 py-3 text-sm font-semibold text-white shadow-sm disabled:opacity-50"
              >
                {loading ? "診断中..." : "診断する"}
              </button>
            </div>
          </div>

          {message && <p className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{message}</p>}
        </div>

        {/* 結果 */}
        {result && (
          <div className="mt-6 rounded-2xl border bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-base font-semibold text-zinc-900">診断結果</h2>
              <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700">
                入力：{labelJob(jobKey)} / {labelIndustry(industryKey)} / {labelTenure(tenureKey)}
              </span>
            </div>

            {result.incomeRangeMan && (
              <div className="mt-4 rounded-2xl border bg-zinc-50 p-5">
                <p className="text-sm text-zinc-600">想定レンジ</p>
                <p className="mt-1 text-2xl font-bold text-zinc-900">
                  {result.incomeRangeMan.min}〜{result.incomeRangeMan.max}万円
                </p>
              </div>
            )}

            {result.reasoning && <p className="mt-4 text-sm leading-6 text-zinc-700">{result.reasoning}</p>}

            {Array.isArray(result.recommendedRoles) && result.recommendedRoles.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-semibold text-zinc-900">次に付ける候補</p>
                <ul className="mt-2 grid gap-2 md:grid-cols-2">
                  {result.recommendedRoles.map((r: string) => (
                    <li key={r} className="rounded-xl border bg-white px-4 py-3 text-sm text-zinc-800">
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-6 rounded-2xl border bg-white p-5">
              <p className="text-sm font-semibold text-zinc-900">次の一手（面談で具体化できます）</p>
              <p className="mt-2 text-sm text-zinc-700">
                「短期離職に見えない見せ方」「職種の寄せ方」「狙うべき企業タイプ」まで、あなたの入力に合わせて具体化します。
              </p>
              <a
                href={TIMEREX_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-black px-4 py-3 text-sm font-semibold text-white shadow-sm hover:opacity-90"
              >
                無料面談を予約する
              </a>
              <p className="mt-2 text-center text-xs text-zinc-500">所要30分・オンライン</p>
            </div>
          </div>
        )}

        <footer className="mt-10 text-center text-xs text-zinc-500">
          © UP-STREAM / Income Diagnosis
        </footer>
      </div>
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-zinc-700">{label}</span>
      {children}
    </label>
  );
}
