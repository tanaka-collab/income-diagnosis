import { NextResponse } from "next/server";
import { supabaseService } from "@/lib/supabaseClient";

// ====== DBの大分類（既存） ======
type JobCategory =
  | "SALES"
  | "TECH"
  | "SERVICE_SALES"
  | "MANUFACTURING"
  | "OFFICE"
  | "OTHER";

// ✅ DB保存用 tenure_bucket は “3段階” に固定（DB制約対策）
type TenureBucketDB = "LT_1Y" | "Y1_TO_3Y" | "GE_3Y";

// ✅ UI用 tenure は “5段階”
type TenureKey = "LT_6M" | "M6_TO_1Y" | "Y1_TO_3Y" | "Y3_TO_5Y" | "GE_5Y";

// ====== 細分類キー（UI/ロジック用） ======
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
  // BIZ
  | "BIZ_BIZDEV"
  | "BIZ_CORP_PLANNING"
  | "BIZ_PROJECT_MGR"
  | "BIZ_PROD_MGR"
  | "BIZ_STORE_MGR"
  // HR
  | "HR_RECRUITER"
  | "HR_LABOR"
  | "HR_HRBP"
  | "HR_OD"
  // MKT
  | "MKT_PERFORMANCE"
  | "MKT_CRM"
  | "MKT_CONTENT_PR"
  | "MKT_BRAND"
  // FIN
  | "FIN_ACCOUNTING_JUNIOR"
  | "FIN_ACCOUNTING_SENIOR"
  | "FIN_FPNA"
  | "FIN_TREASURY"
  // CREATIVE
  | "CREATIVE_WEB_DESIGN"
  | "CREATIVE_UIUX"
  | "CREATIVE_VIDEO"
  | "CREATIVE_WRITER"
  | "CREATIVE_DIRECTOR"
  // LEGAL (in-house)
  | "LEGAL_INHOUSE"
  | "LEGAL_COMPLIANCE"
  // OTHER
  | "OTHER";

