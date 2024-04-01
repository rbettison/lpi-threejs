'use client'
import { useContext } from "react";
import CanvasContext, { CanvasContextType } from "../contexts/CanvasContext";

export default function AnimalClassification() {

    const {animal, animalImage} = useContext(CanvasContext) as CanvasContextType;

    return (
        <div>
                    <div className="font-bold">Classification:</div>
                    <div>Common name: {animal.common_name}</div>
                    <div>Class: {animal.class}</div>
                    <div>Order: {animal.order1}</div>
                    <div>Family: {animal.family}</div>
                    <div>Genus: {animal.genus}</div>
                    <div>Species: {animal.species}</div>
                    <div>Subspecies: {animal.subspecies}</div>
                </div>
    )
}