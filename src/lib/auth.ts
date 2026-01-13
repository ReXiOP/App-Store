import { NextAuthOptions, getServerSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";
import { Adapter } from "next-auth/adapters";
import { compare } from "bcryptjs";

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(db) as Adapter,
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        }),
        {
            id: "sm40",
            name: "SM40",
            type: "oauth",
            authorization: {
                url: "https://sm40.com/oauth",
                params: {
                    app_id: process.env.SM40_APP_ID,
                    redirect_uri: "https://oauth.sm40.com",
                },
            },
            checks: [],
            token: {
                url: "https://sm40.com/authorize",
                async request(context) {
                    const response = await fetch(
                        `https://sm40.com/authorize?app_id=${context.provider.clientId}&app_secret=${context.provider.clientSecret}&code=${context.params.code}`
                    );
                    const data = await response.json();
                    // SM40 might return the token in a nested object or directly
                    const access_token = data.access_token || (data.data && data.data.access_token);
                    return { tokens: { access_token } };
                },
            },
            userinfo: {
                url: "https://sm40.com/app_api",
                async request(context) {
                    const response = await fetch(
                        `https://sm40.com/app_api?access_token=${context.tokens.access_token}&type=get_user_data`
                    );
                    const data = await response.json();
                    // Match the structure from the documentation: data.data.user_data
                    return data.data?.user_data || data.user_data || data;
                },
            },
            profile(profile) {
                return {
                    id: profile.username,
                    name: profile.name,
                    email: profile.email,
                    image: profile.avatar,
                    role: "USER"
                };
            },
            clientId: process.env.SM40_APP_ID || "",
            clientSecret: process.env.SM40_APP_SECRET || "",
        },
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials.password) {
                    return null;
                }

                const user = await db.user.findUnique({
                    where: { email: credentials.email }
                }) as any;

                if (!user || !user.password) {
                    return null;
                }

                const isPasswordValid = await compare(credentials.password, user.password);

                if (!isPasswordValid) {
                    return null;
                }

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    image: user.image,
                    role: user.role,
                };
            }
        })
    ],
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async session({ session, token }) {
            if (token && session.user && token.sub) {
                session.user.id = token.sub as string;
                // Fetch latest role from DB to verify admin status immediately
                const user = await db.user.findUnique({
                    where: { id: token.sub as string },
                    select: { role: true }
                });

                if (user) {
                    session.user.role = user.role;
                } else {
                    session.user.role = token.role as string;
                }
            }
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                token.role = (user as any).role;
            }
            // If token has sub (user ID), fetch latest role to ensure middleware sees it
            if (!user && token.sub) {
                const existingUser = await db.user.findUnique({
                    where: { id: token.sub },
                    select: { role: true }
                });
                if (existingUser) {
                    token.role = existingUser.role;
                }
            }
            return token;
        }
    },
    pages: {
        signIn: '/auth/signin',
    }
};

export const getAuthSession = () => getServerSession(authOptions);
