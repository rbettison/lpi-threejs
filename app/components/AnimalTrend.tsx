'use client'

import { useContext } from "react";
import CanvasContext, { CanvasContextType } from "../contexts/CanvasContext";

type TrendData = {
    earliestKnownStatistic: {value: number, year: string};
    latestKnownStatistic: {value: number, year: string};
    change: number
}

export default function AnimalTrend() {
    const {animal, trendData} = useContext(CanvasContext) as CanvasContextType;

    return (
        <>
        {
            trendData != undefined && trendData.change != null ?
            <>

            <div><span className="font-bold">Most recent recording:</span> {trendData.latestKnownStatistic.value} in {trendData.latestKnownStatistic.year}</div>
            <div><span className="font-bold">Earliest recording:</span> {trendData.earliestKnownStatistic.value} in {trendData.earliestKnownStatistic.year}</div>
            <div className={`font-bold text-2xl ${trendData.change < 0 ? "text-red-500" : "text-green-500"}`}>Trend: {trendData.change.toFixed(2)}%</div>
            

            <div className="mt-4"><span className="font-bold">Method of measurement: </span>{animal.method}</div>
            <div><span className="font-bold">Units: </span> {animal.units}</div>
            <div className="mt-4"><span className="font-bold">Note:</span> the trend percentage is worked out using the difference between the earliest and latest recordings. This may hide other positive/ negative trends present within the data.</div>

            </> : 
            <div>No trend data available.</div>
        }   
        </>
    )
}