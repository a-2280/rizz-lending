'use client';

import { useRef, useState } from 'react';
import gsap from 'gsap';
import { useHubspotForm } from '@/lib/useHubspotForm';

// HubSpot field mapping — formKey 'dealers'.
//
// CHECK THESE against the client's HubSpot form definition when the embed code
// arrives. A name here that doesn't exist on the HubSpot form produces a
// FIELD_NOT_IN_FORM_DEFINITION error (surfaced, not swallowed — see /api/hubspot).
//
//   UI label              -> field name             -> confidence
//   Dealership name       -> company                 HubSpot default property
//   Your name             -> firstname               GUESS: single field, HubSpot usually splits firstname/lastname
//   Email                 -> email                   HubSpot default property
//   Phone                 -> phone                   HubSpot default property
//   Dealership type       -> dealership_type         GUESS: custom property; option values below must match HubSpot's internal values
//   Monthly exotic volume -> monthly_exotic_volume   GUESS: custom property; option values below must match HubSpot's internal values
//   Anything else?        -> message                 HubSpot default property
//
// Select option values currently use the visible label text. If HubSpot's
// dropdown uses slugged internal values, change the `value` attributes only.

const DEALERSHIP_TYPES = ['Franchise exotic / luxury', 'Independent specialist', 'Pre-owned / consignment', 'Classic / collector', 'Marketplace / auction', 'Broker / finder'];
const MONTHLY_VOLUMES = ['1–5 units', '6–15 units', '16–40 units', '40+ units'];

const EMPTY = {
  company: '',
  firstname: '',
  email: '',
  phone: '',
  dealership_type: DEALERSHIP_TYPES[0],
  monthly_exotic_volume: MONTHLY_VOLUMES[0],
  message: '',
};

function validate(values) {
  const errors = {};
  if (!values.company.trim()) errors.company = 'Required';
  if (!values.firstname.trim()) errors.firstname = 'Required';
  if (!values.email.trim()) errors.email = 'Required';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) errors.email = 'Enter a valid email address';
  return errors;
}

