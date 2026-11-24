export default async function noindexNetlifyApp(request, context) {
  const response = await context.next();
  if (new URL(request.url).hostname.endsWith('.netlify.app')) response.headers.set('X-Robots-Tag', 'noindex');
  return response;
}

export const config = {
  path: '/*',
  excludedPath: ['/_next/static/*'],
};
