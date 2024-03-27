import { data_import } from "@prisma/client";
import prisma from "../db/PrismaClient";


export default async function getTopAnimal() : Promise<data_import | null> {
    try {
        const animal = await prisma.data_import.findFirst();
        return animal;
    } catch (err) {
        console.log(err);
        return null;
    } 
}



export function getAnimals() {
    try {
        const animals = prisma.data_import.findMany({select: {common_name: true, latitude: true, longitude: true}});
        return animals;
    } catch (err) {
        console.log(err);
        return null;
    }
}