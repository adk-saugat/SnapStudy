import React from "react";

function StepCard({ step, index }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-orange-200 bg-white shadow-sm">
      <img src={step.image} alt={step.alt} className="h-44 w-full object-cover" />
      <div className="p-4">
        <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-800">
          Step {index + 1}
        </span>
        <h3 className="mt-3 text-lg font-bold">{step.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-orange-900/75">
          {step.description}
        </p>
      </div>
    </article>
  );
}

export default StepCard;
