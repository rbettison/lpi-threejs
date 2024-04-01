'use client'
import { useContext } from "react";
import CanvasContext, { CanvasContextType } from "../contexts/CanvasContext";

export default function AnimalPopulation() {

    const {animal} = useContext(CanvasContext) as CanvasContextType;

    return (
        <div>
                    <div className="font-bold">Population:</div>
                    <div>Unit measure: {animal.units}</div>
                    <div>Method of measurement: {animal.method}</div>
                </div>
    )
}