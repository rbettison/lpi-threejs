'use client'

import { useContext, useState } from "react"
import CanvasContext, { CanvasContextType } from "../contexts/CanvasContext"
import AnimalClassification from "./AnimalClassification";
import AnimalLocation from "./AnimalLocation";
import AnimalEnvironment from "./AnimalEnvironment";
import AnimalTrend from "./AnimalTrend";

export default function AnimalSummary() {

    const {animal, animalImage} = useContext(CanvasContext) as CanvasContextType;
    const [tab,setTab] = useState("details");

    return (
        <div className={`${animal != null && animal.system1 === 'Terrestrial' ? 'bg-green-200' : 'bg-blue-100'} rounded-b-lg flex flex-col p-5 gap-2 w-full text-black h-full`}>
            {

                animal != null && 
                
                <>
                <div className="text-lg font-bold flex flex-row gap-2 justify-center items-center">
                    <button onClick={()=>setTab("details")} 
                        className={`rounded-lg p-2 ${tab==="details" ? "bg-slate-300" : "bg-slate-400"}`}>Details</button>
                    <button onClick={()=>setTab("trend")} 
                        className={`rounded-lg p-2 ${tab==="trend" ? "bg-slate-300" : "bg-slate-400"}`}>Trend</button>
                </div>
                <div className="font-bold text-2xl">Selected animal: {animal.common_name}</div>
                {
                    tab === "details" ?
                    <>
                        <AnimalClassification />
                        <AnimalLocation />
                        <AnimalEnvironment />
                    </> :
                    <>
                        <AnimalTrend />
                    </>
                }
                {animalImage != "" && <img className="w-24 h-24 object-scale-down absolute bottom-5 right-5" src={animalImage} />}
                </>

            }
            
        </div>
    )
}