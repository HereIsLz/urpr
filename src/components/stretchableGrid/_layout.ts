import { breakpointMedium, breakpointLarge, breakpointTiny } from "../../configs/dimens";

export const GRID_LAYOUT = {
    maxGridNum: 3,
    minGridNum: 2,
    getGridNum: (width: number) => width > breakpointMedium ? 3 : (width > breakpointTiny ? 2 : 1),
    gridHeight: '30vh',
    seamWidth: 1,

}