// ✅ 業界（細分）
type IndustryKey =
  | "IT_SAAS_B2B"
  | "IT_WEB_B2C"
  | "IT_SES"
  | "IT_SI"
  | "IT_CONTRACT_DEV"
  | "IT_AI_DATA"
  | "IT_SECURITY"
  | "IT_GAME"
  | "IT_HARDWARE"
  | "HR_AGENCY"
  | "HR_MEDIA"
  | "HR_TEMP_STAFFING"
  | "HR_RPO_BPO"
  | "HR_SAAS"
  | "HR_TRAINING_OD"
  | "RE_RENTAL_HOUSING"
  | "RE_RENTAL_COMMERCIAL"
  | "RE_SALES_ENDUSER"
  | "RE_SALES_INVESTMENT"
  | "RE_INVESTMENT_SALES"
  | "RE_DEVELOPER"
  | "RE_PROPERTY_MANAGEMENT"
  | "RE_ACQUISITION"
  | "RE_RESALE"
  | "CON_GENERAL_CONTRACTOR"
  | "CON_SUBCONTRACTOR"
  | "CON_HOUSE_MAKER"
  | "CON_LOCAL_BUILDER"
  | "CON_HOUSING_MATERIALS"
  | "CON_REFORM_INTERIOR"
  | "CON_ARCHITECTURE_DESIGN"
  | "LOGI_3PL"
  | "LOGI_LASTMILE"
  | "LOGI_WAREHOUSE"
  | "LOGI_FORWARDER"
  | "LOGI_SHIPPING"
  | "LOGI_AIR_CARGO"
  | "LOGI_TRUCKING"
  | "RETAIL_CHAIN"
  | "RETAIL_APPAREL"
  | "RETAIL_LUXURY"
  | "RETAIL_DRUG"
  | "RETAIL_SUPERMARKET"
  | "RETAIL_CONVENIENCE"
  | "RETAIL_FURNITURE"
  | "RETAIL_EC"
  | "FIN_BANK"
  | "FIN_SECURITIES"
  | "FIN_LIFE_INSURANCE"
  | "FIN_NONLIFE_INSURANCE"
  | "FIN_INSURANCE_AGENCY"
  | "FIN_CARD"
  | "FIN_LEASE"
  | "FIN_CREDIT"
  | "FIN_FINTECH"
  | "FIN_INVESTMENT"
  | "MANU_AUTOMOTIVE"
  | "MANU_ELECTRONICS"
  | "MANU_MACHINERY"
  | "MANU_SEMICONDUCTOR"
  | "MANU_CHEMICAL"
  | "MANU_FOOD"
  | "MANU_PHARMA_MEDICAL"
  | "MANU_METAL"
  | "MANU_FMCG"
  | "TRADING_GENERAL"
  | "TRADING_FOOD"
  | "TRADING_CHEMICAL"
  | "TRADING_MACHINERY"
  | "TRADING_MEDICAL"
  | "TRADING_BUILDING"
  | "SV_RESTAURANT"
  | "SV_HOTEL"
  | "SV_TRAVEL"
  | "SV_BRIDAL"
  | "SV_EDUCATION"
  | "SV_BPO_CS"
  | "SV_FACILITY"
  | "SV_BEAUTY_WELLNESS"
  | "MEDICAL_HOSPITAL"
  | "MEDICAL_CLINIC"
  | "MEDICAL_PHARMACY"
  | "WELFARE_CARE_FACILITY"
  | "WELFARE_VISITING"
  | "WELFARE_DISABILITY"
  | "PUBLIC_GOV"
  | "PUBLIC_EDUCATION"
  | "INFRA_ENERGY"
  | "INFRA_RAILWAY"
  | "INFRA_TELECOM"
  | "INFRA_UTILITIES"
  | "MEDIA_AD_AGENCY"
  | "MEDIA_WEB_AGENCY"
  | "MEDIA_PR"
  | "MEDIA_PRODUCTION"
  | "MEDIA_PUBLISHING"
  | "MEDIA_TV_VIDEO"
  | "OTHER_PRIMARY_INDUSTRY"
  | "OTHER_ENVIRONMENT"
  | "OTHER";

type SalesType = "NEW" | "INBOUND" | "ROUTE";
type SalesMarket = "B2B" | "B2C";
type TechStage = "CONSULT" | "DESIGN_DEV" | "BUILD" | "OPS" | "TEST";

type ProfessionType = "LICENSE_REQUIRED" | "SKILL_BASED";
type ResultBand = "LOW" | "MIDDLE" | "HIGH";
type TimingJudge = "NG" | "CAUTION" | "OK";

// ====== UIキー → DB保存項目へ変換 ======
function mapJob(jobKey: JobKey): {
  job_category: JobCategory;
  sales_type?: SalesType | null;
  sales_market?: SalesMarket | null;
  tech_stage?: TechStage | null;
} {
  switch (jobKey) {
    // SALES
    case "SALES_NEW":
      return { job_category: "SALES", sales_type: "NEW", sales_market: "B2B" };
    case "SALES_ROUTE":
      return { job_category: "SALES", sales_type: "ROUTE", sales_market: "B2C" };
    case "SALES_INSIDE":
      return {
        job_category: "SALES",
        sales_type: "INBOUND",
        sales_market: "B2B",
      };
    case "SALES_FIELD":
      return { job_category: "SALES", sales_type: "NEW", sales_market: "B2C" };

    // TECH
    case "TECH_HELPDESK":
      return { job_category: "TECH", tech_stage: "OPS" };
    case "TECH_DEV":
      return { job_category: "TECH", tech_stage: "BUILD" };
    case "TECH_INFRA":
      return { job_category: "TECH", tech_stage: "OPS" };

    // SERVICE
    case "SERVICE_RETAIL":
    case "SERVICE_FOOD":
      return { job_category: "SERVICE_SALES" };

    // OFFICE
    case "OFFICE_GENERAL":
    case "OFFICE_SALES_ASSIST":
      return { job_category: "OFFICE" };

    // MANUFACTURING
    case "MANUFACTURING_LINE":
      return { job_category: "MANUFACTURING" };

    default:
      return { job_category: "OTHER" };
  }
}

