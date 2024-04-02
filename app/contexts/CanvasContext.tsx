import { createContext } from "react";
import { AnimalSelectedFieldsDeep } from "../server/service/AnimalsService";

export type TrendData = {
    earliestKnownStatistic: {value: number, year: string};
    latestKnownStatistic: {value: number, year: string};
    change: number
}

export type CanvasContextType = {
    animal: AnimalSelectedFieldsDeep;
    setAnimal: (animal: AnimalSelectedFieldsDeep) => void;
    animalImage: string;
    setAnimalImage: (animalImage: string) => void;
    trendData: TrendData;
    setTrendData: (trendData: TrendData) => void;
    getAnimalDetails: (id: number) => void;
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
    setAnimalImage: () => {},
    trendData: {
        earliestKnownStatistic: {year: "", value: 0},
        latestKnownStatistic: {year: "", value: 0},
        change: 0
    },
    setTrendData: () => {},
    getAnimalDetails: () => {}
});
export default CanvasContext;