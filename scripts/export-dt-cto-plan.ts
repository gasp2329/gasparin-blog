// scripts/export-dt-cto-plan.ts
// Generates the Digital Turbine CTO 30/60/90-Day Execution Plan as a styled HTML file.
// Then convert to PDF:
//   weasyprint exports/dt-cto-plan.html exports/dt-cto-plan.pdf
import * as fs from "fs";
import * as path from "path";

const title = "Digital Turbine: CTO & Chief of Staff 30 / 60 / 90-Day Execution Plan";

const content = `
<div class="cover">
  <div class="cover-eyebrow">CONFIDENTIAL · FOR INTERNAL USE ONLY</div>
  <div class="cover-title">Digital Turbine</div>
  <div class="cover-subtitle">CTO &amp; Chief of Staff<br>30 / 60 / 90-Day Execution Plan<br><span style="font-size:13pt;color:#b45309;font-weight:700;">Accelerated Variant — Move Fast, Communicate Everything</span></div>
  <div class="cover-meta">March 2026 &nbsp;·&nbsp; Version 1.0</div>
</div>

<div class="toc-page">
  <h2 class="toc-heading">Table of Contents</h2>
  <ol class="toc">
    <li>Company Context &amp; Strategic Landscape</li>
    <li>Current-State Diagnosis</li>
    <li>Phase 1 — Days 1–21: Assess &amp; Move Immediately</li>
    <li>Phase 2 — Days 22–55: Full Execution Sprint</li>
    <li>Phase 3 — Days 56–90: Compound, Deliver &amp; Scale</li>
    <li>Chief of Staff Operating Cadence</li>
    <li>Key Risks &amp; Mitigations</li>
    <li>Success Metrics Dashboard</li>
    <li>Rhythm of Business (ROB): Communication Architecture</li>
  </ol>
</div>

<!-- ═══════════════════════════════════════════════════════ -->
<h2>1. Company Context &amp; Strategic Landscape</h2>

<h3>Who Digital Turbine Is</h3>
<p>Digital Turbine (Nasdaq: APPS) is a vertically integrated mobile growth platform. Its core thesis is a <strong>device-to-demand flywheel</strong>: acquire users at the moment of device activation through carrier and OEM partnerships, then monetize those users via in-app advertising infrastructure. At its peak DT controlled a meaningful share of the pre-install and app-discovery market on Android devices across North America, EMEA, and APAC.</p>

<p>The company grew through a sequence of acquisitions that repositioned it from a pure device-distribution play into a full-stack mobile advertising business:</p>
<table>
  <colgroup>
    <col style="width:18%">
    <col style="width:12%">
    <col style="width:35%">
    <col style="width:35%">
  </colgroup>
  <thead>
    <tr><th>Acquisition</th><th>Year</th><th>What It Brought</th><th>Integration Challenge</th></tr>
  </thead>
  <tbody>
    <tr><td><strong>Mobile Posse</strong></td><td>2020</td><td>Content recommendation &amp; notification layer on Android lock screens; carrier-billing relationships</td><td>Separate data stack; audience segmentation needs reconciliation with ODS identity layer</td></tr>
    <tr><td><strong>AdColony</strong></td><td>2021</td><td>Mobile video advertising SDK, direct brand relationships, performance DSP capability</td><td>Separate supply-side SDK competing with existing DT SDK; duplicate demand pools</td></tr>
    <tr><td><strong>Fyber</strong></td><td>2021</td><td>Header-bidding mediation, publisher-facing SSP, in-app bidding infrastructure</td><td>Most complex: own ad server, exchange, bidding layer — large EMEA engineering org</td></tr>
  </tbody>
</table>

<h3>Business Architecture</h3>
<p>The business operates across two strategic pillars that must work in concert:</p>
<table>
  <colgroup>
    <col style="width:22%">
    <col style="width:39%">
    <col style="width:39%">
  </colgroup>
  <thead>
    <tr><th></th><th>On-Device Solutions (ODS)</th><th>App Growth Platform (AGP)</th></tr>
  </thead>
  <tbody>
    <tr><td><strong>Core function</strong></td><td>App pre-install, content discovery, and device activation at the carrier and OEM level</td><td>Mediation, programmatic exchange, mobile video, and performance advertising</td></tr>
    <tr><td><strong>Key partners</strong></td><td>T-Mobile, AT&amp;T, Samsung, major Android OEMs</td><td>Thousands of app publishers, brand advertisers, agency trading desks</td></tr>
    <tr><td><strong>Revenue model</strong></td><td>Per-device activation fees, content recommendation revenue share</td><td>Take-rate on ad spend flowing through DT's exchange and mediation stack</td></tr>
    <tr><td><strong>Engineering criticality</strong></td><td>Device API integrations, firmware-level reliability, carrier SLA compliance</td><td>Sub-100ms auction latency, fill rate, fraud detection, SDK reliability across millions of apps</td></tr>
    <tr><td><strong>Primary metric</strong></td><td>Revenue per activated device; number of active carrier/OEM contracts</td><td>Revenue per impression (RPM); mediated spend; video completion rate</td></tr>
  </tbody>
</table>

<h3>Where DT Stands Today</h3>
<p>DT has faced significant headwinds: post-acquisition integration complexity slowed the delivery flywheel, macroeconomic pressure on digital advertising budgets compressed AGP margins, and carrier partner trust has been sensitive to SDK reliability and privacy-compliance issues. The company has been through meaningful cost restructuring. The engineering organization spans multiple time zones and carries the technical debt of three distinct platform stacks that have not been fully unified.</p>
<p>This is the context into which a new CTO steps. The opportunity is real: the strategic assets are strong, the carrier relationships are defensible, and the demand infrastructure (post-Fyber) is genuinely differentiated. Execution discipline — not vision — is what unlocks value from here.</p>

<blockquote><p>"The strategic flywheel is clear: ODS acquires users at device activation, AGP monetizes those users through in-app advertising, and performance data from both layers refines targeting and yield. What's missing is the operating discipline to turn that flywheel faster and more reliably."</p></blockquote>

<!-- ═══════════════════════════════════════════════════════ -->
<h2>2. Current-State Diagnosis</h2>

<h3>Known Engineering Challenges</h3>
<table>
  <colgroup>
    <col style="width:22%">
    <col style="width:40%">
    <col style="width:38%">
  </colgroup>
  <thead>
    <tr><th>Area</th><th>Observed Symptoms</th><th>Likely Root Cause</th></tr>
  </thead>
  <tbody>
    <tr><td><strong>Platform fragmentation</strong></td><td>Three separate ad-serving stacks (legacy DT, AdColony, Fyber) creating duplicated cost, inconsistent data models, and slow feature delivery</td><td>Acquisitions integrated commercially but not technologically; no unified platform charter</td></tr>
    <tr><td><strong>SDK proliferation</strong></td><td>Publishers managing multiple SDKs; integration fatigue; churn risk</td><td>Each acquired company brought its own SDK; no rationalization roadmap executed</td></tr>
    <tr><td><strong>Auction latency</strong></td><td>P99 latencies in AGP exchange slowing yield; demand partners timing out</td><td>Distributed bidding infrastructure without unified SLA governance</td></tr>
    <tr><td><strong>Data silos</strong></td><td>ODS user data not flowing cleanly to AGP targeting; audience match rates below potential</td><td>No canonical identity layer; data pipelines built for each acquisition separately</td></tr>
    <tr><td><strong>Org misalignment</strong></td><td>Teams working in parallel rather than toward shared outcomes; shipping without clear DRI ownership</td><td>Matrix org structure without clear product–engineering accountability pairing</td></tr>
    <tr><td><strong>Carrier/OEM trust</strong></td><td>SLA incidents create disproportionate partner relationship risk</td><td>ODS reliability not treated as Tier-0; incident response not carrier-grade</td></tr>
    <tr><td><strong>Talent distribution</strong></td><td>Engineering hubs in multiple continents with varying process maturity; knowledge silos around legacy systems</td><td>No common engineering standards or onboarding playbook post-acquisition</td></tr>
  </tbody>
</table>

<h3>The Structural Opportunity</h3>
<p>The problems above are soluble. No fundamental technology is broken. No major architectural decision needs to be reversed in year one. The primary lever is organizational: clear ownership, disciplined prioritization, and an operating rhythm that lets good engineers do great work. A CTO who establishes that within 90 days puts DT on a fundamentally better trajectory.</p>

<!-- ═══════════════════════════════════════════════════════ -->
<h2>3. Phase 1 — Days 1–21: Assess &amp; Move Immediately</h2>

<div class="phase-banner phase-1">PHASE 1 &nbsp;·&nbsp; DAYS 1–21 &nbsp;·&nbsp; ASSESS &amp; MOVE IMMEDIATELY</div>

<h3>Governing Principle</h3>
<p>The CTO was hired because the board already believes they can lead. There is no 30-day grace period to earn that right — it was granted at the offer letter. The mandate in Phase 1 is to <strong>listen and act in parallel from Day 8 onward</strong>. The first 7 days are intensive listening; from Day 8, moves begin. Assessment and execution are not sequential — they are simultaneous. Speed communicates confidence. Silence communicates uncertainty.</p>

<blockquote><p>"The most dangerous thing a new CTO can do in a distressed company is nothing. Thoughtful inaction reads as paralysis. Make moves. Communicate every one of them. Adjust if you're wrong — but move."</p></blockquote>

<h3>Day-by-Day Action Plan</h3>
<table>
  <colgroup>
    <col style="width:14%">
    <col style="width:44%">
    <col style="width:42%">
  </colgroup>
  <thead>
    <tr><th>Days</th><th>Action</th><th>Output / Signal Sent</th></tr>
  </thead>
  <tbody>
    <tr><td><strong>Day 1</strong></td><td>All-engineering note from the CTO: who I am, how I operate, what I'm here to do, what I'll share with you and when. Set the ROB cadence — announce every recurring meeting. Get added to all P0/P1 notifications immediately.</td><td>Org knows the CTO is present and communicates. ROB is live from Day 1.</td></tr>
    <tr><td><strong>Days 1–3</strong></td><td>CEO, CFO, CMO, Head of Sales, Head of Partnerships 1:1s. Single question driving each: <em>"What does winning look like in 12 months, and what is Engineering's job in getting there?"</em> CoS captures in writing same day.</td><td>CTO's business hypothesis formed within 72 hours. No waiting.</td></tr>
    <tr><td><strong>Days 3–7</strong></td><td>Engineering VP/Director 1:1 blitz — all direct reports and one level down. Parallel architecture walkthrough: map the full data flow from device activation → auction → billing in one session per pillar. Review last 6 months of P0/P1 incident log personally.</td><td>Org map annotated with strengths and gaps. Initial tech debt and SLA risk inventory drafted.</td></tr>
    <tr><td><strong>Day 8 — First Moves</strong></td><td><strong>ODS Tier-0 designation announced.</strong> Dedicated on-call rotation effective immediately. SLA dashboard commissioned. CTO personally briefs top 2 carrier partner technical leads within the week. This is the first visible action — it signals that carrier trust is the CTO's top personal priority.</td><td>Carrier partners see an immediate response. Internal teams see urgency and ownership. Board sees a move within the first 2 weeks.</td></tr>
    <tr><td><strong>Days 8–14</strong></td><td>Org decisions: if any VP/Director seat is clearly a blocker to a top priority, act now — don't wait for a "full" assessment. Communicate directly and humanely. Promote from within wherever possible. Announce the Squad Operating Model is coming in Week 3 — give the org time to process before launch.</td><td>Critical people decisions made while the CTO still has maximum political capital. No ambiguity about who is running what.</td></tr>
    <tr><td><strong>Days 14–21</strong></td><td>Architecture deep-dives with Staff/Principal Engineers. SDK fragmentation working session: map all SDK variants, publisher overlap, and migration complexity. Join at least one carrier/OEM QBR and one publisher escalation call. CoS drafts assessment memo from CTO's running notes.</td><td>Technical debt register v1 complete. SDK convergence scoping done. Assessment memo drafted and ready for CEO by Day 21.</td></tr>
    <tr><td><strong>Day 21 — Assessment Readout</strong></td><td>CTO presents <em>Current-State Assessment &amp; 90-Day Strategy</em> to CEO and leadership team. This is not a plan document — it is a decisions document. It names the three bets, who is accountable, and what funding is needed. CEO approves or redirects. Same week: first squad DRIs named.</td><td>Direction locked 3 weeks in. Execution begins Day 22 — no waiting for a 30-day mark.</td></tr>
  </tbody>
</table>

<h3>Chief of Staff — Phase 1 Playbook</h3>
<table>
  <colgroup>
    <col style="width:30%">
    <col style="width:70%">
  </colgroup>
  <thead>
    <tr><th>Work Stream</th><th>Action &amp; Timing</th></tr>
  </thead>
  <tbody>
    <tr><td><strong>Pre-Day-1 prep</strong></td><td>CoS produces the full stakeholder map, org chart annotations, and "Day 1 briefing book" <em>before</em> the CTO's first day. CTO should walk in knowing every direct report's background, the top-3 open incidents, and the last board engineering update.</td></tr>
    <tr><td><strong>Meeting machine</strong></td><td>Schedule all Phase 1 conversations in the first 48 hours. Pre-brief the CTO with a one-pager before each session; debrief within 30 minutes after. Don't let insights sit unrecorded overnight.</td></tr>
    <tr><td><strong>Metrics baseline — Day 3</strong></td><td>Pull all baseline metrics by Day 3, not Day 30: P0 MTTR, deployment frequency, on-call load per engineer, P99 auction latency, SDK adoption rate. These numbers must exist before the Day 8 first moves so the CTO is acting on data, not gut.</td></tr>
    <tr><td><strong>Assessment memo</strong></td><td>Draft running from Day 1 — updated nightly from CTO debrief notes. By Day 14 it is 80% written. Day 21 readout is polished, not drafted from scratch.</td></tr>
    <tr><td><strong>Early communication</strong></td><td>CTO Weekly Letter launched Week 1. First all-engineering town hall scheduled for Day 14 — not "in a few weeks when I know more." The org needs to hear from the CTO immediately and regularly.</td></tr>
  </tbody>
</table>

<h3>Phase 1 Exit Criteria (by Day 21)</h3>
<ul>
  <li>ODS Tier-0 designation live — dedicated on-call, SLA dashboard, carrier escalation playbook in place</li>
  <li>All VP/Director-level org decisions made or explicitly deferred with a date</li>
  <li>Assessment memo presented to CEO; top-3 bets approved and funded</li>
  <li>Squad DRIs named for first wave; Squad launch week confirmed</li>
  <li>Metrics baseline fully documented — no TBDs</li>
  <li>First all-engineering town hall delivered</li>
</ul>

<!-- ═══════════════════════════════════════════════════════ -->
<h2>4. Phase 2 — Days 22–55: Full Execution Sprint</h2>

<div class="phase-banner phase-2">PHASE 2 &nbsp;·&nbsp; DAYS 22–55 &nbsp;·&nbsp; FULL EXECUTION SPRINT</div>

<h3>Governing Principle</h3>
<p>Direction was locked on Day 21. Phase 2 has one job: <strong>execute the three bets at full speed</strong>. The listening is not over — it never is — but it no longer gates action. Every week without a visible win is a week of declining credibility. The CTO's job in Phase 2 is to remove blockers, make decisions fast, and protect the teams doing the work from distraction. The Chief of Staff absorbs everything else.</p>

<h3>Day 22: Execution Kickoff</h3>
<p>The day after the CEO approves the three bets, the CTO runs a 2-hour <em>Execution Kickoff</em> with the full engineering leadership team. No slides. Whiteboard only. Each bet gets a DRI, a staffing plan, a Week-1 milestone, and a definition of done for Day 55. Anyone who doesn't have clarity walking out of that room is a risk — the CoS follows up same day.</p>

<h3>Top Strategic Bets for Phase 2</h3>
<table>
  <colgroup>
    <col style="width:22%">
    <col style="width:42%">
    <col style="width:36%">
  </colgroup>
  <thead>
    <tr><th>Priority</th><th>What It Means</th><th>Why It's Bet #1–3</th></tr>
  </thead>
  <tbody>
    <tr><td><strong>1. ODS Reliability as Tier-0</strong></td><td><em>Already live since Day 8.</em> Phase 2 goal: zero new unplanned carrier SLA breaches. P0 MTTR reduced 30% by Day 40. Carrier partner briefing completed for all active contracts by Day 30. Reliability posture visible to commercial leadership in real time via live dashboard.</td><td>This bet was started in Phase 1 before the assessment memo was even done — because waiting for a clean process to protect carrier contracts is not an option.</td></tr>
    <tr><td><strong>2. SDK Convergence — Design &amp; Pilot</strong></td><td>By Day 30: dedicated SDK convergence team formed (3–4 engineers + 1 PM). By Day 40: technical design v1 complete and ARB-approved. By Day 50: 3 publisher pilots signed to beta migration track with contractual commitments. <em>Target: design approved and pilots committed by Day 55.</em></td><td>Team formed in Week 4, not Week 8. The 12–18 month migration clock starts now. Every week of planning delay is a week of publisher churn risk.</td></tr>
    <tr><td><strong>3. Squad Model — Launch &amp; First Cycle</strong></td><td>Squads named and DRIs assigned by Day 22. First cycle kickoff by Day 25. North Star metrics connected to company strategy confirmed by Day 28. First cycle review at Day 67 (6 weeks from Day 25). <em>Target: first cycle running and delivering by Day 55.</em></td><td>The squad model is not a Phase 2 project — it is the operating system for all other bets. It must be live before Phase 2 is half done.</td></tr>
  </tbody>
</table>

<h3>Org Decisions — Already Made or Make Immediately</h3>
<p>Org decisions that were obvious in Phase 1 were made in Phase 1. Any decision deferred to Phase 2 has a hard deadline of Day 30. The rule: if you know, act. If you need more time, set a date and keep it. Ambiguity is more damaging than a difficult decision communicated clearly.</p>
<ul>
  <li><strong>Day 22 at the latest</strong> for any VP/Director decision identified in Phase 1. No new information will make an obvious call clearer — waiting only makes it harder.</li>
  <li><strong>External hiring</strong> moves at full speed: JDs live by Day 25, agency briefed by Day 28, first candidate slates to CTO by Day 40. CoS owns the process; CTO sees only finalists.</li>
  <li><strong>Promote from within</strong> as the default for all interim and permanent appointments. Speed and morale both improve.</li>
</ul>

<h3>Engineering Standards — First Codification</h3>
<p>In Phase 2, the CTO and senior architects produce DT's first unified engineering standards document. Not a mandate — a starting point for discussion. Key sections:</p>
<ul>
  <li>Service reliability tiers and corresponding SLO templates (Tier-0 through Tier-3)</li>
  <li>On-call expectations, incident severity definitions, postmortem requirements</li>
  <li>Definition of "ready to ship": security review checklist, monitoring requirements, runbook</li>
  <li>Data handling standards relevant to GDPR/CCPA — critical for advertising platform</li>
</ul>

<h3>Chief of Staff — Phase 2 Playbook</h3>
<table>
  <colgroup>
    <col style="width:30%">
    <col style="width:70%">
  </colgroup>
  <thead>
    <tr><th>Work Stream</th><th>Action &amp; Timing</th></tr>
  </thead>
  <tbody>
    <tr><td><strong>Execution tracker — live Day 22</strong></td><td>Single master tracker for all three bets: milestone, owner, due date, RAG status. Updated by DRIs daily; reviewed by CTO in morning brief. CoS escalates anything amber by EOD; anything red gets a same-day CTO decision.</td></tr>
    <tr><td><strong>ODS war room — weekly</strong></td><td>Standing 30-min war room every Monday: incidents from prior week, open SLA risks, carrier escalation status, MTTR trend. CoS owns agenda and action tracker. Carrier partner SLA posture report sent to commercial leadership bi-weekly.</td></tr>
    <tr><td><strong>Hiring pipeline — Day 25</strong></td><td>JDs for top-3 open seats live by Day 25. Agency briefed by Day 28. CoS manages end-to-end; presents CTO with a one-page candidate brief, not a stack of CVs. First offers out by Day 50 for fastest-moving searches.</td></tr>
    <tr><td><strong>Board prep — starts Day 30</strong></td><td>Don't wait for the quarterly board cycle. At Day 30, CoS drafts an unsolicited engineering progress update for the CEO — two pages: what moved, what the metrics show, what the risks are. This becomes the template for every board touchpoint going forward.</td></tr>
    <tr><td><strong>Engineering standards — v1 by Day 45</strong></td><td>CoS facilitates a 2-hour working session with Staff Engineers at Day 30 to produce the first draft. Comment period for 1 week. Published by Day 45. Not perfect — adoptable and improvable.</td></tr>
  </tbody>
</table>

<h3>Phase 2 Exit Criteria (by Day 55)</h3>
<ul>
  <li>ODS: zero unplanned carrier SLA breaches since Day 8; MTTR down 30%; carrier briefings complete</li>
  <li>SDK: convergence team running; technical design ARB-approved; 3 publisher pilots signed</li>
  <li>Squads: first cycle at the 4-week mark with ≥80% on-track commitments; North Stars showing first data points</li>
  <li>Org: all Phase-1 people decisions closed; top-3 external searches in final-round stage</li>
  <li>Engineering standards v1.0 published and adopted by Tier-0/1 services</li>
  <li>Engineering progress memo delivered to CEO — board has been proactively briefed</li>
</ul>

<!-- ═══════════════════════════════════════════════════════ -->
<h2>5. Phase 3 — Days 56–90: Compound, Deliver &amp; Scale</h2>

<div class="phase-banner phase-3">PHASE 3 &nbsp;·&nbsp; DAYS 56–90 &nbsp;·&nbsp; COMPOUND, DELIVER &amp; SCALE</div>

<h3>Governing Principle</h3>
<p>By Day 56 the squads have been running for a month, the ODS reliability posture has visibly improved, and the SDK roadmap is designed. Phase 3 is about <strong>compounding early wins into irreversible momentum</strong>. The first squad cycle completes at Day 67. The board sees real metrics — not projections — for the first time. The 3-Year Technology Strategy is presented at Day 75, backed by 55 days of actual execution data. The last two weeks of the 90 days are for starting Cycle 2 with the confidence that the operating model works.</p>

<h3>Targets by End of Day 90</h3>
<table>
  <colgroup>
    <col style="width:28%">
    <col style="width:36%">
    <col style="width:36%">
  </colgroup>
  <thead>
    <tr><th>Area</th><th>Target</th><th>How to Measure</th></tr>
  </thead>
  <tbody>
    <tr><td><strong>ODS Reliability</strong></td><td>82+ days of zero unplanned carrier SLA breaches (since Day 8). MTTR down ≥30% from baseline. Carrier partner NPS collected and trending positive. Partner-facing reliability report published monthly.</td><td>Incident log; carrier relationship health survey; partner NPS</td></tr>
    <tr><td><strong>AGP Auction Latency</strong></td><td>P99 latency ≤150ms for top-10 demand partners by Day 75. Dedicated latency squad running with a 2-week sprint cadence. Fill-rate trend improving week-over-week from Day 60.</td><td>Real-time latency dashboard; demand partner fill-rate MoM trend</td></tr>
    <tr><td><strong>SDK Convergence</strong></td><td>Beta SDK release to pilot publishers by Day 80. At least 1 publisher successfully serving ads through unified SDK in production. Migration playbook published for remaining publishers.</td><td>Production traffic through new SDK; publisher integration time vs. baseline</td></tr>
    <tr><td><strong>Squad Cadence</strong></td><td>First 6-week cycle review completed Day 67 — formal retrospective, commitment vs. delivery ratio published. Cycle 2 launched Day 68. By Day 90: Cycle 2 is 3 weeks in with no blockers requiring CTO escalation.</td><td>Cycle delivery ratio (target ≥85%); retrospective quality scores; escalation rate</td></tr>
    <tr><td><strong>Data Flywheel</strong></td><td>Identity-layer POC live in one pilot market by Day 70. Audience match rate improvement measured and reported. Scope decision made for Phase 2 expansion by Day 85.</td><td>Match rate % delta; revenue-per-device in pilot vs. control market</td></tr>
    <tr><td><strong>3-Year Technology Strategy</strong></td><td>Presented to CEO and board at Day 75 — 15 days <em>ahead</em> of the 90-day mark. Backed by real execution data from Days 1–75, not projections. Board approves investment roadmap.</td><td>Board approval; investment ask quantified and scoped; written strategy doc published internally</td></tr>
    <tr><td><strong>Team Health</strong></td><td>eNPS pulse survey completed by Day 60. Results shared with the org (not just leadership) by Day 70. Top-3 retention risks have documented action plans with owners.</td><td>eNPS score; survey completion rate; action plan completion rate</td></tr>
  </tbody>
</table>

<h3>The 75-Day Technology Strategy Presentation</h3>
<p>The 3-Year Technology Strategy is presented at <strong>Day 75</strong> — not Day 90. Presenting it 15 days early sends a powerful signal: the CTO doesn't need 90 days to have a point of view backed by evidence. It is built on 75 days of real execution data, not just assessment. It should cover:</p>
<ul>
  <li><strong>Platform Architecture North Star:</strong> the 3-year end-state for the unified DT platform — single SDK, unified exchange, canonical identity layer, shared data infrastructure</li>
  <li><strong>Make vs. Buy vs. Partner decisions:</strong> which capabilities are core (must build/own), which are commodity (buy/license), which are better served through partnerships</li>
  <li><strong>AI/ML investment thesis:</strong> where machine learning uniquely improves DT's yield — auction optimization, fraud detection, audience modeling, predictive install rates — and the data infrastructure required</li>
  <li><strong>Engineering capacity plan:</strong> headcount, location strategy, insourcing vs. outsourcing framework</li>
  <li><strong>18-month roadmap with investment ask:</strong> what will be built, in what sequence, for what business outcome, at what cost</li>
</ul>

<h3>Chief of Staff — Phase 3 Playbook</h3>
<table>
  <colgroup>
    <col style="width:30%">
    <col style="width:70%">
  </colgroup>
  <thead>
    <tr><th>Work Stream</th><th>Action &amp; Timing</th></tr>
  </thead>
  <tbody>
    <tr><td><strong>Board strategy prep — starts Day 55</strong></td><td>20-day board prep cycle beginning Day 55: narrative development (Days 55–60) → data pull and deck build (Days 61–68) → design and legal review (Days 69–72) → rehearsal (Days 73–74) → present Day 75. CoS manages every handoff. CTO rehearses at least twice.</td></tr>
    <tr><td><strong>Cycle 1 review package</strong></td><td>CoS produces the formal Cycle 1 review document by Day 65: commitment register vs. actuals, North Star metric movement, blockers and how they were resolved, team health signals. Distributed to all of engineering — not just leadership. Transparency is the point.</td></tr>
    <tr><td><strong>90-day retrospective</strong></td><td>At Day 88, CTO and CoS produce a written 90-day retrospective for the CEO: what was planned vs. what happened, what surprised us, what we'd do differently, and the plan for Days 91–180. This is the document that builds sustained board confidence.</td></tr>
    <tr><td><strong>ROB transition</strong></td><td>By Day 75, every recurring meeting runs itself: agenda pre-populated by DRI 48 hours prior, action tracker maintained by respective owners, CoS receives exception reports only. CoS transitions from operating the rhythm to auditing it.</td></tr>
    <tr><td><strong>Successor investment</strong></td><td>By Day 80, CoS has a private succession map for the CTO's VP layer: who is ready now, who is 12 months away, who needs a specific development experience. Shared only with CTO. Used to inform stretch assignments and conference representation.</td></tr>
  </tbody>
</table>

<!-- ═══════════════════════════════════════════════════════ -->
<h2>6. Chief of Staff Operating Cadence</h2>

<p>The Chief of Staff is a force-multiplier for the CTO, not a gatekeeper. The model below ensures the CTO has maximum context, minimum friction, and full decision-making bandwidth at all times.</p>

<table>
  <colgroup>
    <col style="width:18%">
    <col style="width:22%">
    <col style="width:60%">
  </colgroup>
  <thead>
    <tr><th>Frequency</th><th>Meeting / Artifact</th><th>Purpose &amp; CoS Role</th></tr>
  </thead>
  <tbody>
    <tr><td><strong>Daily</strong></td><td>Morning brief (15 min)</td><td>CoS surfaces the day's priorities, any overnight incidents, key decisions needed. CTO enters the day fully oriented.</td></tr>
    <tr><td><strong>Daily</strong></td><td>Evening debrief (10 min)</td><td>Capture decisions made, follow-ups generated, and any surprises. CoS updates action tracker.</td></tr>
    <tr><td><strong>Weekly</strong></td><td>Leadership team sync (30 min)</td><td>CTO leads. CoS prepares agenda, takes notes, distributes action items, owns tracking to closure.</td></tr>
    <tr><td><strong>Weekly</strong></td><td>Squad cycle check-in (60 min)</td><td>CTO reviews squad health across ODS and AGP workstreams. CoS maintains the squad health dashboard.</td></tr>
    <tr><td><strong>Bi-weekly</strong></td><td>All-engineering town hall (60 min)</td><td>CTO communication vehicle to the full org. CoS scripts the agenda, collects pre-submitted questions, coordinates speakers, captures follow-ups.</td></tr>
    <tr><td><strong>Monthly</strong></td><td>Skip-level lunches</td><td>CTO meets with senior engineers/staff-level ICs without their managers present. CoS schedules and ensures geographic/functional diversity across the year.</td></tr>
    <tr><td><strong>Monthly</strong></td><td>Engineering metrics review</td><td>Formal review of KPIs: reliability, velocity, latency, SDK health, hiring pipeline. CoS owns deck production; presents trends, not just snapshots.</td></tr>
    <tr><td><strong>Quarterly</strong></td><td>Board prep cycle</td><td>CoS manages a 4-week board preparation cycle: narrative development → data pull → deck production → legal/comms review → rehearsal. CTO never walks into a board meeting cold.</td></tr>
    <tr><td><strong>Quarterly</strong></td><td>Engineering off-site (half-day)</td><td>Leadership team steps back from execution to focus on strategy and culture. CoS owns logistics end-to-end; facilitates pre-reads distributed 1 week prior.</td></tr>
  </tbody>
</table>

<!-- ═══════════════════════════════════════════════════════ -->
<h2>7. Key Risks &amp; Mitigations</h2>

<table>
  <colgroup>
    <col style="width:5%">
    <col style="width:22%">
    <col style="width:10%">
    <col style="width:10%">
    <col style="width:53%">
  </colgroup>
  <thead>
    <tr><th>#</th><th>Risk</th><th>Likelihood</th><th>Severity</th><th>Mitigation</th></tr>
  </thead>
  <tbody>
    <tr>
      <td>1</td>
      <td>Key engineering leader departs during transition</td>
      <td><span class="badge badge-yellow">Medium</span></td>
      <td><span class="badge badge-red">High</span></td>
      <td>Identify top-5 retention priorities by Day 15. Have explicit career conversations by Day 30. Compensation review in Phase 2. Succession plans for each critical seat.</td>
    </tr>
    <tr>
      <td>2</td>
      <td>Carrier SLA breach during Phase 1 (before mitigations in place)</td>
      <td><span class="badge badge-medium">Medium</span></td>
      <td><span class="badge badge-red">High</span></td>
      <td>Get on incident notifications Day 1. Assign a Tier-0 watchdog before formal designation. Have a carrier escalation script ready from Day 1.</td>
    </tr>
    <tr>
      <td>3</td>
      <td>Squad model meets cultural resistance</td>
      <td><span class="badge badge-yellow">Medium</span></td>
      <td><span class="badge badge-yellow">Medium</span></td>
      <td>Co-design the first squads with existing team leads — don't impose top-down. Pilot in one workstream first. Show results before scaling.</td>
    </tr>
    <tr>
      <td>4</td>
      <td>Fast moves create anxiety before rationale is communicated</td>
      <td><span class="badge badge-yellow">Medium</span></td>
      <td><span class="badge badge-yellow">Medium</span></td>
      <td>Every action is announced with context: what was decided, why, what it means for you. CTO Weekly Letter from Day 1. All-hands at Day 14. The antidote to anxiety from speed is communication at the same speed.</td>
    </tr>
    <tr>
      <td>5</td>
      <td>SDK roadmap delays due to publisher contract complexity</td>
      <td><span class="badge badge-yellow">Medium</span></td>
      <td><span class="badge badge-yellow">Medium</span></td>
      <td>Involve legal and business development in SDK roadmap from Day 31. Sequence migrations to avoid contract trigger dates.</td>
    </tr>
    <tr>
      <td>6</td>
      <td>Board pressure accelerates timeline beyond what's safe</td>
      <td><span class="badge badge-low">Low</span></td>
      <td><span class="badge badge-red">High</span></td>
      <td>CTO must be explicit with CEO about the risk of compressing the assessment period. "Move fast, but not so fast that we break something we can't fix." Get CEO as a buffer.</td>
    </tr>
  </tbody>
</table>

<!-- ═══════════════════════════════════════════════════════ -->
<h2>8. Success Metrics Dashboard</h2>

<p>These are the leading and lagging indicators the CTO and board should track. Baselines established in Phase 1; targets set in Phase 2; reviewed quarterly thereafter.</p>

<table>
  <colgroup>
    <col style="width:5%">
    <col style="width:22%">
    <col style="width:18%">
    <col style="width:17%">
    <col style="width:17%">
    <col style="width:21%">
  </colgroup>
  <thead>
    <tr><th>#</th><th>Metric</th><th>Pillar</th><th>Day-1 Baseline</th><th>Day-90 Target</th><th>Owner</th></tr>
  </thead>
  <tbody>
    <tr><td>1</td><td>Carrier SLA breach count (rolling 90-day)</td><td>ODS</td><td>TBD (Phase 1)</td><td>0 unplanned breaches</td><td>Head of ODS Eng</td></tr>
    <tr><td>2</td><td>P0 Mean Time to Resolve (MTTR)</td><td>Platform</td><td>TBD</td><td>−30% vs. baseline</td><td>Head of SRE</td></tr>
    <tr><td>3</td><td>AGP Auction P99 Latency (ms)</td><td>AGP</td><td>TBD</td><td>≤150ms (top-10 partners)</td><td>Head of AGP Eng</td></tr>
    <tr><td>4</td><td>Deployment frequency (deploys/week)</td><td>Platform</td><td>TBD</td><td>+20% vs. baseline</td><td>Engineering VPs</td></tr>
    <tr><td>5</td><td>SDK active publisher count</td><td>AGP</td><td>Current count</td><td>No net churn; 3 pilots on convergence track</td><td>Head of Publisher Eng</td></tr>
    <tr><td>6</td><td>ODS→AGP audience match rate</td><td>Data / Both</td><td>TBD</td><td>+15pp in pilot market</td><td>Head of Data</td></tr>
    <tr><td>7</td><td>Squad cycle delivery ratio</td><td>Org</td><td>N/A (new)</td><td>≥80% commitments met in Cycle 1</td><td>CTO / CoS</td></tr>
    <tr><td>8</td><td>Engineering eNPS</td><td>People</td><td>TBD (first survey)</td><td>Baseline established; action plans for bottom-quartile signals</td><td>CoS + HR</td></tr>
    <tr><td>9</td><td>Open critical roles</td><td>People</td><td>TBD</td><td>Top-3 critical seats filled or in final-round</td><td>CoS + Recruiting</td></tr>
    <tr><td>10</td><td>Tech debt register coverage</td><td>Platform</td><td>0 (not yet created)</td><td>100% of Tier-0/1 services documented; top-10 items severity-ranked</td><td>Staff Engineers</td></tr>
  </tbody>
</table>

<!-- ═══════════════════════════════════════════════════════ -->
<h2>9. Rhythm of Business (ROB): Communication Architecture</h2>

<p>The ROB defines every recurring meeting the CTO and Chief of Staff own — who is in the room, how long it runs, what it decides, and how often it happens. Adapted from Xandr's 2022 Tech Communication Architecture, which established a tiered model separating decision forums from alignment sessions from broadcast communications. Each meeting has a single objective; conflating objectives is the most common reason meetings fail.</p>

<h3>Meeting Tiers</h3>
<table>
  <colgroup>
    <col style="width:12%">
    <col style="width:22%">
    <col style="width:66%">
  </colgroup>
  <thead>
    <tr><th>Tier</th><th>Type</th><th>Purpose</th></tr>
  </thead>
  <tbody>
    <tr><td><strong>Tier 1</strong></td><td>Decide</td><td>Small group, decision-authority in the room, produces a binding outcome. Attendees: only people who need to decide or who hold veto-level context.</td></tr>
    <tr><td><strong>Tier 2</strong></td><td>Align</td><td>Cross-functional. Surfaces conflicts between teams before they become execution failures. Produces shared commitment, not just awareness.</td></tr>
    <tr><td><strong>Tier 3</strong></td><td>Inform &amp; Inspire</td><td>Broadcast. One-to-many. CTO to org. No decisions made here — decisions are announced and contextualized.</td></tr>
    <tr><td><strong>Tier 4</strong></td><td>Learn</td><td>Retrospective / review. Looks backward to improve forward. Produces documented action items, not just discussion.</td></tr>
  </tbody>
</table>

<h3>Complete Meeting Register</h3>
<table>
  <colgroup>
    <col style="width:19%">
    <col style="width:9%">
    <col style="width:8%">
    <col style="width:8%">
    <col style="width:26%">
    <col style="width:30%">
  </colgroup>
  <thead>
    <tr><th>Meeting</th><th>Tier</th><th>Freq.</th><th>Duration</th><th>Attendees</th><th>Objective &amp; Output</th></tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>CEO ↔ CTO 1:1</strong></td>
      <td>Decide</td>
      <td>Weekly</td>
      <td>30 min</td>
      <td>CEO, CTO</td>
      <td>Strategic alignment, escalated decisions, board narrative alignment. Output: decisions logged, follow-ups assigned.</td>
    </tr>
    <tr>
      <td><strong>CTO Direct Staff</strong></td>
      <td>Decide / Align</td>
      <td>Weekly</td>
      <td>60 min</td>
      <td>CTO + direct reports (VP Eng ODS, VP Eng AGP, Head of Platform/Infra, Head of Data, CoS)</td>
      <td>Weekly priorities, cross-team blockers, resource decisions. First 15 min: metrics pulse. Final 10 min: decisions &amp; owners logged. No status reporting — async pre-read required.</td>
    </tr>
    <tr>
      <td><strong>Product–Engineering Weekly</strong></td>
      <td>Align</td>
      <td>Weekly</td>
      <td>60 min</td>
      <td>CTO, CPO, VP Product, VP Eng leads (ODS &amp; AGP)</td>
      <td>Roadmap sequencing, dependency surfacing, trade-off decisions between product scope and engineering capacity. Output: updated priority stack, decisions on de-scoping or re-sequencing.</td>
    </tr>
    <tr>
      <td><strong>Squad Cycle Check-in</strong></td>
      <td>Align</td>
      <td>Weekly</td>
      <td>60 min</td>
      <td>CTO, CoS, Squad DRIs (all active squads)</td>
      <td>Red/amber/green status per squad. Surface blockers requiring CTO intervention. CoS maintains live health dashboard. No deep dives — those happen in Squad Reviews.</td>
    </tr>
    <tr>
      <td><strong>Architecture Review Board (ARB)</strong></td>
      <td>Decide</td>
      <td>Bi-weekly</td>
      <td>90 min</td>
      <td>CTO, Staff/Principal Engineers, relevant Squad Tech Leads (rotating)</td>
      <td>Technical decisions with cross-system impact: new service boundaries, data contracts, protocol choices, deprecation plans. Output: signed-off Architecture Decision Record (ADR). No ADR, no decision.</td>
    </tr>
    <tr>
      <td><strong>ODS Partner Tech Review</strong></td>
      <td>Align</td>
      <td>Bi-weekly</td>
      <td>60 min</td>
      <td>CTO or VP Eng ODS, Partner Engineering leads, CoS</td>
      <td>Carrier and OEM SLA health, upcoming firmware/API integration milestones, issue escalation. Output: partner-facing status report, open action items with due dates.</td>
    </tr>
    <tr>
      <td><strong>Incident &amp; Reliability Review</strong></td>
      <td>Learn</td>
      <td>Bi-weekly</td>
      <td>60 min</td>
      <td>CTO, Head of SRE, On-call leads (ODS &amp; AGP), Engineering VPs</td>
      <td>Review all P0/P1 incidents from the prior two weeks. Postmortem quality review. Track repeat-pattern incidents. Output: updated incident trends dashboard, action items with owners and SLAs.</td>
    </tr>
    <tr>
      <td><strong>All-Engineering Town Hall</strong></td>
      <td>Inform</td>
      <td>Bi-weekly</td>
      <td>60 min</td>
      <td>CTO (host) + all Engineering, open to Product and adjacent teams</td>
      <td>State of the org, recent wins, in-flight priorities, Q&amp;A. Last 15 min always open Q&amp;A — no pre-screening of questions. CoS pre-populates agenda; CTO approves 48 hrs prior. Output: recording posted within 24 hrs for async viewing.</td>
    </tr>
    <tr>
      <td><strong>Skip-Level Lunch</strong></td>
      <td>Inform / Learn</td>
      <td>Monthly</td>
      <td>60 min</td>
      <td>CTO + 4–6 Senior Engineers / Tech Leads (rotating, no managers present)</td>
      <td>Unfiltered signal from the engineering org: what's frustrating, what's working, what would you change. CoS schedules to ensure geographic and functional diversity across the year. CTO takes notes personally — no CoS present.</td>
    </tr>
    <tr>
      <td><strong>Engineering Metrics Review</strong></td>
      <td>Decide / Learn</td>
      <td>Monthly</td>
      <td>60 min</td>
      <td>CTO, CoS, Engineering VPs, Head of SRE, Head of Data</td>
      <td>Full metrics dashboard review: reliability (SLA, MTTR, P99), velocity (deployment frequency, cycle delivery ratio), people (eNPS, attrition, hiring pipeline), platform health (tech debt burn rate, SDK adoption). Output: month-over-month trend report; items requiring action escalated to CTO Staff.</td>
    </tr>
    <tr>
      <td><strong>Cross-Functional Leadership Sync</strong></td>
      <td>Align</td>
      <td>Monthly</td>
      <td>60 min</td>
      <td>CTO, CFO, CMO, Head of Sales, Head of Partnerships (CEO optional)</td>
      <td>Engineering dependencies affecting commercial commitments: partner SLA posture, roadmap confidence for sales-committed features, infra cost vs. budget. Output: any at-risk commercial commitments flagged with mitigation plan.</td>
    </tr>
    <tr>
      <td><strong>Squad Cycle Review</strong></td>
      <td>Learn / Decide</td>
      <td>Every 6 weeks</td>
      <td>3 hrs</td>
      <td>CTO, CoS, all Squad DRIs, VP Eng leads, CPO</td>
      <td>End-of-cycle structured review: commitments vs. delivery, North Star metric movement, learnings, blockers that persisted. Then: Cycle N+1 commitment setting. Output: published cycle report + next cycle commitment register.</td>
    </tr>
    <tr>
      <td><strong>Engineering Quarterly Off-site</strong></td>
      <td>Align / Decide</td>
      <td>Quarterly</td>
      <td>Half-day</td>
      <td>CTO + Engineering Directors/VPs (8–12 people max)</td>
      <td>Step back from execution: strategy refresh, org health discussion, team trust-building. Pre-reads distributed 1 week prior. CoS owns logistics. Output: updated engineering strategy one-pager; top-3 strategic bets for next quarter confirmed.</td>
    </tr>
    <tr>
      <td><strong>Board Engineering Update</strong></td>
      <td>Inform / Decide</td>
      <td>Quarterly</td>
      <td>30 min (within board meeting)</td>
      <td>CTO, Board of Directors, CEO</td>
      <td>Technology strategy update: platform health trends, roadmap confidence, key risks, investment ask. CTO presents; CoS manages 4-week board prep cycle preceding. Output: board-approved technology investment priorities.</td>
    </tr>
    <tr>
      <td><strong>Annual Engineering Summit</strong></td>
      <td>Inform / Inspire</td>
      <td>Annual</td>
      <td>Full day</td>
      <td>All Engineering, Product leadership, select commercial leaders</td>
      <td>Full-year retrospective, year-ahead strategy, team recognition, culture reinforcement. CTO keynote. Cross-team technical demos. Output: published year-ahead engineering priorities; culture survey baseline reset.</td>
    </tr>
  </tbody>
</table>

<h3>ROB Design Principles</h3>
<ul>
  <li><strong>One objective per meeting.</strong> Every meeting has exactly one primary objective: decide, align, inform, or learn. If a meeting is trying to do two of these, split it.</li>
  <li><strong>Pre-read or cancel.</strong> Any Tier 1 or Tier 2 meeting without a pre-read distributed 24 hours in advance is cancelled by default. Reading in the room is a tax on everyone else's time.</li>
  <li><strong>Decisions are written down.</strong> Any decision made in a meeting is documented in writing before the meeting ends — who decided what, and why. The CoS owns this for CTO-chaired meetings.</li>
  <li><strong>Status is async.</strong> No meeting exists solely to report status. Status lives in a dashboard or a written update. Meetings are for things that require judgment, conflict resolution, or live discussion.</li>
  <li><strong>The CTO protects Friday afternoons.</strong> No recurring meetings Friday after 2pm. This is protected thinking time — the only slot in the week for reading, writing strategy, and unscheduled 1:1s.</li>
  <li><strong>CoS owns the calendar, not the CTO.</strong> The CTO's calendar is managed by the CoS against these principles. Any meeting request that doesn't map to the ROB or that duplicates an existing forum is declined by default with a redirect to the right channel.</li>
</ul>

<h3>Communication Channels by Purpose</h3>
<table>
  <colgroup>
    <col style="width:22%">
    <col style="width:22%">
    <col style="width:56%">
  </colgroup>
  <thead>
    <tr><th>Channel</th><th>Medium</th><th>What Belongs Here</th></tr>
  </thead>
  <tbody>
    <tr><td><strong>CTO Weekly Letter</strong></td><td>Written (email/Notion)</td><td>Weekly: what shipped, what the CTO is thinking about, one thing the org should know. 300 words max. Sent Friday EOD. This is the single most important communication habit the CTO builds.</td></tr>
    <tr><td><strong>Incident Bridge</strong></td><td>Slack + Video (on-demand)</td><td>P0/P1 incidents only. CTO joins personally for any ODS Tier-0 incident. Real-time only — never used for planning or discussion.</td></tr>
    <tr><td><strong>Engineering Slack (#eng-leadership)</strong></td><td>Async (Slack)</td><td>Cross-team coordination between engineering leaders. Decisions do not happen here — they are documented elsewhere and referenced with a link.</td></tr>
    <tr><td><strong>Architecture Decision Records</strong></td><td>Written (Confluence/Notion)</td><td>Every significant technical decision: context, options considered, decision made, trade-offs accepted. Permanent record. Searchable. Required output of ARB.</td></tr>
    <tr><td><strong>Squad Health Dashboard</strong></td><td>Dashboard (live)</td><td>Real-time view of all squads: RAG status, North Star metric trend, current cycle commitment vs. delivery. CoS maintains. CTO reviews async daily.</td></tr>
  </tbody>
</table>

<div class="closing-box">
  <div class="closing-title">The 90-Day Thesis</div>
  <p>Digital Turbine has every ingredient for a strong recovery: defensible carrier relationships, differentiated advertising infrastructure, and a large installed base of device partnerships that competitors cannot replicate quickly. What it has lacked is the engineering operating discipline to turn those assets into reliable, compounding growth.</p>
  <p>A CTO and Chief of Staff who execute this plan will, by Day 90, have established the trust of the engineering organization, the confidence of the board, the respect of key carrier partners, and — most importantly — the foundational systems to execute reliably at scale. That is the job. Everything else follows.</p>
</div>
`;

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>${title}</title>
<style>
  @page {
    size: A4;
    margin: 2cm 1.8cm;
    @bottom-right {
      content: counter(page);
      font-family: -apple-system, "Segoe UI", Helvetica, Arial, sans-serif;
      font-size: 8pt;
      color: #a8a29e;
    }
  }
  *, *::before, *::after { box-sizing: border-box; }

  body {
    font-family: Georgia, "Times New Roman", serif;
    font-size: 10.5pt;
    line-height: 1.7;
    color: #1c1917;
    max-width: 100%;
    margin: 0 auto;
    padding: 0;
    overflow-wrap: break-word;
    word-wrap: break-word;
  }

  /* ── Cover page ── */
  .cover {
    page-break-after: always;
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-height: 220mm;
    padding: 40pt 0 20pt;
    border-top: 6px solid #1c1917;
  }
  .cover-eyebrow {
    font-family: -apple-system, "Segoe UI", Helvetica, Arial, sans-serif;
    font-size: 7.5pt;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #b45309;
    margin-bottom: 28pt;
  }
  .cover-title {
    font-family: -apple-system, "Segoe UI", Helvetica, Arial, sans-serif;
    font-size: 38pt;
    font-weight: 900;
    letter-spacing: -0.04em;
    line-height: 1.05;
    color: #1c1917;
    margin-bottom: 14pt;
  }
  .cover-subtitle {
    font-family: -apple-system, "Segoe UI", Helvetica, Arial, sans-serif;
    font-size: 18pt;
    font-weight: 400;
    color: #57534e;
    line-height: 1.4;
    margin-bottom: 32pt;
  }
  .cover-meta {
    font-family: -apple-system, "Segoe UI", Helvetica, Arial, sans-serif;
    font-size: 9pt;
    color: #a8a29e;
    border-top: 1px solid #e7e5e4;
    padding-top: 12pt;
  }

  /* ── TOC ── */
  .toc-page {
    page-break-after: always;
    padding: 20pt 0;
  }
  .toc-heading {
    font-family: -apple-system, "Segoe UI", Helvetica, Arial, sans-serif;
    font-size: 20pt;
    font-weight: 800;
    letter-spacing: -0.02em;
    color: #1c1917;
    margin-bottom: 16pt;
    border-bottom: 3px solid #1c1917;
    padding-bottom: 6pt;
  }
  .toc {
    font-family: -apple-system, "Segoe UI", Helvetica, Arial, sans-serif;
    font-size: 11pt;
    line-height: 2.0;
    color: #1c1917;
    padding-left: 20pt;
  }
  .toc li { margin-bottom: 4pt; }

  /* ── Headings ── */
  h2 {
    font-family: -apple-system, "Segoe UI", Helvetica, Arial, sans-serif;
    font-size: 15pt;
    font-weight: 800;
    letter-spacing: -0.02em;
    line-height: 1.25;
    margin-top: 32pt;
    margin-bottom: 8pt;
    padding-bottom: 5pt;
    border-bottom: 3px solid #1c1917;
    color: #1c1917;
    page-break-after: avoid;
  }
  h3 {
    font-family: -apple-system, "Segoe UI", Helvetica, Arial, sans-serif;
    font-size: 11.5pt;
    font-weight: 700;
    letter-spacing: -0.01em;
    line-height: 1.3;
    margin-top: 20pt;
    margin-bottom: 6pt;
    color: #b45309;
    page-break-after: avoid;
  }

  p { margin-top: 0; margin-bottom: 9pt; }
  ul, ol { padding-left: 20pt; margin-bottom: 9pt; }
  li { margin-bottom: 4pt; line-height: 1.6; }
  strong { font-weight: 700; color: #1c1917; }
  em { font-style: italic; }
  a { color: #b45309; text-decoration: underline; }

  /* ── Blockquote ── */
  blockquote {
    border-left: 4px solid #b45309;
    background: #fffbf5;
    margin: 14pt 0;
    padding: 10pt 14pt;
    font-style: italic;
    color: #57534e;
    font-size: 10pt;
    line-height: 1.65;
    page-break-inside: avoid;
  }
  blockquote p { margin: 0; }

  /* ── Phase banners ── */
  .phase-banner {
    font-family: -apple-system, "Segoe UI", Helvetica, Arial, sans-serif;
    font-size: 8pt;
    font-weight: 800;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #ffffff;
    padding: 7pt 12pt;
    border-radius: 3px;
    margin: 12pt 0 16pt;
    page-break-after: avoid;
  }
  .phase-1 { background: #1d4ed8; }
  .phase-2 { background: #b45309; }
  .phase-3 { background: #15803d; }

  /* ── Tables ── */
  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 8pt;
    margin: 10pt 0 16pt;
    font-family: -apple-system, "Segoe UI", Helvetica, Arial, sans-serif;
    table-layout: fixed;
    word-wrap: break-word;
    page-break-inside: auto;
  }
  thead { display: table-header-group; }
  th {
    background: #1c1917;
    color: #ffffff;
    font-weight: 700;
    text-align: left;
    padding: 5pt 7pt;
    border-right: 1px solid #44403c;
    font-size: 7pt;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    white-space: normal;
    vertical-align: top;
  }
  th:last-child { border-right: none; }
  td {
    padding: 5pt 7pt;
    border-bottom: 1px solid #e7e5e4;
    border-right: 1px solid #e7e5e4;
    vertical-align: top;
    line-height: 1.5;
    font-size: 7.5pt;
  }
  td:last-child { border-right: none; }
  tr:nth-child(even) td { background: #fafaf9; }
  tr:last-child td { border-bottom: 2px solid #1c1917; }

  /* ── Badges ── */
  .badge {
    display: inline-block;
    font-size: 6.5pt;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    padding: 2pt 6pt;
    border-radius: 99px;
    white-space: nowrap;
  }
  .badge-red    { background: #fee2e2; color: #991b1b; }
  .badge-yellow { background: #fef3c7; color: #92400e; }
  .badge-medium { background: #fef3c7; color: #92400e; }
  .badge-low    { background: #dcfce7; color: #166534; }

  /* ── Closing box ── */
  .closing-box {
    background: #1c1917;
    color: #e7e5e4;
    padding: 18pt 20pt;
    margin-top: 24pt;
    border-radius: 4px;
    page-break-inside: avoid;
  }
  .closing-title {
    font-family: -apple-system, "Segoe UI", Helvetica, Arial, sans-serif;
    font-size: 12pt;
    font-weight: 800;
    color: #fcd34d;
    margin-bottom: 8pt;
    letter-spacing: -0.01em;
  }
  .closing-box p {
    color: #d6d3d1;
    font-size: 9.5pt;
    line-height: 1.7;
    margin-bottom: 8pt;
  }
  .closing-box p:last-child { margin-bottom: 0; }

  /* ── Pagination ── */
  p, li, blockquote { orphans: 3; widows: 3; }
  h2, h3 { page-break-after: avoid; }
  blockquote { page-break-inside: avoid; }
</style>
</head>
<body>
${content}
</body>
</html>`;

const outDir = path.join(process.cwd(), "exports");
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const htmlPath = path.join(outDir, "dt-cto-plan.html");
fs.writeFileSync(htmlPath, html, "utf-8");
console.log(`✓ HTML written: ${htmlPath}`);
