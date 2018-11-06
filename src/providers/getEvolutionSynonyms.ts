export interface EvolutionSynonym {
    [key: string]: Array<string>
}

export default function getEvolutionSynonyms(): EvolutionSynonym {
    return require('../resources/json/evolution_synonyms.json');
}
