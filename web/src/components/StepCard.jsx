import React from "react";

function StepCard({ step, index }) {
  return (
    <article className="surface overflow-hidden">
      <img src={step.image} alt={step.alt} className="h-36 w-full object-cover" />
      <div className="p-4">
        <span className="rounded bg-orange-100 px-2 py-1 text-xs font-medium text-orange-800">
          Step {index + 1}
        </span>
        <h3 className="mt-2 text-base font-semibold">{step.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-orange-900/75">
          {step.description}
        </p>
      </div>
    </article>
  );
}

export default StepCard;
