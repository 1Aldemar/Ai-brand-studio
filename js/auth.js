/**
 * AI Brand Studio - Auth Module
 * Handles Supabase authentication: signup, login, logout, session management
 */

// Initialize Supabase client
let supabaseClient = null;

function initSupabase() {
    if (supabaseClient) return supabaseClient;
    
    const config = window.SUPABASE_CONFIG;
    if (!config || !config.url || config.url.includes('YOUR_PROJECT')) {
        console.warn('Supabase not configured. Set credentials in js/supabase-config.js');
        return null;
    }
    
    supabaseClient = supabase.createClient(config.url, config.anonKey);
    return supabaseClient;
}

/**
 * Sign up a new user
 */
async function signUp(email, password) {
    const sb = initSupabase();
    if (!sb) {
        showAuthError('Supabase is not configured. Please set up your Supabase project first.');
        return null;
    }
    
    try {
        const { data, error } = await sb.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    tier: 'free'
                }
            }
        });
        
        if (error) throw error;
        return data;
    } catch (err) {
        console.error('Signup error:', err.message);
        showAuthError(err.message);
        return null;
    }
}

/**
 * Log in an existing user
 */
async function signIn(email, password) {
    const sb = initSupabase();
    if (!sb) {
        showAuthError('Supabase is not configured. Please set up your Supabase project first.');
        return null;
    }
    
    try {
        const { data, error } = await sb.auth.signInWithPassword({
            email: email,
            password: password
        });
        
        if (error) throw error;
        return data;
    } catch (err) {
        console.error('Login error:', err.message);
        showAuthError(err.message);
        return null;
    }
}

/**
 * Sign out the current user
 */
async function signOut() {
    const sb = initSupabase();
    if (!sb) return;
    
    try {
        const { error } = await sb.auth.signOut();
        if (error) throw error;
        window.location.href = 'login.html';
    } catch (err) {
        console.error('Logout error:', err.message);
    }
}

/**
 * Get current session
 */
async function getSession() {
    const sb = initSupabase();
    if (!sb) return null;
    
    try {
        const { data, error } = await sb.auth.getSession();
        if (error) throw error;
        return data.session;
    } catch (err) {
        console.error('Session error:', err.message);
        return null;
    }
}

/**
 * Get current authenticated user
 */
async function getCurrentUser() {
    const sb = initSupabase();
    if (!sb) return null;
    
    try {
        const { data, error } = await sb.auth.getUser();
        if (error) throw error;
        return data.user;
    } catch (err) {
        console.error('Get user error:', err.message);
        return null;
    }
}

/**
 * Protect a page — redirect to login if not authenticated
 */
async function requireAuth(redirectUrl = 'login.html') {
    const session = await getSession();
    if (!session) {
        window.location.href = redirectUrl;
        return false;
    }
    return true;
}

/**
 * Show error message on auth forms
 */
function showAuthError(message) {
    const errorEl = document.getElementById('auth-error');
    if (errorEl) {
        errorEl.textContent = message;
        errorEl.style.display = 'block';
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            errorEl.style.display = 'none';
        }, 5000);
    }
}

/**
 * Show success message on auth forms
 */
function showAuthSuccess(message) {
    const successEl = document.getElementById('auth-success');
    if (successEl) {
        successEl.textContent = message;
        successEl.style.display = 'block';
        
        setTimeout(() => {
            successEl.style.display = 'none';
        }, 5000);
    }
}

/**
 * Update nav based on auth state
 */
async function updateNavAuth() {
    const user = await getCurrentUser();
    const authLinks = document.getElementById('auth-links');
    if (!authLinks) return;
    
    if (user) {
        authLinks.innerHTML = `
            <a href="dashboard.html">Dashboard</a>
            <a href="#" onclick="signOut(); return false;" style="color: var(--accent-color);">Logout</a>
        `;
    } else {
        authLinks.innerHTML = `
            <a href="login.html">Login</a>
            <a href="signup.html" class="btn btn-outline" style="padding: 0.5rem 1.5rem;">Sign Up</a>
        `;
    }
}