function getProfessionType(jobKey: JobKey): ProfessionType {
  if (
    jobKey.startsWith("MED_") ||
    jobKey.startsWith("CARE_") ||
    jobKey.startsWith("PRO_")
  )
    return "LICENSE_REQUIRED";
  return "SKILL_BASED";
}

function judgeTiming(tenureKey: TenureKey): TimingJudge {
  if (tenureKey === "LT_6M") return "NG";
  if (tenureKey === "M6_TO_1Y") return "CAUTION";
  return "OK";
}

// ====== UIの5段階 tenure を正規化 ======
function toTenureKey(raw: string): TenureKey {
  const s = String(raw ?? "").trim();

  if (
    s === "LT_6M" ||
    s === "M6_TO_1Y" ||
    s === "Y1_TO_3Y" ||
    s === "Y3_TO_5Y" ||
    s === "GE_5Y"
  )
    return s;

  // 表示文の雑対応
  if (s.includes("半年未満")) return "LT_6M";
  if (s.includes("半年") || s.includes("6")) return "M6_TO_1Y";
  if (s.includes("1〜3") || s.includes("1-3")) return "Y1_TO_3Y";
  if (s.includes("3〜5") || s.includes("3-5")) return "Y3_TO_5Y";
  if (s.includes("5")) return "GE_5Y";

  const n = Number(s.replace("年", ""));
  if (!Number.isFinite(n)) return "Y1_TO_3Y";
  if (n < 0.5) return "LT_6M";
  if (n < 1) return "M6_TO_1Y";
  if (n < 3) return "Y1_TO_3Y";
  if (n < 5) return "Y3_TO_5Y";
  return "GE_5Y";
}

// ✅ DBに保存する3段階へマッピング（制約回避）
function toTenureBucketDB(key: TenureKey): TenureBucketDB {
  if (key === "LT_6M" || key === "M6_TO_1Y") return "LT_1Y";
  if (key === "Y1_TO_3Y") return "Y1_TO_3Y";
  return "GE_3Y"; // Y3_TO_5Y / GE_5Y
}

// =========================
// 最低賃金ベース年収（暫定）
// =========================
// 年間労働時間ざっくり：8h × 20日 × 12ヶ月
const ANNUAL_HOURS = 1920;
// 全国平均の最低ライン（あとで都道府県別に拡張可）
const MIN_WAGE_JP = 1000; // 円
function minWageIncomeMan(): number {
  return Math.floor((MIN_WAGE_JP * ANNUAL_HOURS) / 10000); // 万円
}

// ✅ 業界補正（軽め）
function industryFineBumpMan(industryKey: IndustryKey): number {
  switch (industryKey) {
    case "IT_SAAS_B2B":
    case "IT_AI_DATA":
      return 15;
    case "IT_SECURITY":
      return 10;
    case "IT_SI":
    case "IT_WEB_B2C":
      return 5;
    case "IT_SES":
      return 0;

    case "FIN_BANK":
    case "FIN_SECURITIES":
    case "FIN_FINTECH":
      return 10;

    case "SV_BPO_CS":
      return -5;

    default:
      return 0;
  }
}

