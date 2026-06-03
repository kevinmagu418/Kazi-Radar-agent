'use client';

import { useState } from 'react';

export default function DebugEnvPage() {
  const [env] = useState<Record<string, string | undefined>>({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Present (Hidden)' : 'Missing',
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  });

  return (
    <div className="p-10 font-mono text-sm">
      <h1 className="text-xl font-bold mb-4">Environment Debug</h1>
      <pre className="bg-gray-100 p-4 rounded">
        {JSON.stringify(env, null, 2)}
      </pre>
      <div className="mt-4 text-xs text-gray-500">
        If these are null or empty, the build process did not pick them up.
      </div>
    </div>
  );
}
