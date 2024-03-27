'use client';
import { Canvas } from "@react-three/fiber";
import CubeComponent from "./CubeComponent";
import { Dispatch, SetStateAction, createContext, useState } from "react";
import { data_import } from "@prisma/client";
import CanvasContext from "../contexts/CanvasContext";

export default function CanvasComponent({datapoints} : {datapoints: data_import[]}) {
    const [longitude, setLongitude] = useState<number>(0);
    const [latitude, setLatitude] = useState<number>(0);
    const [animal, setAnimal] = useState<string | null>("");
    

    return (
        <>
        <CanvasContext.Provider value={{animal, setAnimal}}>
        <label>
            longitude
        </label>
        <input onChange={(input) => setLongitude(Number(input.target.value))}>
        </input>
        <label>
            latitude
        </label>
        <input onChange={(input) => setLatitude(Number(input.target.value))}>
        </input>
        {animal}
        <Canvas>
            <CubeComponent datapoints={datapoints} longitude={longitude} latitude={latitude}/>
        </Canvas>
        </CanvasContext.Provider>
        </>
    )
}
