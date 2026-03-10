import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl
  const isLoginPage = pathname === '/login'
  const isAuthCallback = pathname.startsWith('/auth/callback')
  const isAdminRoute = pathname.startsWith('/admin')
  const isVaultRoute = pathname.startsWith('/vault') || pathname === '/'

  if (isAuthCallback) {
    return supabaseResponse
  }

  if (isLoginPage && user) {
    // If we have a user, check their metadata to see their role/company
    const companyId = user.user_metadata?.company_id
    if (companyId === 'admin') {
      return NextResponse.redirect(new URL('/admin', request.url))
    } else {
      return NextResponse.redirect(new URL(`/vault/${companyId || ''}`, request.url))
    }
  }

  if (!user && (isAdminRoute || isVaultRoute)) {
    // no user, potentially respond by redirecting the user to the login page
    // Bypassed for testing purposes
    // return NextResponse.redirect(new URL('/login', request.url))
  }

  if (user && isAdminRoute) {
    const companyId = user.user_metadata?.company_id
    if (companyId !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  // If visiting the root vault path without a specific company Id, redirect them dynamically 
  // to their assigned vault.
  if (user && pathname === '/') {
      const companyId = user.user_metadata?.company_id
      if (companyId === 'admin') {
          return NextResponse.redirect(new URL('/admin', request.url))
      }
      if (companyId) {
        return NextResponse.redirect(new URL(`/vault/${companyId}`, request.url))
      }
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is. If you're
  // creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return supabaseResponse
}
