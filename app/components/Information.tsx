'use client'
import { useContext } from "react";
import AnimalSummary from "./AnimalSummary";
import Summary from "./Summary";
import CanvasContext, { CanvasContextType } from "../contexts/CanvasContext";

export default function Information() {

    const {animal} = useContext(CanvasContext) as CanvasContextType;

    return (
        <div className={`${animal != null && animal.system1 === 'Terrestrial' ? 'bg-green-300' : ' bg-blue-300'} p-5 h-screen flex flex-col overflow-y-scroll shadow-lg`}>
            <div className="h-1/5">
                <Summary />
            </div>
            <div>
                <AnimalSummary />
            </div>
        </div>
    )
}