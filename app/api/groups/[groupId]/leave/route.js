import { NextResponse } from "next/server";
import { supabaseAdmin as supabase } from "@/app/lib/supabaseClient";


export async function POST(req){

    const userId =  req.headers.get('userId');
    const groupId = req.params.groupId
    // Now for leaving the group we need to make group members change
    // then we update the group Id to null in the users

    // Updting the group_memebrs tabel

    const {error:leaveError} = await supabase.from('group_members').delete().eq('user_id', userId)

    if(leaveError){
        return NextResponse.json({success:false, message:"Failed to leave the group"})
    }

    // Now we update the user's group id to 
    const { error: userUpdateError } = await supabase
      .from('users')
      .update({ group_id: null })
      .eq('id', userId);

    if (userUpdateError) throw userUpdateError;


    return NextResponse.json({success:true, message:"Left the group successfully"})

}