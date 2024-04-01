import { data_import } from "@prisma/client";
import prisma from "../db/PrismaClient";
import { Decimal } from "@prisma/client/runtime/library";
import { channel } from "diagnostics_channel";


export default async function getTopAnimal() : Promise<data_import | null> {
    try {
        const animal = await prisma.data_import.findFirst();
        return animal;
    } catch (err) {
        console.log(err);
        return null;
    } 
}

export async function getAnimalImage(animal: string) : Promise<string> {
    console.log('searching with animal name: ' + animal);
    let resp = await fetch("https://api.phylopic.org/images?filter_name=" + animal.toLowerCase());
    let respJson = await resp.json();

    if(resp.ok && respJson._links.firstPage != null) {
        resp = await fetch("https://api.phylopic.org" + respJson._links.firstPage.href);
        respJson = await resp.json();

        if(resp.ok) {
            resp = await fetch("https://api.phylopic.org" + respJson._links.items[0].href);
            respJson = await resp.json();

            if(resp.ok) {
                return respJson._links.rasterFiles[0].href;
            }
        }
    }
    return "";
}

export async function getAnimalStatistics(id: number) {
    console.log('getting data for animal with id: ' + id);
    const animalData = await prisma.data_import.findUnique({select: {
                                    id : true, 
                                    y2020: true,
                                    y2019: true,
                                    y2018: true,
                                    y2017: true,
                                    y2016: true,
                                    y2015: true,
                                    y2014: true,
                                    y2013: true,
                                    y2012: true,
                                    y2011: true,
                                    y2010: true,
                                    y2009: true,
                                    y2008: true,
                                    y2007: true,
                                    y2006: true,
                                    y2005: true,
                                    y2004: true,
                                    y2003: true,
                                    y2002: true,
                                    y2001: true,
                                    y2000: true,
                                    y1999: true,
                                    y1998: true,
                                    y1997: true,
                                    y1996: true,
                                    y1995: true,
                                    y1994: true,
                                    y1993: true,
                                    y1992: true,
                                    y1991: true,
                                    y1990: true,
                                    y1989: true,
                                    y1988: true,
                                    y1987: true,
                                    y1986: true,
                                    y1985: true,
                                    y1984: true,
                                    y1983: true,
                                    y1982: true,
                                    y1981: true,
                                    y1980: true,
                                    y1979: true,
                                    y1978: true,
                                    y1977: true,
                                    y1976: true,
                                    y1975: true,
                                    y1974: true,
                                    y1973: true,
                                    y1972: true,
                                    y1971: true,
                                    y1970: true,
                                    y1969: true,
                                    y1968: true,
                                    y1967: true,
                                    y1966: true,
                                    y1965: true,
                                    y1964: true,
                                    y1963: true,
                                    y1962: true,
                                    y1961: true,
                                    y1960: true,
                                    y1959: true,
                                    y1958: true,
                                    y1957: true,
                                    y1956: true,
                                    y1955: true,
                                    y1954: true,
                                    y1953: true,
                                    y1952: true,
                                    y1951: true,
                                    y1950: true
                                }, where: {id: id}});

    let latestKnownStatistic : {value: number | Decimal | null, year: string} = {value: null, year: ""};
    let earliestKnownStatistic : {value: number | Decimal | null, year: string} = {value: null, year: ""};

    if(animalData != null) {
        console.log('animalDataEntries: ' + JSON.stringify(Object.entries(animalData).sort()));

        let found = false;
        Object.entries(animalData).sort().forEach(([key, value]) => {
            if(key!='id' && value != null && !found) {
                console.log('key: ' + key + ", value: " + value);
                earliestKnownStatistic = {
                    value: value,
                    year: key
                };
                found = true;
                return;
            }
        });
        found = false;
        Object.entries(animalData).sort().reverse().forEach(([key, value]) => {
            console.log('key: ' + key + ", value: " + value);
            if(key!='id' && value != null && !found) {
                latestKnownStatistic = {
                    value: value,
                    year: key
                };
                found = true;
                return;
            }
        })
    }
    let percent= null;
    if(latestKnownStatistic.value!=null && earliestKnownStatistic.value!=null) {
        let minus = Number(latestKnownStatistic.value) - Number(earliestKnownStatistic.value);
        let decimal = minus / Number(earliestKnownStatistic.value);
        percent = decimal * 100;
    }

    return {
        earliestKnownStatistic: earliestKnownStatistic,
        latestKnownStatistic: latestKnownStatistic,
        change: percent
    }

}

export type AnimalSelectedFields = {
    id: number; 
    common_name: null | string; 
    class: null | string; 
    order1: null | string; 
    family: null | string; 
    genus: null | string; 
    species: null | string; 
    subspecies: null | string; 

    // location
    latitude: null | string;
    longitude: null | string;
    location: null | string; 
    country: null | string; 
    region: null | string; 

    // environment
    system1: null | string; 
    t_realm: null | string; 
    t_biome: null | string; 
    m_realm: null | string; 
    m_ocean: null | string; 
    m_biome: null | string; 
    fw_biome: null | string; 
    fw_realm: null | string; 

    // population
    units: null | string; 
    method: null | string; 
}

export function getAnimals() {
    try {
        const animals = prisma.data_import.findMany({select: 
            {
                // name
                id: true, 
                common_name: true, 
                class: true,
                order1: true,
                family: true,
                genus: true,
                species: true,
                subspecies: true,

                // location
                latitude: true, 
                longitude: true,
                location: true, 
                country: true,
                region: true,

                // environment
                system1: true,
                t_realm: true,
                t_biome: true,
                m_realm: true,
                m_ocean: true,
                m_biome: true,
                fw_biome: true,
                fw_realm: true,

                // population
                units: true,
                method: true
            }});
        return animals;
    } catch (err) {
        console.log(err);
        return null;
    }
}