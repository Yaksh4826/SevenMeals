import { NextResponse } from "next/server";
import { supabaseAdmin as supabase } from "@/app/lib/supabaseClient";


export async function GET(req) {
    const groupId = req.params.groupId

    const { data: groupData, error: findError } = await supabase.from('groups').select('*').eq('id', groupId).single()
    if(findError){
        return NextResponse.json({success:false, message:"Failed to fetch group", error : findError})
    }

    return NextResponse.json({success:true, message:"Sucessfully fetched group", group:groupData})
}