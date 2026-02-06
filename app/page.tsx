"use client";

import { useMemo, useState } from "react";

// ==============================
// JobKey（API route.ts と合わせる）
// ==============================
type JobKey =
  // SALES
  | "SALES_NEW"
  | "SALES_ROUTE"
  | "SALES_INSIDE"
  | "SALES_FIELD"
  // TECH
  | "TECH_HELPDESK"
  | "TECH_DEV"
  | "TECH_INFRA"
  // SERVICE
  | "SERVICE_RETAIL"
  | "SERVICE_FOOD"
  // OFFICE
  | "OFFICE_GENERAL"
  | "OFFICE_SALES_ASSIST"
  // MANUFACTURING
  | "MANUFACTURING_LINE"
  // MEDICAL
  | "MED_DOCTOR"
  | "MED_NURSE_RN"
  | "MED_ASSISTANT"
  | "MED_PHARMACIST"
  | "MED_PT"
  | "MED_OT"
  | "MED_RAD"
  | "MED_CLINICAL_TECH"
  // CARE
  | "CARE_WORKER"
  | "CARE_MANAGER"
  // PROFESSIONAL
  | "PRO_LAWYER"
  | "PRO_PARALEGAL"
  | "PRO_TAX_ACCOUNTANT"
  | "PRO_CPA"
  | "PRO_SOCIAL_INSURANCE"
  | "PRO_JUDICIAL_SCRIVENER"
  | "PRO_ADMIN_SCRIVENER"
  // ===== 追加：ビジネス系 =====
  | "BIZ_BIZDEV"
  | "BIZ_CORP_PLANNING"
  | "BIZ_PROJECT_MGR"
  | "BIZ_PROD_MGR"
  | "BIZ_STORE_MGR"
  // ===== 追加：人事 =====
  | "HR_RECRUITER"
  | "HR_LABOR"
  | "HR_HRBP"
  | "HR_OD"
  // ===== 追加：マーケ =====
  | "MKT_PERFORMANCE"
  | "MKT_CRM"
  | "MKT_CONTENT_PR"
  | "MKT_BRAND"
  // ===== 追加：経理/財務 =====
  | "FIN_ACCOUNTING_JUNIOR"
  | "FIN_ACCOUNTING_SENIOR"
  | "FIN_FPNA"
  | "FIN_TREASURY"
  // ===== 追加：クリエイティブ =====
  | "CREATIVE_WEB_DESIGN"
  | "CREATIVE_UIUX"
  | "CREATIVE_VIDEO"
  | "CREATIVE_WRITER"
  | "CREATIVE_DIRECTOR"
  // ===== 追加：法務（士業ではない法務職） =====
  | "LEGAL_INHOUSE"
  | "LEGAL_COMPLIANCE"
  // OTHER
  | "OTHER";

// ==============================
// IndustryKey（細分）
// route.ts と合わせる
// ==============================
type IndustryKey =
  | "IT_SAAS_B2B"
  | "IT_WEB_B2C"
  | "IT_SES"
  | "IT_SI"
  | "IT_GAME"
  | "IT_SECURITY"
  | "IT_AI_DATA"
  | "IT_HARDWARE"
  | "HR_AGENCY"
  | "HR_MEDIA"
  | "HR_SAAS"
  | "HR_OUTSOURCING"
  | "FIN_BANK"
  | "FIN_SECURITIES"
  | "FIN_INSURANCE"
  | "FIN_LEASE"
  | "FIN_CREDIT"
  | "FIN_FINTECH"
  | "LOGI_3PL"
  | "LOGI_LASTMILE"
  | "LOGI_WAREHOUSE"
  | "LOGI_FORWARDER"
  | "RETAIL_CHAIN"
  | "RETAIL_EC"
  | "RETAIL_LUXURY"
  | "RETAIL_DRUG"
  | "MANU_AUTOMOTIVE"
  | "MANU_ELECTRONICS"
  | "MANU_FOOD"
  | "MANU_CHEMICAL"
  | "MANU_METAL"
  | "SV_HOTEL"
  | "SV_RESTAURANT"
  | "SV_EDUCATION"
  | "SV_MEDICAL_WELFARE"
  | "SV_TRAVEL"
  | "SV_BPO_CS"
  | "RE_CONSTRUCTION"
  | "RE_REAL_ESTATE"
  | "PUBLIC"
  | "MEDIA_AD"
  | "ENERGY"
  | "OTHER";

