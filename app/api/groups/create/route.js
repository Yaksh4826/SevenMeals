import { NextResponse } from "next/server";
import { supabaseAdmin as supabase } from "@/app/lib/supabaseClient";

export async function POST(req) {
  try {
    const body = await req.json();

    const userId = req.headers.get("userId");
    const userEmail = req.header.get("userEmail");
    const groupName = body.groupName || `${userEmail?.split("@")[0]}'s Family`;

    if (!userId) {
      return NextResponse.json(
        { error: "No userId provided" },
        { status: 400 },
      );
    }

    // 2. GUARD: Check if user is already in a group
    const { data: userProfile } = await supabase
      .from("users")
      .select("group_id")
      .eq("id", userId)
      .single();

    if (userProfile?.group_id) {
      return NextResponse.json(
        {
          error:
            "You are already in a group. Leave it first to create a new one.",
        },
        { status: 400 },
      );
    }

    // 3. GENERATE: 6-digit Invite Code
    const inviteCode = Math.floor(100000 + Math.random() * 900000).toString();

    // --- START DATABASE SEQUENCE ---

    // STEP A: Create the Group
    const { data: groupData, error: groupError } = await supabase
      .from("groups")
      .insert([
        {
          name: groupName,
          invite_code: inviteCode,
          created_by: userId,
        },
      ])
      .select()
      .single();

    if (groupError) throw groupError;

    // STEP B: Update the Junction Table (group_members)
    // The creator is automatically an 'admin'
    const { error: memberError } = await supabase.from("group_members").insert([
      {
        group_id: groupData.id,
        user_id: userId,
        role: "admin",
      },
    ]);

    if (memberError) {
      // Rollback attempt: Delete the group if member link fails
      await supabase.from("groups").delete().eq("id", groupData.id);
      throw memberError;
    }

    // STEP C: Link the Group ID to the User profile
    const { error: userUpdateError } = await supabase
      .from("users")
      .update({ group_id: groupData.id })
      .eq("id", userId);

    if (userUpdateError) throw userUpdateError;

    // --- SUCCESS ---
    return NextResponse.json(
      {
        success: true,
        message: "Group created and member linked successfully!",
        group: groupData,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Critical Error in Create Group:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
