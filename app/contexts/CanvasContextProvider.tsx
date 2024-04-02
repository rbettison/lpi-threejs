'use client'
import { useState } from "react";
import CanvasContext, { TrendData } from "./CanvasContext";
import { AnimalSelectedFieldsDeep } from "../server/service/AnimalsService";

export default function CanvasContextProvider({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    const [trendData, setTrendData] = useState<TrendData>(null!);
    const [animal, setAnimal] = useState<AnimalSelectedFieldsDeep>(null!);
    const [animalImage, setAnimalImage] = useState("");

    const getAnimalDetails = async (id: number) => {
        await fetch("/api/getAnimalFieldsDeep/" + id).then(async (resp) => {
            let respJson = await resp.json();
            setAnimalImage("");
            if (resp.ok) {
              setAnimal(respJson.animal);
              fetch("/api/getAnimalPicture/" + respJson.animal.common_name).then(async (resp) => {
                let respJson = await resp.json();
                if(resp.ok) setAnimalImage(respJson.image);
              })
            }
        })
        try {
            fetch("/api/getAnimalTrend/" + animal.id).then(async (resp) => {
                let respJson = await resp.json();
                setTrendData(respJson.statistics);
            });
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <CanvasContext.Provider value={{   
                                        animal, 
                                        setAnimal, 
                                        animalImage, 
                                        setAnimalImage,
                                        trendData,
                                        setTrendData,
                                        getAnimalDetails
                                        }}>
            {children}
        </CanvasContext.Provider>
    )
}