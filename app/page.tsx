"use client";

import { FormEvent, useMemo, useState } from "react";

type Status = "urgent" | "check" | "smooth";
type Report = { id: number; date: string; person: string; done: string; issue: string; next: string };

const initialReports: Report[] = [
  { id: 1, date: "2026/9/10", person: "佐藤 健", done: "A社へ新システム導入の見積書を送付。B社とオンライン打ち合わせを実施。C社へ契約更新について電話したが担当者不在。", issue: "A社から予算を20万円ほど下げられないか相談あり。そのまま値下げすると利益率が大きく下がる。", next: "A社向けの見積内容を再検討。C社担当者へ再度電話する。" },
  { id: 2, date: "2026/9/10", person: "鈴木 美咲", done: "D社のWebサイト修正を完了し、先方へ確認依頼。新規問い合わせ1件にサービス資料を送付。", issue: "D社からの確認待ち。現時点で大きな問題なし。", next: "D社から修正依頼があれば対応。新規問い合わせ先へ状況確認の連絡をする。" },
  { id: 3, date: "2026/9/10", person: "高橋 翔太", done: "E社のシステム更新作業を実施。F社との定例ミーティングに参加。", issue: "E社の更新後、一部の顧客データが画面に表示されない不具合が発生。現在原因不明。E社から明日午前中までの復旧を求められている。", next: "朝一でE社の不具合調査・復旧を最優先で行う。必要であれば開発担当の田中さんへ応援を依頼する。" },
  { id: 4, date: "2026/9/10", person: "田中 優斗", done: "G社向けの新機能を開発。社内テストを実施し、予定していた機能は正常に動作した。", issue: "大きな問題なし。ただしG社への納品期限が9/12のため、明日中に最終確認が必要。", next: "最終テストを実施。問題がなければG社へテスト環境を共有する。" },
  { id: 5, date: "2026/9/10", person: "山本 彩", done: "H社からの問い合わせ対応。I社へ8月分の請求書を再送。新規顧客J社との初回打ち合わせを実施。", issue: "I社の8月分請求（38万円）が支払期限を10日過ぎても未入金。先週も確認メールを送ったが返信なし。J社からは正式な提案書を9/14までに欲しいとの依頼あり。", next: "I社へ電話で入金状況を確認する。J社向け提案書の作成を開始する。" },
];

const statusInfo: Record<Status, { label: string; className: string }> = { urgent: { label: "至急対応", className: "urgent" }, check: { label: "要確認", className: "check" }, smooth: { label: "順調", className: "smooth" } };
function getStatus(report: Report): Status {
  const text = `${report.issue}${report.next}`;
  if (/不具合|未入金|復旧|支払期限|至急|障害/.test(text)) return "urgent";
  if (/相談|期限|確認|再検討|納品/.test(text)) return "check";
  return "smooth";
}

