'use client'
import { useContext } from "react";
import CanvasContext, { CanvasContextType } from "../contexts/CanvasContext";

export default function AnimalClassification() {

    const {animal, animalImage} = useContext(CanvasContext) as CanvasContextType;

    return (
        <div>
                    <div className="font-bold">Environment:</div>
                    {
                        animal.system1 === "Terrestrial" && 
                            <>
                                <div>Realm: {animal.t_realm}</div>
                                <div>Biome: {animal.t_biome}</div>
                            </>
                    }
                    {
                        animal.system1 === "Marine" &&
                            <>
                                <div>Realm: {animal.m_realm}</div>
                                <div>Ocean: {animal.m_ocean}</div>
                                <div>Biome: {animal.m_biome}</div>
                            </>
                    }
                    {
                        animal.system1 === "Freshwater" &&
                            <>
                                <div>Realm: {animal.fw_realm}</div>
                                <div>Biome: {animal.fw_biome}</div>
                            </>
                    }
                </div>
    )
}