// ✅ 次アクション（3行）
function nextActions3Lines(args: { tenureKey: TenureKey; jobKey: JobKey }): string {
  const { tenureKey, jobKey } = args;

  if (jobKey.startsWith("SALES")) {
    return [
      `① 今月は「商材理解＋勝ちパターン」だけに集中（同席→自走）`,
      `② 目標/実績/改善のどれか1つを“数字で”残す（例：架電数→アポ率）`,
      `③ 1年経過タイミングで「BtoB新規 or 単価が高い商材」へ寄せて転職検討`,
    ].join("\n");
  }

  if (jobKey.startsWith("TECH")) {
    return [
      `① 問い合わせ対応を一人で完結できる範囲を増やす（一次→二次）`,
      `② 1つでいいので改善を作る（手順書/FAQ/自動化/設定標準化など）`,
      `③ 次は「運用→構築」へ寄せられる求人を狙う（在籍が伸びるほど有利）`,
    ].join("\n");
  }

  if (jobKey.startsWith("OFFICE") || jobKey.startsWith("FIN_")) {
    return [
      `① 日次/月次の定型業務を“ミスなく”回せる状態にする`,
      `② 業務改善を1つ作る（チェックリスト化/テンプレ化/時間短縮）`,
      `③ 次は「職能寄り（営業事務/採用/経理補助）」に寄せて年収レンジを上げる`,
    ].join("\n");
  }

  if (jobKey.startsWith("MKT_")) {
    return [
      `① 指標を1つ決めて運用（CPA/CTR/CVRなど）`,
      `② 改善を“検証→学び”まで1サイクル回す（小さくでOK）`,
      `③ 次は「SaaS/IT×マーケ」に寄せると上振れしやすい`,
    ].join("\n");
  }

  if (jobKey.startsWith("HR_")) {
    return [
      `① 担当領域を決める（採用/労務など）`,
      `② 1つ成果を作る（例：面談設定率/歩留まり改善/工数削減）`,
      `③ 次は「制度が整ってる会社」へ寄せると評価が上がりやすい`,
    ].join("\n");
  }

  return [
    `① まずは今の業務を“説明できる状態”まで整える`,
    `② 数字/改善/役割のうち1つを成果として残す`,
    `③ その成果を軸に、評価制度が強い環境へ寄せて転職検討`,
  ].join("\n");
}

function estimateSkillBased(args: {
  currentIncomeMan: number;
  tenureKey: TenureKey;
  jobKey: JobKey;
  industryKey: IndustryKey;
}): { min: number; max: number } {
  const { currentIncomeMan, tenureKey, jobKey, industryKey } = args;

  // 🟥 半年未満：最低賃金
  if (tenureKey === "LT_6M") {
    const base = minWageIncomeMan();
    return { min: base, max: base + 30 };
  }

  // 🟧 半年〜1年：最低賃金＋α（でも相場未満）
  if (tenureKey === "M6_TO_1Y") {
    const base = minWageIncomeMan() + 40; // ちょい上
    const min = Math.max(base, currentIncomeMan - 20); // “ちょい下がる”感も残す
    return { min, max: min + 50 };
  }

  // 🟩 1年以上：通常ロジック
  let base =
    jobKey.startsWith("TECH") ? 340 :
    jobKey.startsWith("SALES") ? 320 :
    jobKey.startsWith("OFFICE") ? 280 :
    jobKey.startsWith("SERVICE") ? 300 :
    jobKey.startsWith("MANUFACTURING") ? 290 : 300;

  // 職種ベース補正（追加職種の土台）
  if (jobKey.startsWith("HR_")) base = 330;
  if (jobKey.startsWith("MKT_")) base = 340;
  if (jobKey.startsWith("FIN_")) base = 340;
  if (jobKey.startsWith("LEGAL_")) base = 360;
  if (jobKey.startsWith("BIZ_")) base = 380;
  if (jobKey.startsWith("CREATIVE_")) base = 320;

  // jobKey細補正
  let jobFine = 0;
  if (jobKey === "SALES_NEW") jobFine += 20;
  if (jobKey === "SALES_INSIDE") jobFine += 10;
  if (jobKey === "TECH_DEV") jobFine += 30;
  if (jobKey === "OFFICE_GENERAL") jobFine -= 10;
  if (jobKey === "MKT_PERFORMANCE") jobFine += 15;
  if (jobKey === "FIN_ACCOUNTING_SENIOR") jobFine += 10;
  if (jobKey === "BIZ_PROD_MGR") jobFine += 20;

  // 在籍補正（あなたのルール）
  const tenureBump = tenureKey === "Y1_TO_3Y" ? 0 : tenureKey === "Y3_TO_5Y" ? 40 : tenureKey === "GE_5Y" ? 80 : 0;

  const industryFine = industryFineBumpMan(industryKey);

  const floor = Math.max(base + tenureBump + jobFine + industryFine, currentIncomeMan);
  const min = Math.floor(floor);
  const max = Math.floor(min + 80);

  return { min, max };
}

