import { NextAuthConfig } from "next-auth";

export const authConfig = {
    pages: {
        signIn: '/login',
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnLists = nextUrl.pathname === '/' || nextUrl.pathname.startsWith('/lista');
            if(isOnLists) {
                if(isLoggedIn) return true;
                return false;
            } else if (isLoggedIn && nextUrl.pathname === '/login') {
                return Response.redirect(new URL('/', nextUrl));
            }
            return true;
        },
        async jwt({ token, user }) {
            if(user) {
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            if(token) {
                session.user.id = token.id as string;
            }
            return session;
        }
    },
    providers: []
} satisfies NextAuthConfig;