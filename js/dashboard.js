/**
 * AI Brand Studio - Dashboard Module
 * Loads usage data and renders tier-based limit indicators
 */

async function loadDashboard() {
    const sb = initSupabase();
    if (!sb) {
        document.getElementById('dashboard-content').innerHTML = `
            <div style="text-align: center; padding: 4rem;">
                <h2 style="color: var(--accent-color); margin-bottom: 1rem;">Configuration Required</h2>
                <p style="color: var(--muted-text);">Supabase is not configured yet. Set your credentials in <code>js/supabase-config.js</code>.</p>
            </div>
        `;
        return;
    }

    // Get current user
    const user = await getCurrentUser();
    if (!user) return;

    // Get user's profile from Supabase
    const { data: profile, error } = await sb
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    const tier = (profile && profile.tier) || 'free';
    const config = window.SUPABASE_CONFIG;
    const tierConfig = config.tiers[tier] || config.tiers.free;

    // Get usage counts
    const { data: usageData } = await sb
        .from('usage_logs')
        .select('resource_type')
        .eq('user_id', user.id);

    // Count usage per resource type
    const usage = { logo: 0, mockup: 0, tech_pack: 0, description: 0 };
    if (usageData) {
        usageData.forEach(log => {
            if (usage.hasOwnProperty(log.resource_type)) {
                usage[log.resource_type]++;
            }
        });
    }

    // Render user info
    document.getElementById('user-email').textContent = user.email;
    document.getElementById('user-tier').textContent = tierConfig.label;
    document.getElementById('user-tier-price').textContent = tierConfig.price;

    // Render usage cards
    const usageGrid = document.getElementById('usage-grid');
    usageGrid.innerHTML = '';

    const entries = Object.entries(tierConfig.limits);
    entries.forEach(([key, limit]) => {
        const used = usage[key] || 0;
        const total = limit.total;
        const isUnlimited = total === -1;
        const remaining = isUnlimited ? '∞' : Math.max(0, total - used);
        const percentUsed = isUnlimited ? 0 : (total > 0 ? (used / total) * 100 : 0);
        const isOverLimit = !isUnlimited && total > 0 && used >= total;

        const card = document.createElement('div');
        card.className = 'usage-card';
        if (isOverLimit) card.classList.add('usage-card--exhausted');

        card.innerHTML = `
            <div class="usage-card-header">
                <h3 class="usage-card-title">${limit.label}</h3>
                <div class="usage-card-badge ${isOverLimit ? 'badge--exhausted' : ''}">
                    ${isOverLimit ? 'Exhausted' : (isUnlimited ? 'Unlimited' : 'Active')}
                </div>
            </div>
            <div class="usage-card-stats">
                <span class="usage-count">${used}</span>
                <span class="usage-separator">/</span>
                <span class="usage-total ${isUnlimited ? 'unlimited' : ''}">${isUnlimited ? '∞' : total}</span>
                <span class="usage-label">used</span>
            </div>
            ${!isUnlimited ? `
                <div class="usage-bar-track">
                    <div class="usage-bar-fill" style="width: ${Math.min(percentUsed, 100)}%"></div>
                </div>
                <div class="usage-remaining">
                    ${remaining} remaining this month
                </div>
            ` : `
                <div class="usage-unlimited-note">No limits on this tier</div>
            `}
        `;

        usageGrid.appendChild(card);
    });

    // Upgrade prompt for free tier
    if (tier === 'free') {
        document.getElementById('upgrade-prompt').style.display = 'block';
    } else {
        document.getElementById('upgrade-prompt').style.display = 'none';
    }
}

// Auto-load dashboard on page ready
document.addEventListener('DOMContentLoaded', async () => {
    // Protect this page
    const authenticated = await requireAuth();
    if (!authenticated) return;

    // Wait for Supabase SDK (loaded from CDN)
    if (typeof supabase === 'undefined') {
        // Load Supabase client dynamically if not present
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
        script.onload = loadDashboard;
        document.head.appendChild(script);
    } else {
        loadDashboard();
    }
});