function estimateLicenseRequired(args: {
  currentIncomeMan: number;
  tenureKey: TenureKey;
  jobKey: JobKey;
}): { min: number; max: number } {
  const { currentIncomeMan, tenureKey, jobKey } = args;

  let base = 400;
  switch (jobKey) {
    case "MED_DOCTOR":
      base = 900;
      break;
    case "MED_PHARMACIST":
      base = 520;
      break;
    case "MED_NURSE_RN":
      base = 450;
      break;
    case "MED_ASSISTANT":
      base = 320;
      break;
    case "MED_PT":
    case "MED_OT":
      base = 420;
      break;
    case "MED_RAD":
    case "MED_CLINICAL_TECH":
      base = 430;
      break;

    case "CARE_WORKER":
      base = 320;
      break;
    case "CARE_MANAGER":
      base = 420;
      break;

    case "PRO_LAWYER":
      base = 750;
      break;
    case "PRO_PARALEGAL":
      base = 380;
      break;
    case "PRO_TAX_ACCOUNTANT":
      base = 600;
      break;
    case "PRO_CPA":
      base = 700;
      break;
    case "PRO_SOCIAL_INSURANCE":
      base = 520;
      break;
    case "PRO_JUDICIAL_SCRIVENER":
      base = 560;
      break;
    case "PRO_ADMIN_SCRIVENER":
      base = 480;
      break;
    default:
      base = 400;
  }

  // 在籍補正（資格職は控えめに反映）
  const bump = tenureKey === "Y3_TO_5Y" ? 40 : tenureKey === "GE_5Y" ? 80 : 0;

  const floor = Math.max(base + bump, currentIncomeMan);
  const min = Math.floor(floor);
  const width = jobKey === "MED_DOCTOR" ? 200 : 120;
  const max = Math.floor(min + width);

  return { min, max };
}

function toBand(currentIncomeMan: number, range: { min: number; max: number }): ResultBand {
  if (currentIncomeMan < range.min) return "LOW";
  if (currentIncomeMan > range.max) return "HIGH";
  return "MIDDLE";
}

function timingLabel(t: TimingJudge): string {
  if (t === "NG") return "❌ 今はおすすめしません";
  if (t === "CAUTION") return "△ 条件付きで検討可";
  return "◎ 検討しやすい";
}

