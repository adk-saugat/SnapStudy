import React from "react";

function DashboardStats({ stats }) {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {stats.map((stat) => (
        <article key={stat.label} className="surface p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-orange-700">
            {stat.label}
          </p>
          <p className="mt-2 text-4xl font-bold text-orange-950">{stat.value}</p>
          <p className="mt-1 text-sm text-orange-900/70">{stat.subtitle}</p>
        </article>
      ))}
    </section>
  );
}

export default DashboardStats;
