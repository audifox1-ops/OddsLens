import { type GeminiExtraction, type MatchAnalysis } from '@oddslens/shared';
export declare function extractOddsFromImages(imageBuffers: {
    buffer: Buffer;
    mimeType: string;
}[]): Promise<GeminiExtraction>;
export declare function generateProbabilityAnalysis(matchName: string, homeTeam: string, awayTeam: string, sport: string, options: {
    label: string;
    odds: number;
    fairProbability: number;
}[]): Promise<{
    modelProbability: number;
    reasoning: string;
    sources: string[];
    confidence: 'high' | 'medium' | 'low';
}[]>;
export declare function analyzeImages(imageBuffers: {
    buffer: Buffer;
    mimeType: string;
}[]): Promise<MatchAnalysis[]>;
