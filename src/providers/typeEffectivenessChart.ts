interface TypeEffectivenessChartDefending {
    [key: string]: number
}

interface TypeEffectivenessChartAttacking {
    [key: string]: TypeEffectivenessChartDefending
}

export function getTypeEffectivenessChart(): TypeEffectivenessChartAttacking {
    return require('../resources/json/type_effectiveness_chart.json');
}
