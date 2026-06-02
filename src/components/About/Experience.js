import React from "react";

const TIMELINE = [
  {
    period: "2024 — Present",
    title: "Front-End Developer",
    org: "Crocoit",
    desc: "Building scalable, high-performance e-commerce platforms and an SSR online learning platform with Next.js — reusable components, REST API integration, and optimized UX.",
    tags: ["React.js", "Next.js", "SSR", "REST APIs"],
  },
  {
    period: "E-commerce",
    title: "Almasry Pharmacy",
    org: "Magento 2 · PWA",
    desc: "Developed a Progressive Web App with offline support and push notifications; responsive product catalog, cart and checkout flows with state management.",
    tags: ["Magento 2", "React.js", "PWA"],
  },
  {
    period: "E-commerce",
    title: "Etlala Storefront",
    org: "Magento 2 · GraphQL",
    desc: "Customized Magento 2 storefront themes to match brand identity and integrated GraphQL APIs for efficient, seamless data fetching.",
    tags: ["Magento 2", "GraphQL"],
  },
  {
    period: "E-commerce",
    title: "Alsannat for Luggage",
    org: "Magento 2 · PWA",
    desc: "Built a scalable e-commerce frontend with PWA and GraphQL; ensured cross-browser and cross-device compatibility for a high-performance experience.",
    tags: ["Magento 2", "React.js", "PWA", "GraphQL"],
  },
];

function Experience() {
  return (
    <div className="experience-wrap">
      <h1 className="project-heading reveal">
        My <strong className="purple">Experience</strong>
      </h1>

      <div className="timeline">
        {TIMELINE.map((item, i) => (
          <div className="timeline-item reveal" key={item.title}>
            <span className="timeline-dot" />
            <div className="timeline-card">
              <span className="timeline-period">{item.period}</span>
              <h3 className="timeline-title">
                {item.title} <span className="timeline-org">· {item.org}</span>
              </h3>
              <p className="timeline-desc">{item.desc}</p>
              <div className="timeline-tags">
                {item.tags.map((t) => (
                  <span className="timeline-tag" key={t}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Experience;
