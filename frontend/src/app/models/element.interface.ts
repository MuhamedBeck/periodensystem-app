export interface IElement {
    ordnungszahl: number;
    symbol: string;
    name: string;
    atommasse: number;
    aggregatzustand_id: number;
    aggregatzustand_name: string;
    kategorie_id: number;
    kategorie_name: string;
    siedepunkt: number;
    schmelzpunkt: number;
    elektronegativitaet: number;
    dichte: number;
    entdecker_id: number;
    entdecker_name: string;
    gruppe: number | null;
    periode: number;
    oxidationszahlen: [number];
}
