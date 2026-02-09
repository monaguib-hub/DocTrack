import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Email domain restriction
const ALLOWED_DOMAIN = '@eagle.org';

/**
 * Validates if email has the allowed domain
 */
export function validateEmailDomain(email: string): boolean {
    return email.toLowerCase().endsWith(ALLOWED_DOMAIN.toLowerCase());
}

/**
 * Get Supabase client for browser
 */
export function getSupabaseBrowserClient() {
    return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

/**
 * Sign up a new user with email domain validation
 */
export async function signUp(email: string, password: string) {
    // Validate email domain first
    if (!validateEmailDomain(email)) {
        return {
            error: {
                message: `Only ${ALLOWED_DOMAIN} email addresses are allowed to register.`
            }
        };
    }

    const supabase = getSupabaseBrowserClient();

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
        }
    });

    return { data, error };
}

/**
 * Sign in an existing user
 */
export async function signIn(email: string, password: string) {
    const supabase = getSupabaseBrowserClient();

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    return { data, error };
}

/**
 * Sign out the current user
 */
export async function signOut() {
    const supabase = getSupabaseBrowserClient();
    const { error } = await supabase.auth.signOut();
    return { error };
}

/**
 * Get the current user session
 */
export async function getCurrentUser() {
    const supabase = getSupabaseBrowserClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    return { user, error };
}