export default function DealerFaqFormBlock({ eyebrow, heading, description, items, formHeading, formSubtext, submitLabel }) {
  const [openKeys, setOpenKeys] = useState(() => new Set());
  const hasItems = items?.length > 0;
  const answerRefs = useRef(new Map());
  const iconRefs = useRef(new Map());

  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const { submit, status, error } = useHubspotForm('dealers');

  function toggle(key) {
    const isOpen = openKeys.has(key);
    const answerEl = answerRefs.current.get(key);
    const iconEl = iconRefs.current.get(key);

    gsap.to(answerEl, { height: isOpen ? 0 : answerEl.scrollHeight, opacity: isOpen ? 0 : 1, duration: 0.3, ease: 'power2.inOut' });
    gsap.to(iconEl, { rotate: isOpen ? 0 : 45, duration: 0.3, ease: 'power2.inOut' });

    setOpenKeys((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  }

  function update(name) {
    return (e) => {
      const { value } = e.target;
      setValues((prev) => ({ ...prev, [name]: value }));
      setErrors((prev) => (prev[name] ? { ...prev, [name]: undefined } : prev));
    };
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    await submit(values);
  }

  const submitting = status === 'submitting';

  return (
    <section id="form" className="dealer-faq-form bg-silk text-ink-dim p30 py70 flex justify-center">
      <div className="flex gap-40 max-1400 m-flex-col">
        <div className="flex-1 flex flex-col gap-30">
          {(eyebrow || heading || description) && (
            <div className="flex flex-col gap-10 fade--in" data-sal>
              {eyebrow && <span className="eyebrow">{eyebrow}</span>}
              {heading && <h2 className="h2 text-carbon">{heading}</h2>}
              {description && <p>{description}</p>}
            </div>
          )}
          {hasItems && (
            <div>
              <div className="line-static-d" />
              {items.map((item) => {
                const isOpen = openKeys.has(item._key);
                return (
                  <div className={`line-static-d ${isOpen ? 'open' : ''}`} key={item._key}>
                    <button type="button" className="py20 w-100 f-20 weight-600 text-carbon flex align-center space-between gap-20" onClick={() => toggle(item._key)}>
                      <span className="f-display fade--in" data-sal>
                        {item.question}
                      </span>
                      <span
                        className="text-flame f-25"
                        ref={(el) => {
                          if (el) iconRefs.current.set(item._key, el);
                        }}
                      >
                        +
                      </span>
                    </button>
                    <div
                      className="overflow h-0 op-0"
                      ref={(el) => {
                        if (el) answerRefs.current.set(item._key, el);
                      }}
                    >
                      <p className="pb20">{item.answer}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <div className="flex-1">
          <div className="radius-10 bg-shadow p30 flex flex-col gap-20">
            <div className="flex flex-col gap-5">
              {formHeading && <h3 className="h5 text-midnight">{formHeading}</h3>}
              {formSubtext && <p className="f-14">{formSubtext}</p>}
            </div>
            {status === 'success' ? (
              <p className="form-success">Thanks — we&rsquo;ll be in touch.</p>
            ) : (
              <form className="flex flex-col gap-20" onSubmit={handleSubmit} noValidate>
                <div className="flex gap-15 m-flex-col">
                  <div className="flex-1 flex flex-col gap-5">
                    <label className="form-label" htmlFor="dealer-company">
                      Dealership name
                    </label>
                    <input id="dealer-company" name="company" className="form-input" type="text" placeholder="Rizz Motorsports" value={values.company} onChange={update('company')} aria-invalid={errors.company ? 'true' : undefined} />
                    {errors.company && <span className="form-error">{errors.company}</span>}
                  </div>
                  <div className="flex-1 flex flex-col gap-5">
                    <label className="form-label" htmlFor="dealer-firstname">
                      Your name
                    </label>
                    <input id="dealer-firstname" name="firstname" className="form-input" type="text" placeholder="First & last" value={values.firstname} onChange={update('firstname')} aria-invalid={errors.firstname ? 'true' : undefined} />
                    {errors.firstname && <span className="form-error">{errors.firstname}</span>}
                  </div>
                </div>
                <div className="flex gap-15 m-flex-col">
                  <div className="flex-1 flex flex-col gap-5">
                    <label className="form-label" htmlFor="dealer-email">
                      Email
                    </label>
                    <input id="dealer-email" name="email" className="form-input" type="email" placeholder="you@dealership.com" value={values.email} onChange={update('email')} aria-invalid={errors.email ? 'true' : undefined} />
                    {errors.email && <span className="form-error">{errors.email}</span>}
                  </div>
                  <div className="flex-1 flex flex-col gap-5">
                    <label className="form-label" htmlFor="dealer-phone">
                      Phone
                    </label>
                    <input id="dealer-phone" name="phone" className="form-input" type="text" placeholder="(555) 000-0000" value={values.phone} onChange={update('phone')} />
                  </div>
                </div>
                <div className="flex gap-15 m-flex-col">
                  <div className="flex-1 flex flex-col gap-5">
                    <label className="form-label" htmlFor="dealer-type">
                      Dealership type
                    </label>
                    <select id="dealer-type" name="dealership_type" className="form-input" value={values.dealership_type} onChange={update('dealership_type')}>
                      {DEALERSHIP_TYPES.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex-1 flex flex-col gap-5">
                    <label className="form-label" htmlFor="dealer-volume">
                      Monthly exotic volume
                    </label>
                    <select id="dealer-volume" name="monthly_exotic_volume" className="form-input" value={values.monthly_exotic_volume} onChange={update('monthly_exotic_volume')}>
                      {MONTHLY_VOLUMES.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex flex-col gap-10">
                  <label className="form-label" htmlFor="dealer-message">
                    Anything else?
                  </label>
                  <textarea id="dealer-message" name="message" className="form-input" placeholder="Inventory mix, current lender pain points, etc." value={values.message} onChange={update('message')} />
                </div>
                {status === 'error' && <p className="form-error">{error?.error === 'not_configured' ? error.message : 'Something went wrong — please try again or email us directly.'}</p>}
                <button type="submit" className="button-1 w-100 text-center justify-center flex" disabled={submitting}>
                  {submitting ? 'Sending…' : submitLabel || 'Submit inquiry'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
