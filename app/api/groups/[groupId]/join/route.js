import { NextResponse } from "next/server";
import { supabaseAdmin as supabase } from "@/app/lib/supabaseClient";
export async function POST(req){

const body = req.json()

const userId  = body.userId
const groupId = req.params.groupId

if(!userId){
    return NextResponse.json({success:false, message:"Please login to join the group"})        
}


// 1. Check if user already has a family
const { data: userProfile } = await supabase
  .from('users')
  .select('group_id')
  .eq('id', userId)
  .single();

if (userProfile?.group_id) {
  return Response.json({ 
    error: "You are already in a group. Leave your current group to join a new one." 
  }, { status: 400 });
}


// Now after validation we join the group
// We update the members sections here in group
// and then we update the user's group Id 

const {error:memberError} = await supabase.from('group_memebers').insert([{
group_id:groupId,
user_id: userId,
role:"member"

}])

if(memberError){
    return NextResponse.json({success:false, message : "Failed to join the group"})
}

// Now we update the user's groupId 

 const { error: userUpdateError } = await supabase
      .from('users')
      .update({ group_id: groupId })
      .eq('id', userId);

   if (userUpdateError) throw userUpdateError;

return NextResponse.json({
      success: true,
      message: "Group Joined successfully!",
    }, { status: 200 });
   


}