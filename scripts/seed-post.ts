// scripts/seed-post.ts
import { prisma } from "../src/lib/prisma";

const content = `
<h2>1. Why We Are Introducing the Capability Model</h2>
<p>As DT scales, our systems and teams become more interconnected. Monetization depends on reliability. Reliability affects partner trust. Latency impacts yield. A decision in one area often affects several others. Without clear structure, ownership can blur, priorities can compete, and teams can move in parallel instead of together.</p>
<p>The Capability Model gives us a simpler and more disciplined way to operate. Instead of organizing around shifting projects or quarterly resets, we organize around durable outcome domains called <strong>capabilities</strong>. Each capability has a clearly accountable owner and runs in focused 6-week cycles. Teams make explicit, measurable commitments, review real progress, surface risks early, and adjust before issues compound.</p>
<p>This model creates clarity at every level. Engineers understand the outcome they are contributing to. Product is accountable for improving defined, measurable outcomes—not just delivering features. Leaders see progress grounded in performance data, not slide volume. Most importantly, it strengthens how we work together—aligning faster, reducing cross-team friction, and improving our ability to deliver consistently.</p>

<h2>2. What a Capability Is</h2>
<p>A capability is a durable domain of outcome ownership. It represents an area of the business or platform that we are responsible for improving continuously. It is not a short-lived initiative or a loose grouping of features. It is a defined responsibility tied to measurable results.</p>
<ul>
  <li>Anchor the capability to a clear <strong>North Star metric</strong>, with every commitment tied to measurable performance movement tracked cycle over cycle.</li>
  <li>Have dedicated Product and Engineering resourcing aligned to that outcome, ensuring focus rather than partial attention.</li>
  <li>Have a single accountable <strong>DRI</strong> who is responsible for decisions and measurable performance within that domain.</li>
  <li>Operate as a self-contained unit with the resources required to execute independently.</li>
  <li>Be intentionally sized for speed and ownership, typically no more than ~20 total members and not fewer than five.</li>
  <li>Span multiple initiatives over time, so progress continues even as individual projects begin and end.</li>
  <li>Interface clearly with other capabilities, with defined boundaries that prevent overlap and reduce cross-team friction.</li>
</ul>
<p>Capabilities persist even as roadmaps evolve and priorities shift. As the business changes, ownership of critical outcomes remains stable—locking accountability in place, preventing quarterly resets from disrupting momentum, and ensuring progress compounds over time.</p>
<blockquote>Clarity of ownership is foundational. When responsibility is explicit and tied to metrics, alignment improves and execution becomes more decisive.</blockquote>

<h2>3. How the Capability Model Works</h2>
<p>Each capability operates on a structured <strong>6-week execution cycle</strong>, which consists of three consecutive 2-week sprints. Six weeks is long enough to move meaningful work and short enough to correct course before problems grow.</p>
<p>The cycle follows a simple loop:</p>
<p><strong>Commit → Deliver → Assess → Learn → Adjust → Recommit</strong></p>
<ul>
  <li><strong>What did we commit to?</strong> The measurable outcomes agreed for the cycle.</li>
  <li><strong>What changed?</strong> The measurable shifts relative to commitments.</li>
  <li><strong>What did we learn — and what are we changing?</strong> Identify 2–3 specific adjustments for the next cycle.</li>
  <li><strong>What are we committing to next?</strong> The focused, metric-defined outcomes for the upcoming cycle.</li>
</ul>
<p>Commitments must be measurable. If an outcome cannot be tracked, it is not ready to be committed.</p>

<h2>4. The 6-Week Capability Sync</h2>
<p>The 6-week sync is a focused review of outcome ownership. It is not a demo session, backlog walkthrough, or roadmap presentation. It is a disciplined discussion about measurable progress, tradeoffs, and next commitments.</p>
<p>Attendance is limited to the capability DRI and the specific team members the DRI designates as necessary for the discussion. The group will be intentionally kept small to allow for direct, open, and accountable conversations.</p>
<p>Each sync covers:</p>
<ol>
  <li><strong>Capability Overview</strong> – Mission, North Star metric(s), DRI, and status.</li>
  <li><strong>Company Priority Alignment</strong> – Clearly state the 3–5 cycle priorities and explicitly connect each to a DT company priority and measurable business impact.</li>
  <li><strong>Closed Cycle Review</strong> – Measurable outcomes committed and actual results achieved.</li>
  <li><strong>Impact Movement</strong> – What shifted in the metrics and why it matters.</li>
  <li><strong>Insights &amp; Adjustments</strong> – What worked, what slowed progress, and changes being made next cycle.</li>
  <li><strong>Next Commitments</strong> – Focused, measurable outcomes for the upcoming 6 weeks.</li>
  <li><strong>Risks &amp; Decisions</strong> – Dependencies or leadership alignment required.</li>
</ol>
<blockquote>Execution is measured by outcomes, not activity. Performance must be visible, understandable, and actionable.</blockquote>

<h2>5. Operating Discipline &amp; Governance</h2>
<ul>
  <li>6-week execution cycle with measurable commitments, structured as three 2-week sprints.</li>
  <li>Pre-read shared 48 hours before executive review.</li>
  <li>Consistent presentation format across all capabilities.</li>
  <li>Focused 10–15 minute review per capability.</li>
  <li>No demos in this forum; deep dives handled separately.</li>
</ul>
<p>Each capability will maintain a <strong>live dashboard</strong> tracking its North Star metric, supporting indicators, cycle commitments, and progress against those commitments. Dashboards provide real-time visibility and allow performance to be evaluated cycle over cycle.</p>
<p>The Capability Model replaces fragmented status updates with a single, structured execution rhythm grounded in measurable performance. It increases coordination and transparency without increasing overhead.</p>

<h2>6. What Success Looks Like</h2>
<ul>
  <li>Ownership is unmistakable.</li>
  <li>Commitments are fewer, sharper, and measurable.</li>
  <li>Risks surface earlier and are addressed sooner.</li>
  <li>Decisions happen with context and performance data.</li>
  <li>Cross-team coordination improves.</li>
  <li>Progress is visible in real time through dashboards.</li>
  <li>Performance improves steadily cycle over cycle.</li>
</ul>
<p>Most importantly, Product and Engineering operate with a shared execution system that strengthens how we build—measured, disciplined, and continuously improving.</p>

<h2>Sample Structure</h2>

<h3>Platform Portfolio View (Exec View)</h3>
<table>
  <thead>
    <tr>
      <th>Platform</th>
      <th>Platform Objective</th>
      <th>Platform Leader</th>
      <th># of Capabilities</th>
      <th>Primary Business Outcome</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Monetization</td>
      <td>Maximize revenue per device and placement yield</td>
      <td>VP Monetization</td>
      <td>2</td>
      <td>Revenue per Device</td>
    </tr>
    <tr>
      <td>SDK &amp; Performance</td>
      <td>Ensure SDK reliability, scalability, and low latency</td>
      <td>VP Engineering</td>
      <td>2</td>
      <td>Stability &amp; Performance</td>
    </tr>
    <tr>
      <td>Marketplace &amp; Demand</td>
      <td>Optimize auction efficiency and advertiser performance</td>
      <td>Head of Marketplace</td>
      <td>2</td>
      <td>Yield &amp; Advertiser Retention</td>
    </tr>
    <tr>
      <td>Data &amp; Optimization</td>
      <td>Improve ML-driven pricing, targeting, and fraud detection</td>
      <td>Head of Data Science</td>
      <td>2</td>
      <td>Margin &amp; Quality Lift</td>
    </tr>
    <tr>
      <td>Growth &amp; Distribution</td>
      <td>Expand device footprint and improve activation performance</td>
      <td>VP Growth</td>
      <td>1</td>
      <td>Activated Devices</td>
    </tr>
  </tbody>
</table>

<h3>Capability View</h3>
<table>
  <thead>
    <tr>
      <th>Platform</th>
      <th>Capability</th>
      <th>Mission</th>
      <th>North Star Metric</th>
      <th>3–5 Cycle Priorities</th>
      <th>DRI</th>
      <th>Team Size</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Monetization</td>
      <td>Yield Optimization</td>
      <td>Improve revenue per device through auction efficiency and performance improvements</td>
      <td>Revenue per Device (RPD)</td>
      <td>1) Reduce auction latency 15% 2) Increase fill rate 5% 3) Improve bid density 8%</td>
      <td>VP Monetization</td>
      <td>16</td>
    </tr>
    <tr>
      <td>Monetization</td>
      <td>Preload &amp; Placement Optimization</td>
      <td>Maximize activation and revenue from preloaded placements across OEM/carrier partners</td>
      <td>Revenue per Activated Device</td>
      <td>1) Increase activation rate 4% 2) Reduce uninstall rate 6% 3) Improve placement CTR 7%</td>
      <td>Director Device Growth</td>
      <td>12</td>
    </tr>
    <tr>
      <td>SDK &amp; Performance</td>
      <td>SDK Reliability</td>
      <td>Ensure SDK stability and uptime across OEM and carrier integrations</td>
      <td>SDK Crash-Free Rate</td>
      <td>1) Reduce crash rate 30% 2) Achieve 99.95% uptime 3) Cut integration defects 25%</td>
      <td>VP Engineering</td>
      <td>18</td>
    </tr>
    <tr>
      <td>SDK &amp; Performance</td>
      <td>Latency &amp; Load Performance</td>
      <td>Improve ad load speed and overall device performance impact</td>
      <td>Median Ad Load Time</td>
      <td>1) Reduce P95 latency 20% 2) Optimize edge caching 3) Improve rendering efficiency</td>
      <td>Eng Director Performance</td>
      <td>14</td>
    </tr>
    <tr>
      <td>Marketplace &amp; Demand</td>
      <td>Auction Optimization</td>
      <td>Improve auction efficiency to maximize yield and advertiser ROI</td>
      <td>eCPM × Fill Rate</td>
      <td>1) Deploy pricing model v2 2) Improve bid prediction accuracy 10% 3) Reduce bid timeouts 15%</td>
      <td>Head of Marketplace</td>
      <td>15</td>
    </tr>
    <tr>
      <td>Marketplace &amp; Demand</td>
      <td>Advertiser Experience</td>
      <td>Improve campaign transparency and advertiser retention</td>
      <td>Advertiser Retention Rate</td>
      <td>1) Improve reporting latency 2) Launch performance insights v1 3) Reduce billing disputes 20%</td>
      <td>Director Advertiser Ops</td>
      <td>11</td>
    </tr>
    <tr>
      <td>Data &amp; Optimization</td>
      <td>ML Pricing &amp; Targeting</td>
      <td>Improve model-driven optimization of bids and placements</td>
      <td>Model Lift vs Baseline</td>
      <td>1) Increase prediction accuracy 12% 2) Reduce model drift 3) Improve retraining cadence</td>
      <td>Head of Data Science</td>
      <td>15</td>
    </tr>
    <tr>
      <td>Data &amp; Trust</td>
      <td>Fraud &amp; Traffic Quality</td>
      <td>Detect and reduce invalid traffic to protect advertiser trust</td>
      <td>Invalid Traffic Rate</td>
      <td>1) Reduce IVT 40% 2) Deploy anomaly detection v3 3) Improve detection latency 25%</td>
      <td>Director Trust &amp; Safety</td>
      <td>11</td>
    </tr>
    <tr>
      <td>Growth &amp; Distribution</td>
      <td>Device Expansion</td>
      <td>Expand active device footprint across OEM and carrier partners</td>
      <td>Activated Devices</td>
      <td>1) Launch 2 OEM integrations 2) Increase LATAM activation 8% 3) Improve onboarding time 20%</td>
      <td>VP Growth</td>
      <td>13</td>
    </tr>
  </tbody>
</table>
`;

async function main() {
  // Ensure admin user exists
  const author = await prisma.user.findFirst({ where: { role: "admin" } });
  if (!author) {
    console.error("No admin user found. Run npm run seed first.");
    process.exit(1);
  }

  // Upsert tags
  const tagNames = ["strategy", "product", "engineering", "operating-model"];
  const tagRecords = await Promise.all(
    tagNames.map((name) =>
      prisma.tag.upsert({
        where: { slug: name },
        update: {},
        create: { name: name.replace(/-/g, " "), slug: name },
      })
    )
  );

  const slug = "dt-product-engineering-capability-operating-model";

  const post = await prisma.post.upsert({
    where: { slug },
    update: { content, published: true, publishedAt: new Date() },
    create: {
      title: "DT: Product & Engineering Capability Operating Model",
      slug,
      excerpt:
        "How DT organizes around durable outcome domains—called capabilities—with clear ownership, 6-week execution cycles, and measurable commitments that compound over time.",
      content,
      published: true,
      featured: true,
      type: "article",
      publishedAt: new Date(),
      authorId: author.id,
      tags: { connect: tagRecords.map((t) => ({ id: t.id })) },
    },
  });

  console.log(`✓ Post seeded: "${post.title}" (slug: ${post.slug})`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
