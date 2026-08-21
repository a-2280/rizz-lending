'use client';

import Link from 'next/link';
import { useState } from 'react';

function monthlyPayment(principal, months, apr) {
  const i = apr / 12;
  return (principal * i) / (1 - Math.pow(1 + i, -months));
}

const usd = new Intl.NumberFormat('en-US');
const fmtUSD = (n) => '$' + usd.format(Math.round(n));

export default function ApplyEstimatorBlock({ eyebrow, heading, subText, calcEyebrow, calcHeading, vehicleLabel, vehiclePlaceholder, minFinanced, maxFinanced, apr, terms, continueLabel, disclaimer }) {
  const STEP = 5000;
  const [financed, setFinanced] = useState(() => {
    const raw = minFinanced + 0.25 * (maxFinanced - minFinanced);
    return Math.round(raw / STEP) * STEP;
  });
  const [months, setMonths] = useState(terms?.[0]?.months);

  const monthly = months ? monthlyPayment(financed, months, apr / 100) : 0;

  return (
    <section className="estimator account-login p30 py70 flex justify-center text-center">
      <div className="pth max-1400 flex flex-col gap-70 align-center">
        {(eyebrow || heading || subText) && (
          <div className="flex flex-col gap-20 max-600 fade--in" data-sal>
            <div className="flex flex-col gap-10">
              {eyebrow && <span className="eyebrow">{eyebrow}</span>}
              {heading && <h2 className="h2">{heading}</h2>}
            </div>
            {subText && <p className="text-silk-dim">{subText}</p>}
          </div>
        )}
        <div className="w-100 max-500 radius-10 bg-silk text-ink-dim p30 flex flex-col gap-20 text-left">
          {(calcEyebrow || calcHeading) && (
            <div className="flex flex-col gap-5">
              {calcEyebrow && <span className="eyebrow">{calcEyebrow}</span>}
              {calcHeading && <h2 className="h5 weight-700 text-carbon">{calcHeading}</h2>}
            </div>
          )}
          <div className="flex flex-col gap-5">
            <label className="form-label">{vehicleLabel}</label>
            <input className="form-input" type="text" placeholder={vehiclePlaceholder} />
          </div>
          <div className="flex flex-col gap-5">
            <label className="flex space-between" htmlFor="apply-estimator-amount">
              <p className="f-12 text-ink-dim uppercase weight-600">Amount Financed</p>
              <p className="text-flame f-14 weight-900">{fmtUSD(financed)}</p>
            </label>
            <input id="apply-estimator-amount" type="range" min={minFinanced} max={maxFinanced} step="5000" value={financed} onChange={(e) => setFinanced(Number(e.target.value))} />
          </div>
          <div className="flex flex-col gap-10">
            <label className="f-12 text-ink-dim uppercase weight-600">Term</label>
            <div className="flex space-between gap-5">
              {terms?.map((term) => (
                <button key={term.months} type="button" className={`term-button ${term.months === months ? 'on' : ''}`} onClick={() => setMonths(term.months)}>
                  {term.months} mo
                </button>
              ))}
            </div>
          </div>
          <div className="p20 bg-midnight flex flex-col gap-10 radius-5">
            <div className="f-12 text-silk-dim uppercase weight-600">Estimated Monthly</div>
            <div className="flex align-baseline gap-10">
              <p className="h3 text-silk">{fmtUSD(monthly)}</p>
              <p className="text-silk-dim f-14 weight-500">/mo</p>
            </div>
          </div>
          <Link href="#" className="button-1 w-100 text-center justify-center flex">
            {continueLabel}
          </Link>
          {disclaimer && <p className="disclaimer">{disclaimer}</p>}
        </div>
      </div>
    </section>
  );
}
