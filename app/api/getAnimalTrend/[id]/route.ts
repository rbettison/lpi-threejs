import { getAnimalStatistics } from "@/app/server/service/AnimalsService";
import { NextResponse } from "next/server";

export async function GET(request: Request, 
    { params }: { params: {id: string }}) {
    try {
        let image = await getAnimalStatistics(Number(params.id));
        return NextResponse.json({statistics: image}, 
            {status: 200}); 
    } catch(err) {
        console.log(err);
        return NextResponse.json({message: "Error getting statistics"}, {status: 500})
    }
}