'use client';

import { useState } from 'react';
import ApplyNow from '../applyNow';

function monthlyPayment(principal, months, apr) {
  const i = apr / 12;
  return (principal * i) / (1 - Math.pow(1 + i, -months));
}

const usd = new Intl.NumberFormat('en-US');
const fmtUSD = (n) => '$' + usd.format(Math.round(n));

export default function EstimationBlock({ eyebrow, heading, subText, details, calcEyebrow, calcHeading, minFinanced, maxFinanced, apr, terms, disclaimer }) {
  const STEP = 5000;
  const [financed, setFinanced] = useState(() => {
    const raw = minFinanced + 0.25 * (maxFinanced - minFinanced);
    return Math.round(raw / STEP) * STEP;
  });
  const [months, setMonths] = useState(terms?.[0]?.months);

  const monthly = months ? monthlyPayment(financed, months, apr / 100) : 0;

  return (
    <section className="estimator p30 py70 flex align-center gap-50 justify-center m-flex-col">
      <Content eyebrow={eyebrow} heading={heading} subText={subText} details={details} />
      <Calculator calcEyebrow={calcEyebrow} calcHeading={calcHeading} minFinanced={minFinanced} maxFinanced={maxFinanced} financed={financed} setFinanced={setFinanced} terms={terms} months={months} setMonths={setMonths} monthly={monthly} disclaimer={disclaimer} />
    </section>
  );
}

function Content({ eyebrow, heading, subText, details }) {
  return (
    <div className="flex flex-col gap-40 max-700">
      <div className="flex flex-col gap-15">
        <div className='fade--in' data-sal>
          {eyebrow && <span className="eyebrow">{eyebrow}</span>}
          {heading && <h2 className="h2">{heading}</h2>}
        </div>
        {subText && <p className="fade--in" data-sal>{subText}</p>}
      </div>
      <div className='flex flex-col gap-20'>
        <div className="line" data-sal />
        {details?.length > 0 && (
          <div className="flex gap-30 fade--in" data-sal>
            {details.map((item, i) => (
              <div key={i}>
                <p className="h5">{item.value}</p>
                <p className="f-12 text-silk-dim">{item.label}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Calculator({ calcEyebrow, calcHeading, minFinanced, maxFinanced, financed, setFinanced, terms, months, setMonths, monthly, disclaimer }) {
  return (
    <div className="p30 bg-silk radius-5 flex flex-col gap-20 max-600">
      <div>
        {calcEyebrow && <div className="eyebrow">{calcEyebrow}</div>}
        {calcHeading && <h3 className="h5 text-midnight">{calcHeading}</h3>}
      </div>
      <div className="flex flex-col gap-15">
        <div className="flex flex-col gap-5">
          <label className="flex space-between" htmlFor="estimator-amount">
            <p className="f-12 text-ink-dim uppercase weight-600">Amount Financed</p>
            <p className="text-flame f-14 weight-900">{fmtUSD(financed)}</p>
          </label>
          <input className="" id="estimator-amount" type="range" min={minFinanced} max={maxFinanced} step="5000" value={financed} onChange={(e) => setFinanced(Number(e.target.value))} />
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
      </div>
      <div className="flex flex-col gap-15">
        <div className="p20 bg-midnight flex space-between align-center radius-5">
          <div className="flex flex-col gap-10">
            <div className="f-12 text-silk-dim uppercase weight-600">Estimated Monthly</div>
            <div className="flex align-baseline gap-10">
              <p className="h3">{fmtUSD(monthly)}</p>
              <p className="text-silk-dim f-14 weight-500">/mo</p>
            </div>
          </div>
          <ApplyNow />
        </div>
        {disclaimer && <p className="disclaimer">{disclaimer}</p>}
      </div>
    </div>
  );
}
