import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const STREAK_MILESTONES: Record<number, number> = {
  3: 25,
  7: 75,
  14: 150,
  30: 500,
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } },
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('current_streak, longest_streak, last_challenge_date, streak_shield_available')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      return new Response(
        JSON.stringify({ error: 'User profile not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const today = new Date().toISOString().split('T')[0];
    const lastDate = profile.last_challenge_date;

    // Already updated today
    if (lastDate === today) {
      return new Response(
        JSON.stringify({
          current_streak: profile.current_streak,
          milestone_xp: 0,
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    let newStreak = profile.current_streak;
    let shieldUsed = false;

    if (lastDate) {
      const lastDateObj = new Date(lastDate);
      const todayObj = new Date(today);
      const diffDays = Math.floor(
        (todayObj.getTime() - lastDateObj.getTime()) / (1000 * 60 * 60 * 24),
      );

      if (diffDays === 1) {
        // Consecutive day
        newStreak += 1;
      } else if (diffDays === 2 && profile.streak_shield_available) {
        // Missed one day but has shield
        newStreak += 1;
        shieldUsed = true;
      } else {
        // Streak broken
        newStreak = 1;
      }
    } else {
      newStreak = 1;
    }

    const newLongest = Math.max(newStreak, profile.longest_streak);
    const milestoneXp = STREAK_MILESTONES[newStreak] ?? 0;

    const updates: Record<string, any> = {
      current_streak: newStreak,
      longest_streak: newLongest,
      last_challenge_date: today,
    };

    if (shieldUsed) {
      updates.streak_shield_available = false;
    }

    await supabase.from('users').update(updates).eq('id', user.id);

    // Award milestone XP
    if (milestoneXp > 0) {
      await supabase.rpc('increment_user_xp', {
        p_user_id: user.id,
        p_xp: milestoneXp,
      });
    }

    return new Response(
      JSON.stringify({ current_streak: newStreak, milestone_xp: milestoneXp }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: (err as Error).message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
});
