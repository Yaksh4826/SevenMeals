"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
const Sigin = () => {
  const [userEmail, setUserEmail] = useState(null);
  const [profileName, setProfileName] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || !supabase) {
      return;
    }

    const loadSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        setStatusMessage(error.message);
        return;
      }

      const sessionUser = data.session?.user ?? null;
      setUserEmail(sessionUser?.email ?? null);

      if (!sessionUser?.id) {
        setProfileName(null);
        return;
      }

      const { data: profileData, error: profileError } = await supabase
        .from("users")
        .select('name, email')
        .eq("id", sessionUser.id)
        .maybeSingle();

      if (profileError) {
        setStatusMessage(profileError.message);
        return;
      }

      setProfileName(profileData?.full_name ?? null);
    };

    loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserEmail(session?.user?.email ?? null);
      setProfileName(session?.user?.user_metadata?.full_name ?? null);
    });

    return () => subscription.unsubscribe();
  }, [isMounted]);

  const handleGoogleSignIn = async () => {
    if (!supabase) return;

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/dashboard` },
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
    setProfileName(null);
  };

  return (
    <div className="flex flex-col items-center gap-3">
    
      <button
        type="button"
        onClick={handleGoogleSignIn}
        className="rounded-full bg-white font-medium flex flex-row gap-2 shadow p-3 px-8 text-sm items-center"
      >
        <FcGoogle size={26}></FcGoogle>
        Sign in with Google
      </button>

      {userEmail ? (
        <>
          <p className="text-sm text-zinc-700 dark:text-zinc-300">
            Signed in as {userEmail}
          </p>
          {profileName ? (
            <p className="text-xs text-zinc-600 dark:text-zinc-400">
              Name: {profileName}
            </p>
          ) : null}
      
          <Button onClick={handleSignOut} className="bg-red-600 text-white">SignOut</Button>


        </>
      ) : null}

      {statusMessage ? (
        <p className="max-w-md text-center text-sm text-red-600">{statusMessage}</p>
      ) : null}
    </div>
  );
};

export default Sigin;
