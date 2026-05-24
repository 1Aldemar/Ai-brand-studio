/**
 * AI Brand Studio - Supabase Configuration
 * 
 * HOW TO SET UP SUPABASE:
 * 1. Go to https://supabase.com and create a new project
 * 2. Get your project URL and anon/public key from Settings → API
 * 3. Replace the values below
 * 4. Run supabase-schema.sql in Supabase SQL Editor
 * 5. Enable "Allow new users to sign up" in Authentication → Settings
 */

const SUPABASE_CONFIG = {
    // ⚠️ REPLACE THESE with your actual Supabase project credentials
    url: 'https://YOUR_PROJECT.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.YOUR_ANON_KEY_HERE',
    
    // Tier definitions with per-month limits
    tiers: {
        free: {
            label: 'Free',
            price: '$0',
            limits: {
                logo: { total: 1, label: 'Logo Concepts' },
                mockup: { total: 2, label: 'Mockups' },
                tech_pack: { total: 0, label: 'Tech Packs' },
                description: { total: 0, label: 'Product Descriptions' }
            }
        },
        starter: {
            label: 'Starter',
            price: '$49/mo',
            limits: {
                logo: { total: 5, label: 'Logo Concepts' },
                mockup: { total: 10, label: 'Mockups' },
                tech_pack: { total: 1, label: 'Tech Packs' },
                description: { total: 10, label: 'Product Descriptions' }
            }
        },
        growth: {
            label: 'Growth',
            price: '$199/mo',
            limits: {
                logo: { total: -1, label: 'Logo Concepts' },     // -1 = unlimited
                mockup: { total: 50, label: 'Mockups' },
                tech_pack: { total: 5, label: 'Tech Packs' },
                description: { total: -1, label: 'Product Descriptions' }
            }
        },
        pro: {
            label: 'Pro',
            price: '$499/mo',
            limits: {
                logo: { total: -1, label: 'Logo Concepts' },
                mockup: { total: -1, label: 'Mockups' },
                tech_pack: { total: 15, label: 'Tech Packs' },
                description: { total: -1, label: 'Product Descriptions' }
            }
        }
    }
};

// Prevent window from being undefined in some edge cases
if (typeof window !== 'undefined') {
    window.SUPABASE_CONFIG = SUPABASE_CONFIG;
}