type TenureKey = "LT_6M" | "M6_TO_1Y" | "Y1_TO_3Y" | "Y3_TO_5Y" | "GE_5Y";

// ==============================
// options
// ==============================
const AGE_OPTIONS = Array.from({ length: 43 }, (_, i) => String(18 + i)); // 18〜60
const INCOME_OPTIONS = Array.from({ length: 81 }, (_, i) => String(200 + i * 10)); // 200〜1000（10万刻み）

type JobCluster =
  | "SALES"
  | "BIZ"
  | "HR"
  | "MARKETING"
  | "FINANCE"
  | "LEGAL"
  | "TECH"
  | "CREATIVE"
  | "MEDICAL"
  | "CARE"
  | "OFFICE"
  | "MANUFACTURING"
  | "SERVICE"
  | "PROFESSIONAL"
  | "OTHER";

const JOB_CLUSTER_OPTIONS: { label: string; value: JobCluster }[] = [
  { label: "営業", value: "SALES" },
  { label: "経営・事業", value: "BIZ" },
  { label: "人事", value: "HR" },
  { label: "マーケ", value: "MARKETING" },
  { label: "経理・財務", value: "FINANCE" },
  { label: "法務・コンプラ", value: "LEGAL" },
  { label: "IT", value: "TECH" },
  { label: "クリエイティブ", value: "CREATIVE" },
  { label: "医療", value: "MEDICAL" },
  { label: "介護", value: "CARE" },
  { label: "事務", value: "OFFICE" },
  { label: "製造", value: "MANUFACTURING" },
  { label: "販売・サービス", value: "SERVICE" },
  { label: "士業（資格職）", value: "PROFESSIONAL" },
  { label: "その他", value: "OTHER" },
];

