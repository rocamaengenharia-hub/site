// Chamado pelo Cron da Vercel (vercel.json → "crons") 1x por dia.
// Grava um evento no Supabase e apaga em seguida (função public.keep_alive em
// supabase/setup.sql) para o projeto Free não ser pausado por inatividade.
export async function GET(request: Request) {
    const cronSecret = process.env.CRON_SECRET
    if (!cronSecret || request.headers.get('authorization') !== `Bearer ${cronSecret}`) {
        return new Response('Unauthorized', { status: 401 })
    }

    const supabaseUrl = process.env.VITE_SUPABASE_URL
    const anonKey = process.env.VITE_SUPABASE_ANON_KEY
    if (!supabaseUrl || !anonKey) {
        console.error('[keep-alive] VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY ausentes')
        return Response.json({ ok: false, error: 'missing env' }, { status: 500 })
    }

    const res = await fetch(`${supabaseUrl}/rest/v1/rpc/keep_alive`, {
        method: 'POST',
        headers: {
            apikey: anonKey,
            Authorization: `Bearer ${anonKey}`,
            'Content-Type': 'application/json',
        },
        body: '{}',
    })

    if (!res.ok) {
        const detail = await res.text()
        console.error(`[keep-alive] Supabase respondeu ${res.status}: ${detail}`)
        return Response.json({ ok: false, status: res.status }, { status: 502 })
    }

    const at = await res.json()
    console.log(`[keep-alive] evento gravado e apagado em ${at}`)
    return Response.json({ ok: true, at })
}
