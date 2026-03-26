"use client";

import { useEffect, useState } from "react";
import { supabase, supabaseClientConfigError } from "@/app/lib/supabaseClient";

const Sigin = () => {
  const [userEmail, setUserEmail] = useState(null);
  const [statusMessage, setStatusMessage] = useState(
    supabaseClientConfigError ?? ""
  );

  useEffect(() => {
    if (!supabase) {
      return;
    }

    const loadSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        setStatusMessage(error.message);
        return;
      }

      setUserEmail(data.session?.user?.email ?? null);
    };

    loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserEmail(session?.user?.email ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleGoogleSignIn = async () => {
    if (!supabase) return;

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/` },
    });

    if (error) {
      setStatusMessage(error.message);
    }
  };

  const handleSignOut = async () => {
    if (!supabase) return;

    const { error } = await supabase.auth.signOut();
    if (error) {
      setStatusMessage(error.message);
      return;
    }

    setStatusMessage("");
    setUserEmail(null);
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        type="button"
        onClick={handleGoogleSignIn}
        className="rounded bg-black px-4 py-2 text-white dark:bg-white dark:text-black"
      >
        Sign in with Google
      </button>

      {userEmail ? (
        <>
          <p className="text-sm text-zinc-700 dark:text-zinc-300">
            Signed in as {userEmail}
          </p>
          <button
            type="button"
            onClick={handleSignOut}
            className="rounded border border-zinc-300 px-4 py-2 text-sm dark:border-zinc-700"
          >
            Sign out
          </button>
        </>
      ) : null}

      {statusMessage ? (
        <p className="max-w-md text-center text-sm text-red-600">{statusMessage}</p>
      ) : null}
    </div>
  );
};

export default Sigin;