const JOB_BY_CLUSTER: Record<JobCluster, { label: string; value: JobKey }[]> = {
  SALES: [
    { label: "法人営業（新規）", value: "SALES_NEW" },
    { label: "法人営業（ルート）", value: "SALES_ROUTE" },
    { label: "インサイドセールス", value: "SALES_INSIDE" },
    { label: "個人営業/フィールド", value: "SALES_FIELD" },
  ],
  BIZ: [
    { label: "事業開発（BizDev）", value: "BIZ_BIZDEV" },
    { label: "経営企画/事業企画", value: "BIZ_CORP_PLANNING" },
    { label: "プロジェクトマネージャー（PM）", value: "BIZ_PROJECT_MGR" },
    { label: "プロダクトマネージャー（PdM）", value: "BIZ_PROD_MGR" },
    { label: "店長/エリアマネージャー", value: "BIZ_STORE_MGR" },
  ],
  HR: [
    { label: "採用（リクルーター/RPO含む）", value: "HR_RECRUITER" },
    { label: "労務", value: "HR_LABOR" },
    { label: "HRBP/人事企画寄り", value: "HR_HRBP" },
    { label: "組織開発（OD）", value: "HR_OD" },
  ],
  MARKETING: [
    { label: "広告運用/Performance", value: "MKT_PERFORMANCE" },
    { label: "CRM", value: "MKT_CRM" },
    { label: "コンテンツ/PR", value: "MKT_CONTENT_PR" },
    { label: "ブランド", value: "MKT_BRAND" },
  ],
  FINANCE: [
    { label: "経理（日次/月次）", value: "FIN_ACCOUNTING_JUNIOR" },
    { label: "経理（年次/決算）", value: "FIN_ACCOUNTING_SENIOR" },
    { label: "管理会計/FP&A", value: "FIN_FPNA" },
    { label: "財務（資金繰り等）", value: "FIN_TREASURY" },
  ],
  LEGAL: [
    { label: "法務（インハウス）", value: "LEGAL_INHOUSE" },
    { label: "コンプライアンス", value: "LEGAL_COMPLIANCE" },
  ],
  TECH: [
    { label: "ヘルプデスク", value: "TECH_HELPDESK" },
    { label: "エンジニア/開発", value: "TECH_DEV" },
    { label: "インフラ/運用", value: "TECH_INFRA" },
  ],
  CREATIVE: [
    { label: "Webデザイナー", value: "CREATIVE_WEB_DESIGN" },
    { label: "UI/UXデザイナー", value: "CREATIVE_UIUX" },
    { label: "動画編集", value: "CREATIVE_VIDEO" },
    { label: "ライター", value: "CREATIVE_WRITER" },
    { label: "ディレクター", value: "CREATIVE_DIRECTOR" },
  ],
  MEDICAL: [
    { label: "医師", value: "MED_DOCTOR" },
    { label: "看護師（正看）", value: "MED_NURSE_RN" },
    { label: "看護助手/医療助手", value: "MED_ASSISTANT" },
    { label: "薬剤師", value: "MED_PHARMACIST" },
    { label: "理学療法士（PT）", value: "MED_PT" },
    { label: "作業療法士（OT）", value: "MED_OT" },
    { label: "診療放射線技師", value: "MED_RAD" },
    { label: "臨床工学技士", value: "MED_CLINICAL_TECH" },
  ],
  CARE: [
    { label: "介護職", value: "CARE_WORKER" },
    { label: "ケアマネ（介護支援専門員）", value: "CARE_MANAGER" },
  ],
  OFFICE: [
    { label: "一般事務", value: "OFFICE_GENERAL" },
    { label: "営業事務", value: "OFFICE_SALES_ASSIST" },
  ],
  MANUFACTURING: [{ label: "製造（ライン）", value: "MANUFACTURING_LINE" }],
  SERVICE: [
    { label: "小売（販売/接客）", value: "SERVICE_RETAIL" },
    { label: "飲食（接客/ホール等）", value: "SERVICE_FOOD" },
  ],
  PROFESSIONAL: [
    { label: "弁護士", value: "PRO_LAWYER" },
    { label: "パラリーガル", value: "PRO_PARALEGAL" },
    { label: "税理士", value: "PRO_TAX_ACCOUNTANT" },
    { label: "公認会計士", value: "PRO_CPA" },
    { label: "社会保険労務士", value: "PRO_SOCIAL_INSURANCE" },
    { label: "司法書士", value: "PRO_JUDICIAL_SCRIVENER" },
    { label: "行政書士", value: "PRO_ADMIN_SCRIVENER" },
  ],
  OTHER: [{ label: "その他", value: "OTHER" }],
};

