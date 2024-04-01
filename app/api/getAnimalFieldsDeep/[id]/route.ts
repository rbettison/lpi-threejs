import { getAnimalDeepFields, getAnimalStatistics } from "@/app/server/service/AnimalsService";
import { NextResponse } from "next/server";

export async function GET(request: Request, 
    { params }: { params: {id: string }}) {
    try {
        let deepFields = await getAnimalDeepFields(Number(params.id));
        return NextResponse.json({animal: deepFields}, 
            {status: 200}); 
    } catch(err) {
        console.log(err);
        return NextResponse.json({message: "Error getting animals fields"}, {status: 500})
    }
}