function buildReasonText(args: {
  professionType: ProfessionType;
  band: ResultBand;
  tenureKey: TenureKey;
  jobKey: JobKey;
  range: { min: number; max: number };
  currentIncomeMan: number;
}): string {
  const { professionType, band, tenureKey, jobKey, range, currentIncomeMan } = args;

  const timing = judgeTiming(tenureKey);
  const actions = nextActions3Lines({ tenureKey, jobKey });
  const gapToMin = Math.max(0, range.min - currentIncomeMan);

  // ====== 短期向け：文章を分ける ======
  if (professionType === "SKILL_BASED" && tenureKey === "LT_6M") {
    return `
【転職タイミング判定：${timingLabel(timing)}】

現状は能力の問題ではなく、企業側がまだ評価に入れない時期です。
入社半年未満での転職は「定着する前に環境を変えている」と見られやすく、
人的投資（育成・昇給）を前提とした採用対象から外れがちです。

今は“転職する”より、まず「積み上げ」を作るフェーズです。
最低でも半年〜1年の在籍実績と、言語化できる要素（数字/改善/役割）を作ることで
次の転職の選択肢が一気に広がります。

---
【次アクション（3行）】
${actions}
`.trim();
  }

  if (professionType === "SKILL_BASED" && tenureKey === "M6_TO_1Y") {
    return `
【転職タイミング判定：${timingLabel(timing)}】

現状は「評価が始まりかけている」フェーズです。
ただし半年〜1年での転職は、理由と実績がセットで説明できないと
「早期離職リスクあり」と判断されやすく、条件が伸びにくくなります。

転職するなら “今の会社で作った成果” を軸に、
次の会社で何ができるかまで言語化できる状態がベストです。
そこまで準備できれば、短期離職ではなく「キャリアのステップ」として評価されやすくなります。

---
【次アクション（3行）】
${actions}
`.trim();
  }

  // ====== 資格職 ======
  if (professionType === "LICENSE_REQUIRED") {
    if (band === "HIGH") {
      return `
【転職タイミング判定：${timingLabel(timing)}】

現状の年収は想定レンジの上側です。
勤務形態（夜勤/当直/オンコール）や役割（専門領域）でさらに伸ばせます。

---
【次アクション（3行）】
${actions}
`.trim();
    }
    if (band === "MIDDLE") {
      return `
【転職タイミング判定：${timingLabel(timing)}】

現状はレンジ内です。評価が出やすい勤務形態・役割に寄せると、次のレンジへ上げやすいです。

---
【次アクション（3行）】
${actions}
`.trim();
    }
    return `
【転職タイミング判定：${timingLabel(timing)}】

相場下限までに約+${gapToMin}万円の伸びしろがあります。
役割・勤務形態・法人規模の設計で現実的に狙えます。

---
【次アクション（3行）】
${actions}
`.trim();
  }

  // ====== 通常（1年以上） ======
  if (band === "HIGH") {
    return `
【転職タイミング判定：${timingLabel(timing)}】

現状の年収は想定レンジの上側です。強みの言語化と評価制度が強い環境選びでさらに伸ばせます。

---
【次アクション（3行）】
${actions}
`.trim();
  }

  if (band === "MIDDLE") {
    if (jobKey.startsWith("SALES")) {
      return `
【転職タイミング判定：${timingLabel(timing)}】

レンジ内です。営業は“新規/商材単価/売上規模”で伸び幅が決まりやすいので、条件を寄せると年収が上がりやすいです。

---
【次アクション（3行）】
${actions}
`.trim();
    }
    if (jobKey.startsWith("TECH")) {
      return `
【転職タイミング判定：${timingLabel(timing)}】

レンジ内です。ITは“担当領域（運用→構築→開発）”で上がりやすいので、次の役割に寄せる設計が有効です。

---
【次アクション（3行）】
${actions}
`.trim();
    }
    return `
【転職タイミング判定：${timingLabel(timing)}】

レンジ内です。次のレンジに上げるには、職種の寄せ方と企業選び（評価制度/役割の明確さ）が重要です。

---
【次アクション（3行）】
${actions}
`.trim();
  }

  // LOW
  if (jobKey === "OFFICE_GENERAL") {
    return `
【転職タイミング判定：${timingLabel(timing)}】

相場下限までに約+${gapToMin}万円の伸びしろがあります。
事務はレンジ差が出にくいので、営業事務/採用/経理補助など“職能寄り”に寄せると上げやすいです。

---
【次アクション（3行）】
${actions}
`.trim();
  }

  return `
【転職タイミング判定：${timingLabel(timing)}】

相場下限までに約+${gapToMin}万円の伸びしろがあります。
役割（難易度）と企業規模（評価制度）を上げる設計で、現実的に狙えます。

---
【次アクション（3行）】
${actions}
`.trim();
}