const INDUSTRY_GROUPS: { group: string; options: { label: string; value: IndustryKey }[] }[] = [
  {
    group: "IT/インターネット",
    options: [
      { label: "SaaS（BtoB）", value: "IT_SAAS_B2B" },
      { label: "Webサービス（BtoC）", value: "IT_WEB_B2C" },
      { label: "SES", value: "IT_SES" },
      { label: "SI/受託開発", value: "IT_SI" },
      { label: "ゲーム", value: "IT_GAME" },
      { label: "セキュリティ", value: "IT_SECURITY" },
      { label: "AI/データ", value: "IT_AI_DATA" },
      { label: "ハード/組込み", value: "IT_HARDWARE" },
    ],
  },
  {
    group: "人材",
    options: [
      { label: "人材紹介", value: "HR_AGENCY" },
      { label: "求人メディア", value: "HR_MEDIA" },
      { label: "HR SaaS", value: "HR_SAAS" },
      { label: "BPO/アウトソーシング", value: "HR_OUTSOURCING" },
    ],
  },
  {
    group: "金融",
    options: [
      { label: "銀行", value: "FIN_BANK" },
      { label: "証券", value: "FIN_SECURITIES" },
      { label: "保険", value: "FIN_INSURANCE" },
      { label: "リース", value: "FIN_LEASE" },
      { label: "クレジット/信販", value: "FIN_CREDIT" },
      { label: "Fintech", value: "FIN_FINTECH" },
    ],
  },
  {
    group: "物流",
    options: [
      { label: "3PL", value: "LOGI_3PL" },
      { label: "ラストワンマイル", value: "LOGI_LASTMILE" },
      { label: "倉庫/センター運営", value: "LOGI_WAREHOUSE" },
      { label: "フォワーダー/国際物流", value: "LOGI_FORWARDER" },
    ],
  },
  {
    group: "小売/EC",
    options: [
      { label: "小売チェーン", value: "RETAIL_CHAIN" },
      { label: "EC/D2C", value: "RETAIL_EC" },
      { label: "ラグジュアリー", value: "RETAIL_LUXURY" },
      { label: "ドラッグストア", value: "RETAIL_DRUG" },
    ],
  },
  {
    group: "メーカー/製造",
    options: [
      { label: "自動車/部品", value: "MANU_AUTOMOTIVE" },
      { label: "電機/電子", value: "MANU_ELECTRONICS" },
      { label: "食品", value: "MANU_FOOD" },
      { label: "化学", value: "MANU_CHEMICAL" },
      { label: "金属/素材", value: "MANU_METAL" },
    ],
  },
  {
    group: "サービス",
    options: [
      { label: "ホテル/宿泊", value: "SV_HOTEL" },
      { label: "飲食", value: "SV_RESTAURANT" },
      { label: "教育", value: "SV_EDUCATION" },
      { label: "医療/福祉（法人側）", value: "SV_MEDICAL_WELFARE" },
      { label: "旅行/レジャー", value: "SV_TRAVEL" },
      { label: "CS/BPO（コール等）", value: "SV_BPO_CS" },
    ],
  },
  {
    group: "建設/不動産",
    options: [
      { label: "建設", value: "RE_CONSTRUCTION" },
      { label: "不動産", value: "RE_REAL_ESTATE" },
    ],
  },
  {
    group: "公共/その他",
    options: [
      { label: "官公庁/自治体", value: "PUBLIC" },
      { label: "広告/メディア", value: "MEDIA_AD" },
      { label: "エネルギー", value: "ENERGY" },
      { label: "その他", value: "OTHER" },
    ],
  },
];

const TENURE_OPTIONS: { label: string; value: TenureKey }[] = [
  { label: "半年未満", value: "LT_6M" },
  { label: "半年〜1年", value: "M6_TO_1Y" },
  { label: "1〜3年", value: "Y1_TO_3Y" },
  { label: "3〜5年", value: "Y3_TO_5Y" },
  { label: "5年以上", value: "GE_5Y" },
];

function labelIndustry(ind: IndustryKey) {
  for (const g of INDUSTRY_GROUPS) {
    const hit = g.options.find((o) => o.value === ind);
    if (hit) return hit.label;
  }
  return "その他";
}
function labelTenure(t: TenureKey) {
  return TENURE_OPTIONS.find((o) => o.value === t)?.label ?? "";
}

