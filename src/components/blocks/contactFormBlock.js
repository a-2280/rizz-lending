'use client';

import { useHubspotForm } from '@/lib/useHubspotForm';

const INITIAL_VALUES = {
  firstname: '',
  email: '',
  phone: '',
  message: '',
};

export default function ContactFormBlock({ formHeading, formSubtext, submitLabel }) {
  const { values, errors, status, update, handleSubmit } = useHubspotForm({
    initialValues: INITIAL_VALUES,
    requiredFields: ['firstname', 'email'],
    formKey: 'contact',
  });

  const submitting = status === 'submitting';
  const succeeded = status === 'success';

  return (
    <section id="contact-form" className="contact-form-block h-100vh pth bg-midnight text-silk">
      <div className="h-100 p30 flex justify-center align-center">
        <div className="radius-10 bg-silk bg-shadow p30 flex flex-col gap-20 max-600 w-100 fade--in" data-sal>
          {(formHeading || formSubtext) && (
            <div className="flex flex-col gap-5">
              {formHeading && <h3 className="h5 text-midnight">{formHeading}</h3>}
              {formSubtext && <p className="f-14 text-ink-dim">{formSubtext}</p>}
            </div>
          )}
          <form className="flex flex-col gap-20" onSubmit={handleSubmit} noValidate>
            <div className="flex gap-15 m-flex-col">
              <div className="flex-1 flex flex-col gap-5">
                <label className="form-label" htmlFor="contact-firstname">
                  Your name
                </label>
                <input id="contact-firstname" name="firstname" className="form-input" type="text" placeholder="First & last" value={values.firstname} onChange={update('firstname')} aria-invalid={errors.firstname ? 'true' : undefined} />
                {errors.firstname && <span className="form-error">{errors.firstname}</span>}
              </div>
              <div className="flex-1 flex flex-col gap-5">
                <label className="form-label" htmlFor="contact-email">
                  Email
                </label>
                <input id="contact-email" name="email" className="form-input" type="email" placeholder="you@email.com" value={values.email} onChange={update('email')} aria-invalid={errors.email ? 'true' : undefined} />
                {errors.email && <span className="form-error">{errors.email}</span>}
              </div>
            </div>
            <div className="flex flex-col gap-5">
              <label className="form-label" htmlFor="contact-phone">
                Phone
              </label>
              <input id="contact-phone" name="phone" className="form-input" type="text" placeholder="(555) 000-0000" value={values.phone} onChange={update('phone')} aria-invalid={errors.phone ? 'true' : undefined} />
              {errors.phone && <span className="form-error">{errors.phone}</span>}
            </div>
            <div className="flex flex-col gap-10">
              <label className="form-label" htmlFor="contact-message">
                Message
              </label>
              <textarea id="contact-message" name="message" className="form-input" placeholder="How can we help?" value={values.message} onChange={update('message')} />
            </div>
            {status === 'error' && <p className="form-error">Something went wrong — please try again or email us directly.</p>}
            {succeeded ? (
              <p className="form-success" role="status">
                Thanks — we&rsquo;ll be in touch.
              </p>
            ) : (
              <button type="submit" className="button-1 w-100 text-center justify-center flex" disabled={submitting}>
                {submitting ? 'Sending…' : submitLabel || 'Send message'}
              </button>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
