import { type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';
import { createClient } from '@/lib/supabase/server';

export async function middleware(request: NextRequest) {
  // update session
  const res = await updateSession(request);
  
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  const { pathname } = request.nextUrl;
  
  // Proteksi dashboard routes
  if (pathname.startsWith('/dashboard/')) {
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    // Dapatkan role user dari profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
    
    if (pathname.startsWith('/dashboard/admin') && profile?.role !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url));
    }
    if (pathname.startsWith('/dashboard/seller') && profile?.role !== 'seller') {
      return NextResponse.redirect(new URL('/', request.url));
    }
    if (pathname.startsWith('/dashboard/buyer') && profile?.role !== 'buyer') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }
  
  return res;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};