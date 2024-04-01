import { data_import } from "@prisma/client";
import { createContext } from "react";
import { AnimalSelectedFieldsDeep } from "../server/service/AnimalsService";

export type CanvasContextType = {
    animal: AnimalSelectedFieldsDeep;
    setAnimal: (animal: AnimalSelectedFieldsDeep) => void;
    animalImage: string;
    setAnimalImage: (animalImage: string) => void;
}
const CanvasContext = createContext<CanvasContextType>({animal: 
    {
        id: 0,
        class: "",
        order1: "",
        family: "",
        genus: "",
        species: "",
        subspecies: "",
        common_name: "",
        location : "",
        country: "",
        region: "",
        latitude: "",
        longitude: "",
        system1: "",
        t_realm: "",
        t_biome: "",
        fw_realm: "",
        fw_biome: "",
        m_realm: "",
        m_ocean: "",
        m_biome: "",
        units: "",
        method: ""
    }, 
    setAnimal: () => {}, 
    animalImage: "",
    setAnimalImage: () => {}
});
export default CanvasContext;