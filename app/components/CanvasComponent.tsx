'use client';
import { Canvas } from "@react-three/fiber";
import CubeComponent from "./CubeComponent";
import { Dispatch, SetStateAction, createContext, useState } from "react";
import { data_import } from "@prisma/client";
import CanvasContext from "../contexts/CanvasContext";
import AnimalSummary from "./AnimalSummary";
import Summary from "./Summary";
import Information from "./Information";
import { AnimalSelectedFieldsDeep, AnimalSelectedFieldsShallow } from "../server/service/AnimalsService";

export default function CanvasComponent({datapoints} : {datapoints: AnimalSelectedFieldsShallow[] | null}) {

    const [animal, setAnimal] = useState<AnimalSelectedFieldsDeep>(null!);
    const [animalImage, setAnimalImage] = useState("");
    
    return (
        <>
        <CanvasContext.Provider value={{animal, setAnimal, animalImage, setAnimalImage}}>
            <div className="flex sm:flex-row flex-col max-h-screen">
                <div className="bg-gradient-to-b from-blue-200 to-green-200 sm:w-2/3 w-full h-[400px] sm:h-auto">
                    <Canvas camera={{position: [0, 0, 60]}}>
                        <CubeComponent datapoints={datapoints}/>
                    </Canvas>
                </div>
                <div className="sm:w-1/3 w-full h-screen sm:h-1/2">
                    <Information />
                </div>
            </div>
        </CanvasContext.Provider>
        </>
    )
}
