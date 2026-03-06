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

    const formData = await req.formData();
    const audioFile = formData.get('audio') as File;
    const challengeId = formData.get('challenge_id') as string;
    const durationSeconds = Number(formData.get('duration_seconds'));

    if (!audioFile || !challengeId) {
      return new Response(
        JSON.stringify({ error: 'Missing audio or challenge_id' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    // Upload audio to storage
    const fileName = `${user.id}/${challengeId}-${Date.now()}.m4a`;
    const { error: uploadError } = await supabase.storage
      .from('speech-recordings')
      .upload(fileName, audioFile, { contentType: 'audio/m4a' });

    if (uploadError) {
      return new Response(
        JSON.stringify({ error: 'Failed to upload audio' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    // Create speech record
    const { data: speech, error: speechError } = await supabase
      .from('speeches')
      .insert({
        user_id: user.id,
        challenge_id: challengeId,
        audio_path: fileName,
        duration_seconds: durationSeconds,
        status: 'processing',
      })
      .select('id')
      .single();

    if (speechError || !speech) {
      return new Response(
        JSON.stringify({ error: 'Failed to create speech record' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    // Trigger async analysis (invoke analyze-speech function)
    supabase.functions.invoke('analyze-speech', {
      body: { speech_id: speech.id, audio_path: fileName },
    }).catch(() => {
      // Fire and forget - analysis runs in background
    });

    return new Response(
      JSON.stringify({ speech_id: speech.id }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: (err as Error).message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
});
