'use client'
import { useContext } from "react";
import CanvasContext, { CanvasContextType } from "../contexts/CanvasContext";

export default function AnimalClassification() {

    const {animal, animalImage} = useContext(CanvasContext) as CanvasContextType;

    return (
        <div>
                    <div className="font-bold">Location:</div>
                    <div>Location: {animal.location}</div>
                    <div>Country: {animal.country}</div>
                    <div>Region: {animal.region}</div>
                </div>
    )
}