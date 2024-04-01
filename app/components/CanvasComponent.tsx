'use client';
import { Canvas } from "@react-three/fiber";
import CubeComponent from "./CubeComponent";
import { Dispatch, SetStateAction, createContext, useState } from "react";
import { data_import } from "@prisma/client";
import CanvasContext from "../contexts/CanvasContext";
import AnimalSummary from "./AnimalSummary";
import Summary from "./Summary";
import Information from "./Information";

export default function CanvasComponent({datapoints} : {datapoints: data_import[]}) {

    const [animal, setAnimal] = useState<data_import>(null!);
    const [animalImage, setAnimalImage] = useState("");
    
    return (
        <>
        <CanvasContext.Provider value={{animal, setAnimal, animalImage, setAnimalImage}}>
            <div className="flex flex-row max-h-screen">
                <div className="bg-gradient-to-b from-blue-200 to-green-200 w-2/3">
                    <Canvas camera={{position: [0, 0, 60]}}>
                        <CubeComponent datapoints={datapoints}/>
                    </Canvas>
                </div>
                <div className="w-1/3 h-screen">
                    <Information />
                </div>
            </div>
        </CanvasContext.Provider>
        </>
    )
}
