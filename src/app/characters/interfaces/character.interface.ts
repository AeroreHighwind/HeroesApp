import { Skill } from "./skill.interface";

export interface Character {
    id: string;
    name: string;
    creator: Publisher;
    title: string;
    class: string;
    skills: Skill[];
    alt_img?: string;
}

export enum Publisher {
    Independent = "Independent",
}