export default function Home() {
  const [reports, setReports] = useState(initialReports);
  const [activeTab, setActiveTab] = useState<"summary" | "reports">("summary");
  const [selected, setSelected] = useState<Report | null>(null);
  const [notice, setNotice] = useState("");
  const [draft, setDraft] = useState({ date: "2026/9/11", person: "", done: "", issue: "", next: "" });
  const grouped = useMemo(() => (Object.keys(statusInfo) as Status[]).map((status) => ({ status, items: reports.filter((report) => getStatus(report) === status) })), [reports]);
  const updateDraft = (key: keyof typeof draft, value: string) => setDraft((current) => ({ ...current, [key]: value }));
  const addReport = (event: FormEvent) => {
    event.preventDefault();
    if (!draft.person.trim() || !draft.done.trim() || !draft.next.trim()) { setNotice("担当者・今日やったこと・明日やることを入力してください"); window.setTimeout(() => setNotice(""), 2800); return; }
    setReports((current) => [...current, { ...draft, id: Date.now(), person: draft.person.trim(), done: draft.done.trim(), issue: draft.issue.trim() || "大きな問題なし" }]);
    setDraft({ date: "2026/9/11", person: "", done: "", issue: "", next: "" });
    setNotice("あなたの日報を追加しました"); window.setTimeout(() => setNotice(""), 2800);
  };
  return <main className="app-shell">
    <aside className="sidebar"><div className="brand"><span className="brand-mark">日</span><span>Daily Brief</span></div><div className="workspace-label">WORKSPACE</div><nav><button className={activeTab === "summary" ? "nav-item active" : "nav-item"} onClick={() => setActiveTab("summary")}><span>▦</span>経営サマリー</button><button className={activeTab === "reports" ? "nav-item active" : "nav-item"} onClick={() => setActiveTab("reports")}><span>≡</span>社員の日報</button></nav><div className="sidebar-bottom"><div className="mini-card"><span className="pulse" />本日の分析状況<div className="mini-number">{reports.length} <small>件を確認済み</small></div></div><div className="user-chip"><span className="avatar">社</span><span>社長アカウント</span></div></div></aside>
    <section className="content"><header className="topbar"><div><div className="eyebrow">THURSDAY, SEPTEMBER 10, 2026</div><h1>{activeTab === "summary" ? "経営サマリー" : "社員の日報"}</h1></div><div className="top-actions"><span className="date-pill">2026年9月10日</span><button className="primary-button" onClick={() => document.getElementById("report-form")?.scrollIntoView({ behavior: "smooth" })}>＋ 自分の日報を入力</button></div></header>
      <form id="report-form" className="report-composer" onSubmit={addReport}><div className="composer-heading"><div><h2>自分の日報を入力</h2><p>入力した内容をAIが整理し、経営サマリーへ反映します。</p></div><button className="primary-button" type="submit">AI整理して追加　✦</button></div><div className="form-grid"><label>日付<input type="text" value={draft.date} onChange={(event) => updateDraft("date", event.target.value)} /></label><label>担当者<input type="text" placeholder="あなたの名前" value={draft.person} onChange={(event) => updateDraft("person", event.target.value)} /></label><label className="wide-field">今日やったこと<textarea placeholder="今日の業務、進捗、訪問、打ち合わせなど" value={draft.done} onChange={(event) => updateDraft("done", event.target.value)} /></label><label>困っていること・問題<textarea placeholder="なければ空欄でOK" value={draft.issue} onChange={(event) => updateDraft("issue", event.target.value)} /></label><label>明日やること<textarea placeholder="次に対応すること、期限など" value={draft.next} onChange={(event) => updateDraft("next", event.target.value)} /></label></div></form>
      {activeTab === "summary" ? <><div className="hero-row"><div><h2>本日の重要事項</h2><p>{reports.length}名の日報から、経営判断に必要な情報を整理しました。</p></div><button className="analyze-button" onClick={() => setNotice("AI整理が完了しました")}>✦ AIで再分析</button></div><div className="metrics">{grouped.map(({ status, items }) => <div className="metric" key={status}><span className={`metric-icon ${status}`}>{status === "urgent" ? "!" : status === "check" ? "◒" : "✓"}</span><div><span>{statusInfo[status].label}</span><strong>{items.length}<small> 件</small></strong></div><em>{status === "urgent" ? "要アクション" : status === "check" ? "確認が必要" : "問題なし"}</em></div>)}<div className="metric plain"><span className="metric-icon blue">↗</span><div><span>明日以降のToDo</span><strong>{reports.length + 2}<small> 件</small></strong></div><em>期限あり</em></div></div><div className="section-heading"><div><h2>対応が必要な案件</h2><span>AIが日報から抽出した優先案件</span></div></div><div className="case-grid">{grouped.map(({ status, items }) => <div className={`case-column ${status}`} key={status}><div className="column-title"><span className="status-dot" />{statusInfo[status].label}<b>{items.length}</b></div>{items.map((report) => <button className="case-card" key={report.id} onClick={() => setSelected(report)}><div className="case-card-top"><span className="case-client">{report.person}</span><span className="arrow">↗</span></div><h3>{report.issue.length > 34 ? report.issue.slice(0, 34) + "…" : report.issue}</h3><p>{report.next}</p><div className="card-footer"><span className="avatar small">{report.person.slice(0, 1)}</span>{report.person}<span className="due">{status === "urgent" ? "要対応" : "確認"}</span></div></button>)}</div>)}</div><div className="lower-grid"><div className="panel"><div className="panel-title"><div><h2>明日以降のToDo</h2><span>日報から抽出した次のアクション</span></div></div>{reports.map((report) => <div className="todo" key={report.id}><span className={`todo-check ${getStatus(report)}`} /><span className="todo-text">{report.next}</span><span className="todo-person">{report.person}</span></div>)}</div><div className="panel insight"><div className="panel-title"><div><h2>AIインサイト</h2><span>複数の日報を横断した気づき</span></div><span className="sparkle">✦</span></div><div className="insight-body"><strong>入力内容はすぐに経営視点へ</strong><p>日報を追加すると、重要度を判定して案件カードとToDoに自動反映します。</p></div></div></div></> : <div className="reports-view"><div className="report-toolbar"><span>社員の日報 <b>{reports.length}件</b></span></div>{reports.map((report) => <button className="report-row" key={report.id} onClick={() => setSelected(report)}><span className={`status-dot ${getStatus(report)}`} /><span className="report-name">{report.person}</span><span className="report-summary">{report.done}</span><span className="report-tag">{statusInfo[getStatus(report)].label}</span><span>→</span></button>)}</div>}</section>
    {notice && <div className="toast">✓ {notice}</div>}{selected && <div className="modal-backdrop" onClick={() => setSelected(null)}><div className="modal" onClick={(event) => event.stopPropagation()}><button className="close" onClick={() => setSelected(null)}>×</button><div className={`modal-label ${getStatus(selected)}`}>● {statusInfo[getStatus(selected)].label}</div><h2>{selected.person}の日報</h2><span className="modal-date">{selected.date}</span><div className="detail-block"><label>今日やったこと</label><p>{selected.done}</p></div><div className="detail-block warning"><label>困っていること・問題</label><p>{selected.issue}</p></div><div className="detail-block"><label>明日やること</label><p>{selected.next}</p></div><button className="primary-button wide" onClick={() => setSelected(null)}>確認しました</button></div></div>}
  </main>;
}