function recommendRoles(jobKey: JobKey): string[] {
  switch (jobKey) {
    case "SALES_NEW":
      return ["法人営業（新規）", "インサイドセールス", "カスタマーサクセス"];
    case "SALES_ROUTE":
      return ["法人営業（ルート）→新規寄せ", "インサイドセールス", "営業企画（補助）"];
    case "SALES_INSIDE":
      return ["インサイドセールス", "フィールドセールス", "カスタマーサクセス"];
    case "TECH_HELPDESK":
      return ["ヘルプデスク", "IT事務", "社内SE（運用）"];
    case "TECH_INFRA":
      return ["インフラ運用", "SRE補助", "クラウド運用"];
    case "TECH_DEV":
      return ["開発（実装）", "QA/テスター→開発", "フロントエンド"];

    case "HR_RECRUITER":
      return ["採用（中途）", "RPO", "人事企画（補助）"];
    case "MKT_PERFORMANCE":
      return ["広告運用", "Webマーケ", "CRM（周辺拡張）"];
    case "FIN_ACCOUNTING_JUNIOR":
      return ["経理（日次/月次）", "営業事務→経理補助", "管理部門アシスタント"];
    case "FIN_ACCOUNTING_SENIOR":
      return ["経理（年次/決算）", "管理会計（補助）", "連結（補助）"];
    case "CREATIVE_WEB_DESIGN":
      return ["Webデザイナー", "UI/UX（補助）", "制作ディレクション"];
    case "LEGAL_INHOUSE":
      return ["法務", "契約管理", "コンプライアンス"];

    default:
      return ["カスタマーサポート", "コールセンター（受電）", "インサイドセールス"];
  }
}

export async function POST(req: Request) {
  const body = await req.json();

  const age = Number(body.age);
  const currentIncomeMan = Number(body.currentIncomeMan);

  const jobKey = String(body.jobKey ?? "OTHER") as JobKey;
  const industryKey = String(body.industryKey ?? "OTHER") as IndustryKey;

  // ✅ UIが送ってくる tenureYears（LT_6Mなど）を受ける
  const tenureKey = toTenureKey(String(body.tenureYears ?? ""));
  const tenureBucketDB = toTenureBucketDB(tenureKey);

  const prefecture = body.prefecture ? String(body.prefecture) : null;

  const mapped = mapJob(jobKey);
  const professionType = getProfessionType(jobKey);

  const range =
    professionType === "LICENSE_REQUIRED"
      ? estimateLicenseRequired({ currentIncomeMan, tenureKey, jobKey })
      : estimateSkillBased({ currentIncomeMan, tenureKey, jobKey, industryKey });

  const band = toBand(currentIncomeMan, range);
  const roles = recommendRoles(jobKey);
  const reasonText = buildReasonText({
    professionType,
    band,
    tenureKey,
    jobKey,
    range,
    currentIncomeMan,
  });

  // ✅ DB制約に合わせて “3段階” を保存する
  const { error: insertError } = await supabaseService.from("diagnoses").insert({
    age,
    current_income_man: currentIncomeMan,
    tenure_bucket: tenureBucketDB,
    job_category: mapped.job_category,

    sales_type: mapped.sales_type ?? null,
    sales_market: mapped.sales_market ?? null,
    tech_stage: mapped.tech_stage ?? null,
    prefecture,

    result_band: band,
    result_min_man: range.min,
    result_max_man: range.max,
    reason_text: reasonText,
    next_roles: roles,
  });

  return NextResponse.json({
    ok: !insertError,

    professionType,
    jobKey,
    industryKey,

    // UI用（5段階）
    tenureKey,
    // DB保存（3段階）
    tenureBucket: tenureBucketDB,

    jobCategory: mapped.job_category,
    resultBand: band,
    incomeRangeMan: range,
    recommendedRoles: roles,
    reasoning: reasonText,

    saved: !insertError,
    saveError: insertError?.message ?? null,
  });
}