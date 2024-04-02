'use client';
import { Canvas } from "@react-three/fiber";
import Globe from "./Globe";
import { AnimalSelectedFieldsShallow } from "../../server/service/AnimalsService";

export default function CanvasComponent({animalsArr} : {animalsArr: AnimalSelectedFieldsShallow[] | null}) {
    
    return (
        <Canvas camera={{position: [0, 0, 60]}}>
            <Globe datapoints={animalsArr}/>
        </Canvas>
    )
}
