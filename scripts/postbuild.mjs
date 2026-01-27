import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { dirname } from 'node:path'

const nftTarget = '.next/server/middleware.js.nft.json'
const middlewareTarget = '.next/server/middleware.js'

if (!existsSync(nftTarget)) {
  mkdirSync(dirname(nftTarget), { recursive: true })
  writeFileSync(nftTarget, JSON.stringify({ version: 1, files: [] }))
  console.log(`[postbuild] Created missing ${nftTarget}`)
}

if (!existsSync(middlewareTarget)) {
  mkdirSync(dirname(middlewareTarget), { recursive: true })
  writeFileSync(
    middlewareTarget,
    `const { NextResponse } = require('next/server');
const { jwtVerify } = require('jose');

const SECRET_KEY = process.env.SESSION_SECRET || 'fallback-secret-for-build-only';
const key = new TextEncoder().encode(SECRET_KEY);

async function getSessionUser(request) {
  const token = request.cookies.get('session')?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, key, { algorithms: ['HS256'] });
    return (payload?.user) ?? null;
  } catch {
    return null;
  }
}

async function middleware(request) {
  const { pathname, search } = request.nextUrl;

  if (pathname.startsWith('/storybook')) {
    const user = await getSessionUser(request);

    if (!user) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('next', \\`${'${'}pathname}${'${'}search}\\`);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

module.exports = middleware;
module.exports.middleware = middleware;
module.exports.default = middleware;
`
  );
  console.log(`[postbuild] Created missing ${middlewareTarget}`)
}
