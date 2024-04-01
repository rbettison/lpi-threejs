import { getAnimalImage } from "@/app/server/service/AnimalsService";
import { NextResponse } from "next/server";

export async function GET(request: Request, 
    { params }: { params: {searchTerm: string }}) {
    try {
        let image = await getAnimalImage(params.searchTerm);
        return NextResponse.json({image: image}, 
            {status: 200}); 
    } catch(err) {
        console.log(err);
        return NextResponse.json({message: "Error getting image"}, {status: 500})
    }
}