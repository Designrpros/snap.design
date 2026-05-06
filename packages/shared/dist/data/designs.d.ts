import type { DesignEntry, Category, SortOption } from "../types";
export declare const categories: Category[];
export declare const sortOptions: SortOption[];
export declare function getDesignById(id: string): DesignEntry | undefined;
export declare function getDesignsByCategory(category?: string): DesignEntry[];
export declare function getSortedDesigns(designs: DesignEntry[], sort?: string): DesignEntry[];
export declare const designs: DesignEntry[];
//# sourceMappingURL=designs.d.ts.map