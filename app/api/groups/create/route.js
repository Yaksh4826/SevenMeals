import { NextResponse } from "next/server";
// To this:
import { supabaseAdmin as supabase } from "@/app/lib/supabaseClient";
export async function POST(req) {
  try {
    const body = await req.json();

    // FOR TESTING: Grab these from the JSON body
    const userId = body.userId; 
    const userEmail = body.userEmail;
    const groupName = body.groupName || "Test Group";

    if (!userId) {
      return NextResponse.json({ error: "No userId provided in body" }, { status: 400 });
    }

    // Code gen
    const inviteCode = Math.floor(100000 + Math.random() * 900000).toString();

    // 1. Create the Group
    const { data: groupData, error: groupError } = await supabase
      .from('groups')
      .insert([{ 
        name: groupName, 
        invite_code: inviteCode, 
       
      }])
      .select()
      .single();

    if (groupError) throw groupError;

    // 2. Link the User
    const { error: userUpdateError } = await supabase
      .from('users')
      .update({ group_id: groupData.id })
      .eq('id', userId);

    if (userUpdateError) throw userUpdateError;

    return NextResponse.json({ 
      success: true, 
      group: groupData 
    }, { status: 201 });

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}