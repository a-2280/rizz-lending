'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { PortableText } from 'next-sanity';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useHubspotForm } from '@/lib/useHubspotForm';

const headingComponents = {
  block: {
    normal: ({ children }) => children,
  },
  marks: {
    textColor: ({ children, value }) => <span style={{ color: `var(--${value.color})` }}>{children}</span>,
  },
};

// Same options as the Dealers page form — only rendered when showEntityType /
// showVolume are on, and only meaningful for the 'dealer' HubSpot form, which
// is the only one that defines these two properties. See hubspot-form-fields.md.
const ENTITY_TYPES = ['Franchise', 'Independent', 'Marketplace', 'Broker'];
// Hyphens, not en dashes — HubSpot matches these byte-for-byte.
const VOLUMES = ['1-5 units', '6-15 units', '16-40 units', '40+ units'];

export default function HeroFormBlock({ eyebrow, eyebrowColor, heading, subText, image, video, formHeading, formSubtext, submitLabel, entityLabel, showEntityType, showVolume, hubspotForm }) {
  const imageUrl = image?.asset?.url;
  const videoUrl = video?.asset?.url;
  const sectionRef = useRef(null);
  const mediaRef = useRef(null);

  useEffect(() => {
    if (!mediaRef.current || !sectionRef.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.to(mediaRef.current, {
        y: '15%',
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section className="hero pos-rel pth bg-glow" ref={sectionRef}>
      <div className="background-media pos-rel">
        {(imageUrl || videoUrl) && (
          <div className="bg-image" style={{ top: '-15%', height: '115%' }} ref={mediaRef}>
            {imageUrl ? <Image className="bg-image" src={imageUrl} alt="" fill></Image> : ''}
            {videoUrl ? <video className="bg-image" src={videoUrl} autoPlay muted loop playsInline /> : ''}
          </div>
        )}
      </div>
      {(imageUrl || videoUrl) && <div className="hero-scrim" />}
      <div className="flex align-center p30 py70 gap-50 z-3 pos-rel fade--in" data-sal>
        <Content eyebrow={eyebrow} eyebrowColor={eyebrowColor} heading={heading} subText={subText} />
        <div className="flex-1 flex justify-center">
          <Form formHeading={formHeading} formSubtext={formSubtext} submitLabel={submitLabel} entityLabel={entityLabel || 'Dealership'} showEntityType={showEntityType} showVolume={showVolume} hubspotForm={hubspotForm || 'dealer'} />
        </div>
      </div>
    </section>
  );
}

function Content({ eyebrow, eyebrowColor, heading, subText }) {
  return (
    <div className="flex flex-col gap-15 max-700">
      <div>
        {eyebrow && <p className={eyebrowColor === 'light' ? 'eyebrow eyebrow-light' : 'eyebrow eyebrow-orange'}>{eyebrow}</p>}
        <h1 className="h1">{heading && <PortableText value={heading} components={headingComponents} />}</h1>
      </div>
      {subText && <p className="max-500 text-balanced">{subText}</p>}
    </div>
  );
}

function Form({ formHeading, formSubtext, submitLabel, entityLabel, showEntityType, showVolume, hubspotForm }) {
  const initialValues = {
    company: '',
    firstname: '',
    email: '',
    phone: '',
    ...(showEntityType ? { dealership_type: ENTITY_TYPES[0] } : {}),
    ...(showVolume ? { monthly_exotic_volume: VOLUMES[0] } : {}),
    message: '',
  };

  const { values, errors, status, update, handleSubmit } = useHubspotForm({
    initialValues,
    requiredFields: ['company', 'firstname', 'email', 'phone'],
    formKey: hubspotForm,
  });

  const submitting = status === 'submitting';
  const succeeded = status === 'success';
  const idPrefix = `${hubspotForm}-hero`;
  const entityPlaceholder = `you@${entityLabel.toLowerCase()}.com`;

  return (
    <div className="radius-10 bg-silk p30 flex flex-col gap-20 max-600 w-100">
      {(formHeading || formSubtext) && (
        <div className="flex flex-col gap-5">
          {formHeading && <h3 className="h5 text-midnight">{formHeading}</h3>}
          {formSubtext && <p className="f-14 text-ink-dim">{formSubtext}</p>}
        </div>
      )}
      <form className="flex flex-col gap-20" onSubmit={handleSubmit} noValidate>
        <div className="flex gap-15 m-flex-col">
          <div className="flex-1 flex flex-col gap-5">
            <label className="form-label" htmlFor={`${idPrefix}-company`}>
              {entityLabel} name
            </label>
            <input id={`${idPrefix}-company`} name="company" className="form-input" type="text" placeholder="Rizz Motorsports" value={values.company} onChange={update('company')} aria-invalid={errors.company ? 'true' : undefined} />
            {errors.company && <span className="form-error">{errors.company}</span>}
          </div>
          <div className="flex-1 flex flex-col gap-5">
            <label className="form-label" htmlFor={`${idPrefix}-firstname`}>
              Your name
            </label>
            <input id={`${idPrefix}-firstname`} name="firstname" className="form-input" type="text" placeholder="First & last" value={values.firstname} onChange={update('firstname')} aria-invalid={errors.firstname ? 'true' : undefined} />
            {errors.firstname && <span className="form-error">{errors.firstname}</span>}
          </div>
        </div>
        <div className="flex gap-15 m-flex-col">
          <div className="flex-1 flex flex-col gap-5">
            <label className="form-label" htmlFor={`${idPrefix}-email`}>
              Email
            </label>
            <input id={`${idPrefix}-email`} name="email" className="form-input" type="email" placeholder={entityPlaceholder} value={values.email} onChange={update('email')} aria-invalid={errors.email ? 'true' : undefined} />
            {errors.email && <span className="form-error">{errors.email}</span>}
          </div>
          <div className="flex-1 flex flex-col gap-5">
            <label className="form-label" htmlFor={`${idPrefix}-phone`}>
              Phone
            </label>
            <input id={`${idPrefix}-phone`} name="phone" className="form-input" type="text" placeholder="(555) 000-0000" value={values.phone} onChange={update('phone')} aria-invalid={errors.phone ? 'true' : undefined} />
            {errors.phone && <span className="form-error">{errors.phone}</span>}
          </div>
        </div>
        {(showEntityType || showVolume) && (
          <div className="flex gap-15 m-flex-col">
            {showEntityType && (
              <div className="flex-1 flex flex-col gap-5">
                <label className="form-label" htmlFor={`${idPrefix}-type`}>
                  {entityLabel} type
                </label>
                <select id={`${idPrefix}-type`} name="dealership_type" className="form-input" value={values.dealership_type} onChange={update('dealership_type')}>
                  {ENTITY_TYPES.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            )}
            {showVolume && (
              <div className="flex-1 flex flex-col gap-5">
                <label className="form-label" htmlFor={`${idPrefix}-volume`}>
                  Monthly exotic volume
                </label>
                <select id={`${idPrefix}-volume`} name="monthly_exotic_volume" className="form-input" value={values.monthly_exotic_volume} onChange={update('monthly_exotic_volume')}>
                  {VOLUMES.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        )}
        <div className="flex flex-col gap-10">
          <label className="form-label" htmlFor={`${idPrefix}-message`}>
            Anything else?
          </label>
          <textarea id={`${idPrefix}-message`} name="message" className="form-input" placeholder="Tell us a bit more." value={values.message} onChange={update('message')} />
        </div>
        {status === 'error' && <p className="form-error">Something went wrong — please try again or email us directly.</p>}
        {succeeded ? (
          <p className="form-success" role="status">
            Thanks — we&rsquo;ll be in touch.
          </p>
        ) : (
          <button type="submit" className="button-1 w-100 text-center justify-center flex" disabled={submitting}>
            {submitting ? 'Sending…' : submitLabel || 'Submit inquiry'}
          </button>
        )}
      </form>
    </div>
  );
}
