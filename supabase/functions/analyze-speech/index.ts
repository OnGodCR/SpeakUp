import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Use service role for background processing
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const { speech_id, audio_path } = await req.json();

    if (!speech_id || !audio_path) {
      return new Response(
        JSON.stringify({ error: 'Missing speech_id or audio_path' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    // Download audio from storage
    const { data: audioData, error: downloadError } = await supabase.storage
      .from('speech-recordings')
      .download(audio_path);

    if (downloadError || !audioData) {
      await supabase
        .from('speeches')
        .update({ status: 'failed' })
        .eq('id', speech_id);

      return new Response(
        JSON.stringify({ error: 'Failed to download audio' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    // Get the speech record for duration info
    const { data: speech } = await supabase
      .from('speeches')
      .select('duration_seconds, user_id, challenge_id')
      .eq('id', speech_id)
      .single();

    const durationMinutes = (speech?.duration_seconds ?? 180) / 60;

    // Call external AI API for speech analysis
    // Replace with your actual speech analysis API (e.g., OpenAI Whisper + GPT)
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    let analysisResult;

    if (openaiApiKey) {
      // Transcribe with Whisper
      const whisperForm = new FormData();
      whisperForm.append('file', audioData, 'recording.m4a');
      whisperForm.append('model', 'whisper-1');
      whisperForm.append('response_format', 'verbose_json');

      const whisperRes = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: { Authorization: `Bearer ${openaiApiKey}` },
        body: whisperForm,
      });

      const transcription = await whisperRes.json();

      // Analyze with GPT
      const analysisPrompt = `Analyze this speech transcript for public speaking quality. Return a JSON object with these fields:
- overall_score (0-100)
- clarity_score (0-100)
- pace_score (0-100)
- structure_score (0-100)
- filler_word_count (integer)
- words_per_minute (integer)
- speaking_pct (0-100, percentage of time spent speaking vs silence)
- feedback_text (2-3 sentences of constructive feedback)
- key_improvement (1 sentence with the single most important improvement)

Transcript: ${transcription.text}
Duration: ${durationMinutes.toFixed(1)} minutes`;

      const gptRes = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${openaiApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [{ role: 'user', content: analysisPrompt }],
          response_format: { type: 'json_object' },
        }),
      });

      const gptData = await gptRes.json();
      analysisResult = JSON.parse(gptData.choices[0].message.content);
    } else {
      // Fallback: generate mock scores for development
      analysisResult = {
        overall_score: 65 + Math.floor(Math.random() * 25),
        clarity_score: 60 + Math.floor(Math.random() * 30),
        pace_score: 60 + Math.floor(Math.random() * 30),
        structure_score: 55 + Math.floor(Math.random() * 35),
        filler_word_count: Math.floor(Math.random() * 15),
        words_per_minute: 120 + Math.floor(Math.random() * 40),
        speaking_pct: 75 + Math.floor(Math.random() * 20),
        feedback_text: 'Good effort! Focus on reducing filler words and varying your pace for more engaging delivery.',
        key_improvement: 'Try pausing briefly instead of using filler words like "um" and "uh".',
      };
    }

    // Calculate XP
    const baseXp = 50;
    let bonusXp = 0;
    if (analysisResult.overall_score > 90) bonusXp = 35;
    else if (analysisResult.overall_score > 80) bonusXp = 20;
    else if (analysisResult.overall_score > 70) bonusXp = 10;

    // Check for personal best
    const { data: bestScore } = await supabase
      .from('scores')
      .select('overall_score')
      .eq('user_id', speech?.user_id)
      .order('overall_score', { ascending: false })
      .limit(1)
      .single();

    const isPersonalBest = !bestScore || analysisResult.overall_score > bestScore.overall_score;
    if (isPersonalBest) bonusXp += 30;

    const xpEarned = baseXp + bonusXp;

    // Save score
    await supabase.from('scores').insert({
      speech_id,
      user_id: speech?.user_id,
      overall_score: analysisResult.overall_score,
      clarity_score: analysisResult.clarity_score,
      pace_score: analysisResult.pace_score,
      structure_score: analysisResult.structure_score,
      filler_word_count: analysisResult.filler_word_count,
      filler_words_per_min: +(analysisResult.filler_word_count / durationMinutes).toFixed(1),
      words_per_minute: analysisResult.words_per_minute,
      speaking_pct: analysisResult.speaking_pct,
      feedback_text: analysisResult.feedback_text,
      key_improvement: analysisResult.key_improvement,
      xp_earned: xpEarned,
    });

    // Update speech status
    await supabase
      .from('speeches')
      .update({ status: 'analyzed' })
      .eq('id', speech_id);

    // Update user XP
    if (speech?.user_id) {
      await supabase.rpc('increment_user_xp', {
        p_user_id: speech.user_id,
        p_xp: xpEarned,
      });
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: (err as Error).message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
});
