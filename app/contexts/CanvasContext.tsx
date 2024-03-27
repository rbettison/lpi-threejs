import { createContext } from "react";

export type CanvasContextType = {
    animal: string | null;
    setAnimal: (animal: string | null) => void;
}
const CanvasContext = createContext<CanvasContextType>({animal: "", setAnimal: () => {}});
export default CanvasContext;