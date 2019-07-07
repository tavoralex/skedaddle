import {IBoid} from "./makeBoids";

export type IGridBoid = IBoid & {
    node: number;
    neighbors: IGridBoid[];
    olfaction: number;
    onDelete: () => void;
};