export default function Home() {
  const [age, setAge] = useState("22");
  const [currentIncomeMan, setCurrentIncomeMan] = useState("270");

  // ✅ 2段階
  const [jobCluster, setJobCluster] = useState<JobCluster>("SALES");
  const [jobKey, setJobKey] = useState<JobKey>(JOB_BY_CLUSTER["SALES"][0].value);

  const [industryKey, setIndustryKey] = useState<IndustryKey>("IT_SAAS_B2B");
  const [tenureKey, setTenureKey] = useState<TenureKey>("Y1_TO_3Y");

  const [message, setMessage] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const jobOptions = JOB_BY_CLUSTER[jobCluster] ?? JOB_BY_CLUSTER["OTHER"];

  // クラスター変更時に jobKey を先頭へ寄せる
  const onChangeCluster = (next: JobCluster) => {
    setJobCluster(next);
    const first = (JOB_BY_CLUSTER[next] ?? JOB_BY_CLUSTER["OTHER"])[0];
    setJobKey(first.value);
  };

  const payload = useMemo(
    () => ({
      age: Number(age),
      currentIncomeMan: Number(currentIncomeMan),
      jobKey,
      industryKey,
      tenureYears: tenureKey,

      // 互換用（route.ts が job/industry を見ても破綻しない）
      job: jobOptions.find((o) => o.value === jobKey)?.label ?? "その他",
      industry: labelIndustry(industryKey),
    }),
    [age, currentIncomeMan, jobKey, industryKey, tenureKey, jobOptions]
  );

  const submit = async () => {
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
        setMessage("診断しました！");
        setResult(json);
      }
    } catch (e: any) {
      setMessage("通信エラー：" + (e?.message ?? "不明なエラー"));
    } finally {
      setLoading(false);
    }
  };

  const selectedJobLabel = jobOptions.find((o) => o.value === jobKey)?.label ?? "その他";

  return (
    <main className="max-w-md mx-auto p-6 space-y-4">
      <h1 className="text-xl font-bold">年収診断</h1>

      <select className="border p-2 w-full" value={age} onChange={(e) => setAge(e.target.value)}>
        {AGE_OPTIONS.map((v) => (
          <option key={v} value={v}>
            {v}
          </option>
        ))}
      </select>

      <select className="border p-2 w-full" value={currentIncomeMan} onChange={(e) => setCurrentIncomeMan(e.target.value)}>
        {INCOME_OPTIONS.map((v) => (
          <option key={v} value={v}>
            {v}
          </option>
        ))}
      </select>

      {/* ✅ 職種クラスター */}
      <select className="border p-2 w-full" value={jobCluster} onChange={(e) => onChangeCluster(e.target.value as JobCluster)}>
        {JOB_CLUSTER_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>

      {/* ✅ 職種小分類（クラスター内のみ） */}
      <select className="border p-2 w-full" value={jobKey} onChange={(e) => setJobKey(e.target.value as JobKey)}>
        {jobOptions.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>

      {/* ✅ 業界（optgroup） */}
      <select className="border p-2 w-full" value={industryKey} onChange={(e) => setIndustryKey(e.target.value as IndustryKey)}>
        {INDUSTRY_GROUPS.map((g) => (
          <optgroup key={g.group} label={g.group}>
            {g.options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </optgroup>
        ))}
      </select>

      <select className="border p-2 w-full" value={tenureKey} onChange={(e) => setTenureKey(e.target.value as TenureKey)}>
        {TENURE_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>

      <button onClick={submit} disabled={loading} className="bg-black text-white px-4 py-2 disabled:opacity-60">
        {loading ? "診断中..." : "診断する"}
      </button>

      {message && <p>{message}</p>}

      {result && (
        <div className="border p-4 space-y-2">
          <h2 className="font-bold">診断結果</h2>

          {result.incomeRangeMan && (
            <p>
              想定レンジ：{result.incomeRangeMan.min}〜{result.incomeRangeMan.max}万円
            </p>
          )}

          <p>
            入力：{selectedJobLabel} / {labelIndustry(industryKey)} / {labelTenure(tenureKey)}
          </p>

          <p className="text-sm opacity-70">
            （type:{result.professionType ?? "-"} / DB分類:{result.jobCategory}/{result.tenureBucket} / band:{result.resultBand ?? "-"}）
          </p>

          {result.reasoning && <p>{result.reasoning}</p>}

          {Array.isArray(result.recommendedRoles) && result.recommendedRoles.length > 0 && (
            <div>
              <p className="font-bold">次に付ける</p>
              <ul className="list-disc pl-6">
                {result.recommendedRoles.map((r: string) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
              <div className="border-t pt-4 space-y-2">
  <p className="font-bold">
    この診断結果をもとに、あなた専用の転職戦略を整理できます
  </p>

  <p className="text-sm opacity-80">
    年収を上げる・短期離職に見せない・次に選ぶべき職種を
    無料で30分だけ整理します。
  </p>

  <a
    href="https://timerex.net/s/info_2b5b_c8f1/468b156b"
    target="_blank"
    rel="noreferrer"
    className="block text-center bg-black text-white px-4 py-3 rounded"
  >
    無料キャリア相談（30分）
  </a>

  <p className="text-xs opacity-60">
    ※無理な営業はしません。状況次第では「今は動かない方がいい」
    という提案も正直にお伝えします。
  </p>
</div>
            </div>
          )}
        </div>
      )}
    </main>
  );
}
