import { z } from 'zod';
/** 단일 경기 배당 옵션 */
export declare const OddsOptionSchema: z.ZodObject<{
    label: z.ZodString;
    odds: z.ZodNumber;
    type: z.ZodEnum<["home", "draw", "away", "over", "under", "handicap_home", "handicap_away", "other"]>;
}, "strip", z.ZodTypeAny, {
    type: "home" | "draw" | "away" | "over" | "under" | "handicap_home" | "handicap_away" | "other";
    label: string;
    odds: number;
}, {
    type: "home" | "draw" | "away" | "over" | "under" | "handicap_home" | "handicap_away" | "other";
    label: string;
    odds: number;
}>;
/** 핸디캡 정보 */
export declare const HandicapSchema: z.ZodOptional<z.ZodObject<{
    value: z.ZodNumber;
    homeOdds: z.ZodNumber;
    awayOdds: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    value: number;
    homeOdds: number;
    awayOdds: number;
}, {
    value: number;
    homeOdds: number;
    awayOdds: number;
}>>;
/** 이미지에서 추출된 단일 경기 정보 */
export declare const ExtractedMatchSchema: z.ZodObject<{
    matchName: z.ZodString;
    homeTeam: z.ZodString;
    awayTeam: z.ZodString;
    league: z.ZodOptional<z.ZodString>;
    matchDate: z.ZodOptional<z.ZodString>;
    sport: z.ZodDefault<z.ZodString>;
    options: z.ZodArray<z.ZodObject<{
        label: z.ZodString;
        odds: z.ZodNumber;
        type: z.ZodEnum<["home", "draw", "away", "over", "under", "handicap_home", "handicap_away", "other"]>;
    }, "strip", z.ZodTypeAny, {
        type: "home" | "draw" | "away" | "over" | "under" | "handicap_home" | "handicap_away" | "other";
        label: string;
        odds: number;
    }, {
        type: "home" | "draw" | "away" | "over" | "under" | "handicap_home" | "handicap_away" | "other";
        label: string;
        odds: number;
    }>, "many">;
    handicap: z.ZodOptional<z.ZodObject<{
        value: z.ZodNumber;
        homeOdds: z.ZodNumber;
        awayOdds: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        value: number;
        homeOdds: number;
        awayOdds: number;
    }, {
        value: number;
        homeOdds: number;
        awayOdds: number;
    }>>;
    overUnderLine: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    options: {
        type: "home" | "draw" | "away" | "over" | "under" | "handicap_home" | "handicap_away" | "other";
        label: string;
        odds: number;
    }[];
    matchName: string;
    homeTeam: string;
    awayTeam: string;
    sport: string;
    league?: string | undefined;
    matchDate?: string | undefined;
    handicap?: {
        value: number;
        homeOdds: number;
        awayOdds: number;
    } | undefined;
    overUnderLine?: number | undefined;
}, {
    options: {
        type: "home" | "draw" | "away" | "over" | "under" | "handicap_home" | "handicap_away" | "other";
        label: string;
        odds: number;
    }[];
    matchName: string;
    homeTeam: string;
    awayTeam: string;
    league?: string | undefined;
    matchDate?: string | undefined;
    sport?: string | undefined;
    handicap?: {
        value: number;
        homeOdds: number;
        awayOdds: number;
    } | undefined;
    overUnderLine?: number | undefined;
}>;
/** Gemini가 이미지에서 추출하는 원시 데이터 스키마 */
export declare const GeminiExtractionSchema: z.ZodObject<{
    matches: z.ZodArray<z.ZodObject<{
        matchName: z.ZodString;
        homeTeam: z.ZodString;
        awayTeam: z.ZodString;
        league: z.ZodOptional<z.ZodString>;
        matchDate: z.ZodOptional<z.ZodString>;
        sport: z.ZodDefault<z.ZodString>;
        options: z.ZodArray<z.ZodObject<{
            label: z.ZodString;
            odds: z.ZodNumber;
            type: z.ZodEnum<["home", "draw", "away", "over", "under", "handicap_home", "handicap_away", "other"]>;
        }, "strip", z.ZodTypeAny, {
            type: "home" | "draw" | "away" | "over" | "under" | "handicap_home" | "handicap_away" | "other";
            label: string;
            odds: number;
        }, {
            type: "home" | "draw" | "away" | "over" | "under" | "handicap_home" | "handicap_away" | "other";
            label: string;
            odds: number;
        }>, "many">;
        handicap: z.ZodOptional<z.ZodObject<{
            value: z.ZodNumber;
            homeOdds: z.ZodNumber;
            awayOdds: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            value: number;
            homeOdds: number;
            awayOdds: number;
        }, {
            value: number;
            homeOdds: number;
            awayOdds: number;
        }>>;
        overUnderLine: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        options: {
            type: "home" | "draw" | "away" | "over" | "under" | "handicap_home" | "handicap_away" | "other";
            label: string;
            odds: number;
        }[];
        matchName: string;
        homeTeam: string;
        awayTeam: string;
        sport: string;
        league?: string | undefined;
        matchDate?: string | undefined;
        handicap?: {
            value: number;
            homeOdds: number;
            awayOdds: number;
        } | undefined;
        overUnderLine?: number | undefined;
    }, {
        options: {
            type: "home" | "draw" | "away" | "over" | "under" | "handicap_home" | "handicap_away" | "other";
            label: string;
            odds: number;
        }[];
        matchName: string;
        homeTeam: string;
        awayTeam: string;
        league?: string | undefined;
        matchDate?: string | undefined;
        sport?: string | undefined;
        handicap?: {
            value: number;
            homeOdds: number;
            awayOdds: number;
        } | undefined;
        overUnderLine?: number | undefined;
    }>, "many">;
    imageQuality: z.ZodEnum<["good", "low", "unreadable"]>;
    isSportsOdds: z.ZodBoolean;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    matches: {
        options: {
            type: "home" | "draw" | "away" | "over" | "under" | "handicap_home" | "handicap_away" | "other";
            label: string;
            odds: number;
        }[];
        matchName: string;
        homeTeam: string;
        awayTeam: string;
        sport: string;
        league?: string | undefined;
        matchDate?: string | undefined;
        handicap?: {
            value: number;
            homeOdds: number;
            awayOdds: number;
        } | undefined;
        overUnderLine?: number | undefined;
    }[];
    imageQuality: "low" | "good" | "unreadable";
    isSportsOdds: boolean;
    notes?: string | undefined;
}, {
    matches: {
        options: {
            type: "home" | "draw" | "away" | "over" | "under" | "handicap_home" | "handicap_away" | "other";
            label: string;
            odds: number;
        }[];
        matchName: string;
        homeTeam: string;
        awayTeam: string;
        league?: string | undefined;
        matchDate?: string | undefined;
        sport?: string | undefined;
        handicap?: {
            value: number;
            homeOdds: number;
            awayOdds: number;
        } | undefined;
        overUnderLine?: number | undefined;
    }[];
    imageQuality: "low" | "good" | "unreadable";
    isSportsOdds: boolean;
    notes?: string | undefined;
}>;
export declare const ProbabilityResultSchema: z.ZodObject<{
    label: z.ZodString;
    odds: z.ZodNumber;
    impliedProbability: z.ZodNumber;
    fairProbability: z.ZodNumber;
    modelProbability: z.ZodNumber;
    ev: z.ZodNumber;
    confidence: z.ZodEnum<["high", "medium", "low"]>;
    reasoning: z.ZodString;
    sources: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    label: string;
    odds: number;
    impliedProbability: number;
    fairProbability: number;
    modelProbability: number;
    ev: number;
    confidence: "high" | "medium" | "low";
    reasoning: string;
    sources: string[];
}, {
    label: string;
    odds: number;
    impliedProbability: number;
    fairProbability: number;
    modelProbability: number;
    ev: number;
    confidence: "high" | "medium" | "low";
    reasoning: string;
    sources: string[];
}>;
export declare const MatchAnalysisSchema: z.ZodObject<{
    matchName: z.ZodString;
    homeTeam: z.ZodString;
    awayTeam: z.ZodString;
    league: z.ZodOptional<z.ZodString>;
    matchDate: z.ZodOptional<z.ZodString>;
    sport: z.ZodString;
    overround: z.ZodNumber;
    options: z.ZodArray<z.ZodObject<{
        label: z.ZodString;
        odds: z.ZodNumber;
        impliedProbability: z.ZodNumber;
        fairProbability: z.ZodNumber;
        modelProbability: z.ZodNumber;
        ev: z.ZodNumber;
        confidence: z.ZodEnum<["high", "medium", "low"]>;
        reasoning: z.ZodString;
        sources: z.ZodArray<z.ZodString, "many">;
    }, "strip", z.ZodTypeAny, {
        label: string;
        odds: number;
        impliedProbability: number;
        fairProbability: number;
        modelProbability: number;
        ev: number;
        confidence: "high" | "medium" | "low";
        reasoning: string;
        sources: string[];
    }, {
        label: string;
        odds: number;
        impliedProbability: number;
        fairProbability: number;
        modelProbability: number;
        ev: number;
        confidence: "high" | "medium" | "low";
        reasoning: string;
        sources: string[];
    }>, "many">;
    selectedPick: z.ZodOptional<z.ZodObject<{
        label: z.ZodString;
        odds: z.ZodNumber;
        impliedProbability: z.ZodNumber;
        fairProbability: z.ZodNumber;
        modelProbability: z.ZodNumber;
        ev: z.ZodNumber;
        confidence: z.ZodEnum<["high", "medium", "low"]>;
        reasoning: z.ZodString;
        sources: z.ZodArray<z.ZodString, "many">;
    }, "strip", z.ZodTypeAny, {
        label: string;
        odds: number;
        impliedProbability: number;
        fairProbability: number;
        modelProbability: number;
        ev: number;
        confidence: "high" | "medium" | "low";
        reasoning: string;
        sources: string[];
    }, {
        label: string;
        odds: number;
        impliedProbability: number;
        fairProbability: number;
        modelProbability: number;
        ev: number;
        confidence: "high" | "medium" | "low";
        reasoning: string;
        sources: string[];
    }>>;
}, "strip", z.ZodTypeAny, {
    options: {
        label: string;
        odds: number;
        impliedProbability: number;
        fairProbability: number;
        modelProbability: number;
        ev: number;
        confidence: "high" | "medium" | "low";
        reasoning: string;
        sources: string[];
    }[];
    matchName: string;
    homeTeam: string;
    awayTeam: string;
    sport: string;
    overround: number;
    league?: string | undefined;
    matchDate?: string | undefined;
    selectedPick?: {
        label: string;
        odds: number;
        impliedProbability: number;
        fairProbability: number;
        modelProbability: number;
        ev: number;
        confidence: "high" | "medium" | "low";
        reasoning: string;
        sources: string[];
    } | undefined;
}, {
    options: {
        label: string;
        odds: number;
        impliedProbability: number;
        fairProbability: number;
        modelProbability: number;
        ev: number;
        confidence: "high" | "medium" | "low";
        reasoning: string;
        sources: string[];
    }[];
    matchName: string;
    homeTeam: string;
    awayTeam: string;
    sport: string;
    overround: number;
    league?: string | undefined;
    matchDate?: string | undefined;
    selectedPick?: {
        label: string;
        odds: number;
        impliedProbability: number;
        fairProbability: number;
        modelProbability: number;
        ev: number;
        confidence: "high" | "medium" | "low";
        reasoning: string;
        sources: string[];
    } | undefined;
}>;
export declare const ComboTypeSchema: z.ZodEnum<["stable", "balanced", "aggressive"]>;
export declare const ComboPick: z.ZodObject<{
    matchName: z.ZodString;
    homeTeam: z.ZodString;
    awayTeam: z.ZodString;
    pick: z.ZodString;
    odds: z.ZodNumber;
    modelProbability: z.ZodNumber;
    ev: z.ZodNumber;
    confidence: z.ZodEnum<["high", "medium", "low"]>;
    reasoning: z.ZodString;
}, "strip", z.ZodTypeAny, {
    matchName: string;
    homeTeam: string;
    awayTeam: string;
    odds: number;
    modelProbability: number;
    ev: number;
    confidence: "high" | "medium" | "low";
    reasoning: string;
    pick: string;
}, {
    matchName: string;
    homeTeam: string;
    awayTeam: string;
    odds: number;
    modelProbability: number;
    ev: number;
    confidence: "high" | "medium" | "low";
    reasoning: string;
    pick: string;
}>;
export declare const ComboRecommendationSchema: z.ZodObject<{
    type: z.ZodEnum<["stable", "balanced", "aggressive"]>;
    typeName: z.ZodString;
    picks: z.ZodArray<z.ZodObject<{
        matchName: z.ZodString;
        homeTeam: z.ZodString;
        awayTeam: z.ZodString;
        pick: z.ZodString;
        odds: z.ZodNumber;
        modelProbability: z.ZodNumber;
        ev: z.ZodNumber;
        confidence: z.ZodEnum<["high", "medium", "low"]>;
        reasoning: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        matchName: string;
        homeTeam: string;
        awayTeam: string;
        odds: number;
        modelProbability: number;
        ev: number;
        confidence: "high" | "medium" | "low";
        reasoning: string;
        pick: string;
    }, {
        matchName: string;
        homeTeam: string;
        awayTeam: string;
        odds: number;
        modelProbability: number;
        ev: number;
        confidence: "high" | "medium" | "low";
        reasoning: string;
        pick: string;
    }>, "many">;
    combinedOdds: z.ZodNumber;
    combinedProbability: z.ZodNumber;
    combinedEV: z.ZodNumber;
    riskLevel: z.ZodEnum<["low", "medium", "high"]>;
    riskScore: z.ZodNumber;
    summary: z.ZodString;
    disclaimer: z.ZodString;
}, "strip", z.ZodTypeAny, {
    type: "stable" | "balanced" | "aggressive";
    typeName: string;
    picks: {
        matchName: string;
        homeTeam: string;
        awayTeam: string;
        odds: number;
        modelProbability: number;
        ev: number;
        confidence: "high" | "medium" | "low";
        reasoning: string;
        pick: string;
    }[];
    combinedOdds: number;
    combinedProbability: number;
    combinedEV: number;
    riskLevel: "high" | "medium" | "low";
    riskScore: number;
    summary: string;
    disclaimer: string;
}, {
    type: "stable" | "balanced" | "aggressive";
    typeName: string;
    picks: {
        matchName: string;
        homeTeam: string;
        awayTeam: string;
        odds: number;
        modelProbability: number;
        ev: number;
        confidence: "high" | "medium" | "low";
        reasoning: string;
        pick: string;
    }[];
    combinedOdds: number;
    combinedProbability: number;
    combinedEV: number;
    riskLevel: "high" | "medium" | "low";
    riskScore: number;
    summary: string;
    disclaimer: string;
}>;
export declare const AnalysisResultSchema: z.ZodObject<{
    id: z.ZodString;
    createdAt: z.ZodString;
    matches: z.ZodArray<z.ZodObject<{
        matchName: z.ZodString;
        homeTeam: z.ZodString;
        awayTeam: z.ZodString;
        league: z.ZodOptional<z.ZodString>;
        matchDate: z.ZodOptional<z.ZodString>;
        sport: z.ZodString;
        overround: z.ZodNumber;
        options: z.ZodArray<z.ZodObject<{
            label: z.ZodString;
            odds: z.ZodNumber;
            impliedProbability: z.ZodNumber;
            fairProbability: z.ZodNumber;
            modelProbability: z.ZodNumber;
            ev: z.ZodNumber;
            confidence: z.ZodEnum<["high", "medium", "low"]>;
            reasoning: z.ZodString;
            sources: z.ZodArray<z.ZodString, "many">;
        }, "strip", z.ZodTypeAny, {
            label: string;
            odds: number;
            impliedProbability: number;
            fairProbability: number;
            modelProbability: number;
            ev: number;
            confidence: "high" | "medium" | "low";
            reasoning: string;
            sources: string[];
        }, {
            label: string;
            odds: number;
            impliedProbability: number;
            fairProbability: number;
            modelProbability: number;
            ev: number;
            confidence: "high" | "medium" | "low";
            reasoning: string;
            sources: string[];
        }>, "many">;
        selectedPick: z.ZodOptional<z.ZodObject<{
            label: z.ZodString;
            odds: z.ZodNumber;
            impliedProbability: z.ZodNumber;
            fairProbability: z.ZodNumber;
            modelProbability: z.ZodNumber;
            ev: z.ZodNumber;
            confidence: z.ZodEnum<["high", "medium", "low"]>;
            reasoning: z.ZodString;
            sources: z.ZodArray<z.ZodString, "many">;
        }, "strip", z.ZodTypeAny, {
            label: string;
            odds: number;
            impliedProbability: number;
            fairProbability: number;
            modelProbability: number;
            ev: number;
            confidence: "high" | "medium" | "low";
            reasoning: string;
            sources: string[];
        }, {
            label: string;
            odds: number;
            impliedProbability: number;
            fairProbability: number;
            modelProbability: number;
            ev: number;
            confidence: "high" | "medium" | "low";
            reasoning: string;
            sources: string[];
        }>>;
    }, "strip", z.ZodTypeAny, {
        options: {
            label: string;
            odds: number;
            impliedProbability: number;
            fairProbability: number;
            modelProbability: number;
            ev: number;
            confidence: "high" | "medium" | "low";
            reasoning: string;
            sources: string[];
        }[];
        matchName: string;
        homeTeam: string;
        awayTeam: string;
        sport: string;
        overround: number;
        league?: string | undefined;
        matchDate?: string | undefined;
        selectedPick?: {
            label: string;
            odds: number;
            impliedProbability: number;
            fairProbability: number;
            modelProbability: number;
            ev: number;
            confidence: "high" | "medium" | "low";
            reasoning: string;
            sources: string[];
        } | undefined;
    }, {
        options: {
            label: string;
            odds: number;
            impliedProbability: number;
            fairProbability: number;
            modelProbability: number;
            ev: number;
            confidence: "high" | "medium" | "low";
            reasoning: string;
            sources: string[];
        }[];
        matchName: string;
        homeTeam: string;
        awayTeam: string;
        sport: string;
        overround: number;
        league?: string | undefined;
        matchDate?: string | undefined;
        selectedPick?: {
            label: string;
            odds: number;
            impliedProbability: number;
            fairProbability: number;
            modelProbability: number;
            ev: number;
            confidence: "high" | "medium" | "low";
            reasoning: string;
            sources: string[];
        } | undefined;
    }>, "many">;
    recommendations: z.ZodArray<z.ZodObject<{
        type: z.ZodEnum<["stable", "balanced", "aggressive"]>;
        typeName: z.ZodString;
        picks: z.ZodArray<z.ZodObject<{
            matchName: z.ZodString;
            homeTeam: z.ZodString;
            awayTeam: z.ZodString;
            pick: z.ZodString;
            odds: z.ZodNumber;
            modelProbability: z.ZodNumber;
            ev: z.ZodNumber;
            confidence: z.ZodEnum<["high", "medium", "low"]>;
            reasoning: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            matchName: string;
            homeTeam: string;
            awayTeam: string;
            odds: number;
            modelProbability: number;
            ev: number;
            confidence: "high" | "medium" | "low";
            reasoning: string;
            pick: string;
        }, {
            matchName: string;
            homeTeam: string;
            awayTeam: string;
            odds: number;
            modelProbability: number;
            ev: number;
            confidence: "high" | "medium" | "low";
            reasoning: string;
            pick: string;
        }>, "many">;
        combinedOdds: z.ZodNumber;
        combinedProbability: z.ZodNumber;
        combinedEV: z.ZodNumber;
        riskLevel: z.ZodEnum<["low", "medium", "high"]>;
        riskScore: z.ZodNumber;
        summary: z.ZodString;
        disclaimer: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        type: "stable" | "balanced" | "aggressive";
        typeName: string;
        picks: {
            matchName: string;
            homeTeam: string;
            awayTeam: string;
            odds: number;
            modelProbability: number;
            ev: number;
            confidence: "high" | "medium" | "low";
            reasoning: string;
            pick: string;
        }[];
        combinedOdds: number;
        combinedProbability: number;
        combinedEV: number;
        riskLevel: "high" | "medium" | "low";
        riskScore: number;
        summary: string;
        disclaimer: string;
    }, {
        type: "stable" | "balanced" | "aggressive";
        typeName: string;
        picks: {
            matchName: string;
            homeTeam: string;
            awayTeam: string;
            odds: number;
            modelProbability: number;
            ev: number;
            confidence: "high" | "medium" | "low";
            reasoning: string;
            pick: string;
        }[];
        combinedOdds: number;
        combinedProbability: number;
        combinedEV: number;
        riskLevel: "high" | "medium" | "low";
        riskScore: number;
        summary: string;
        disclaimer: string;
    }>, "many">;
    isMock: z.ZodDefault<z.ZodBoolean>;
    disclaimer: z.ZodString;
    processingTimeMs: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    id: string;
    createdAt: string;
    matches: {
        options: {
            label: string;
            odds: number;
            impliedProbability: number;
            fairProbability: number;
            modelProbability: number;
            ev: number;
            confidence: "high" | "medium" | "low";
            reasoning: string;
            sources: string[];
        }[];
        matchName: string;
        homeTeam: string;
        awayTeam: string;
        sport: string;
        overround: number;
        league?: string | undefined;
        matchDate?: string | undefined;
        selectedPick?: {
            label: string;
            odds: number;
            impliedProbability: number;
            fairProbability: number;
            modelProbability: number;
            ev: number;
            confidence: "high" | "medium" | "low";
            reasoning: string;
            sources: string[];
        } | undefined;
    }[];
    disclaimer: string;
    recommendations: {
        type: "stable" | "balanced" | "aggressive";
        typeName: string;
        picks: {
            matchName: string;
            homeTeam: string;
            awayTeam: string;
            odds: number;
            modelProbability: number;
            ev: number;
            confidence: "high" | "medium" | "low";
            reasoning: string;
            pick: string;
        }[];
        combinedOdds: number;
        combinedProbability: number;
        combinedEV: number;
        riskLevel: "high" | "medium" | "low";
        riskScore: number;
        summary: string;
        disclaimer: string;
    }[];
    isMock: boolean;
    processingTimeMs?: number | undefined;
}, {
    id: string;
    createdAt: string;
    matches: {
        options: {
            label: string;
            odds: number;
            impliedProbability: number;
            fairProbability: number;
            modelProbability: number;
            ev: number;
            confidence: "high" | "medium" | "low";
            reasoning: string;
            sources: string[];
        }[];
        matchName: string;
        homeTeam: string;
        awayTeam: string;
        sport: string;
        overround: number;
        league?: string | undefined;
        matchDate?: string | undefined;
        selectedPick?: {
            label: string;
            odds: number;
            impliedProbability: number;
            fairProbability: number;
            modelProbability: number;
            ev: number;
            confidence: "high" | "medium" | "low";
            reasoning: string;
            sources: string[];
        } | undefined;
    }[];
    disclaimer: string;
    recommendations: {
        type: "stable" | "balanced" | "aggressive";
        typeName: string;
        picks: {
            matchName: string;
            homeTeam: string;
            awayTeam: string;
            odds: number;
            modelProbability: number;
            ev: number;
            confidence: "high" | "medium" | "low";
            reasoning: string;
            pick: string;
        }[];
        combinedOdds: number;
        combinedProbability: number;
        combinedEV: number;
        riskLevel: "high" | "medium" | "low";
        riskScore: number;
        summary: string;
        disclaimer: string;
    }[];
    isMock?: boolean | undefined;
    processingTimeMs?: number | undefined;
}>;
export declare const AnalyzeResponseSchema: z.ZodObject<{
    success: z.ZodBoolean;
    data: z.ZodOptional<z.ZodObject<{
        id: z.ZodString;
        createdAt: z.ZodString;
        matches: z.ZodArray<z.ZodObject<{
            matchName: z.ZodString;
            homeTeam: z.ZodString;
            awayTeam: z.ZodString;
            league: z.ZodOptional<z.ZodString>;
            matchDate: z.ZodOptional<z.ZodString>;
            sport: z.ZodString;
            overround: z.ZodNumber;
            options: z.ZodArray<z.ZodObject<{
                label: z.ZodString;
                odds: z.ZodNumber;
                impliedProbability: z.ZodNumber;
                fairProbability: z.ZodNumber;
                modelProbability: z.ZodNumber;
                ev: z.ZodNumber;
                confidence: z.ZodEnum<["high", "medium", "low"]>;
                reasoning: z.ZodString;
                sources: z.ZodArray<z.ZodString, "many">;
            }, "strip", z.ZodTypeAny, {
                label: string;
                odds: number;
                impliedProbability: number;
                fairProbability: number;
                modelProbability: number;
                ev: number;
                confidence: "high" | "medium" | "low";
                reasoning: string;
                sources: string[];
            }, {
                label: string;
                odds: number;
                impliedProbability: number;
                fairProbability: number;
                modelProbability: number;
                ev: number;
                confidence: "high" | "medium" | "low";
                reasoning: string;
                sources: string[];
            }>, "many">;
            selectedPick: z.ZodOptional<z.ZodObject<{
                label: z.ZodString;
                odds: z.ZodNumber;
                impliedProbability: z.ZodNumber;
                fairProbability: z.ZodNumber;
                modelProbability: z.ZodNumber;
                ev: z.ZodNumber;
                confidence: z.ZodEnum<["high", "medium", "low"]>;
                reasoning: z.ZodString;
                sources: z.ZodArray<z.ZodString, "many">;
            }, "strip", z.ZodTypeAny, {
                label: string;
                odds: number;
                impliedProbability: number;
                fairProbability: number;
                modelProbability: number;
                ev: number;
                confidence: "high" | "medium" | "low";
                reasoning: string;
                sources: string[];
            }, {
                label: string;
                odds: number;
                impliedProbability: number;
                fairProbability: number;
                modelProbability: number;
                ev: number;
                confidence: "high" | "medium" | "low";
                reasoning: string;
                sources: string[];
            }>>;
        }, "strip", z.ZodTypeAny, {
            options: {
                label: string;
                odds: number;
                impliedProbability: number;
                fairProbability: number;
                modelProbability: number;
                ev: number;
                confidence: "high" | "medium" | "low";
                reasoning: string;
                sources: string[];
            }[];
            matchName: string;
            homeTeam: string;
            awayTeam: string;
            sport: string;
            overround: number;
            league?: string | undefined;
            matchDate?: string | undefined;
            selectedPick?: {
                label: string;
                odds: number;
                impliedProbability: number;
                fairProbability: number;
                modelProbability: number;
                ev: number;
                confidence: "high" | "medium" | "low";
                reasoning: string;
                sources: string[];
            } | undefined;
        }, {
            options: {
                label: string;
                odds: number;
                impliedProbability: number;
                fairProbability: number;
                modelProbability: number;
                ev: number;
                confidence: "high" | "medium" | "low";
                reasoning: string;
                sources: string[];
            }[];
            matchName: string;
            homeTeam: string;
            awayTeam: string;
            sport: string;
            overround: number;
            league?: string | undefined;
            matchDate?: string | undefined;
            selectedPick?: {
                label: string;
                odds: number;
                impliedProbability: number;
                fairProbability: number;
                modelProbability: number;
                ev: number;
                confidence: "high" | "medium" | "low";
                reasoning: string;
                sources: string[];
            } | undefined;
        }>, "many">;
        recommendations: z.ZodArray<z.ZodObject<{
            type: z.ZodEnum<["stable", "balanced", "aggressive"]>;
            typeName: z.ZodString;
            picks: z.ZodArray<z.ZodObject<{
                matchName: z.ZodString;
                homeTeam: z.ZodString;
                awayTeam: z.ZodString;
                pick: z.ZodString;
                odds: z.ZodNumber;
                modelProbability: z.ZodNumber;
                ev: z.ZodNumber;
                confidence: z.ZodEnum<["high", "medium", "low"]>;
                reasoning: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                matchName: string;
                homeTeam: string;
                awayTeam: string;
                odds: number;
                modelProbability: number;
                ev: number;
                confidence: "high" | "medium" | "low";
                reasoning: string;
                pick: string;
            }, {
                matchName: string;
                homeTeam: string;
                awayTeam: string;
                odds: number;
                modelProbability: number;
                ev: number;
                confidence: "high" | "medium" | "low";
                reasoning: string;
                pick: string;
            }>, "many">;
            combinedOdds: z.ZodNumber;
            combinedProbability: z.ZodNumber;
            combinedEV: z.ZodNumber;
            riskLevel: z.ZodEnum<["low", "medium", "high"]>;
            riskScore: z.ZodNumber;
            summary: z.ZodString;
            disclaimer: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            type: "stable" | "balanced" | "aggressive";
            typeName: string;
            picks: {
                matchName: string;
                homeTeam: string;
                awayTeam: string;
                odds: number;
                modelProbability: number;
                ev: number;
                confidence: "high" | "medium" | "low";
                reasoning: string;
                pick: string;
            }[];
            combinedOdds: number;
            combinedProbability: number;
            combinedEV: number;
            riskLevel: "high" | "medium" | "low";
            riskScore: number;
            summary: string;
            disclaimer: string;
        }, {
            type: "stable" | "balanced" | "aggressive";
            typeName: string;
            picks: {
                matchName: string;
                homeTeam: string;
                awayTeam: string;
                odds: number;
                modelProbability: number;
                ev: number;
                confidence: "high" | "medium" | "low";
                reasoning: string;
                pick: string;
            }[];
            combinedOdds: number;
            combinedProbability: number;
            combinedEV: number;
            riskLevel: "high" | "medium" | "low";
            riskScore: number;
            summary: string;
            disclaimer: string;
        }>, "many">;
        isMock: z.ZodDefault<z.ZodBoolean>;
        disclaimer: z.ZodString;
        processingTimeMs: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        createdAt: string;
        matches: {
            options: {
                label: string;
                odds: number;
                impliedProbability: number;
                fairProbability: number;
                modelProbability: number;
                ev: number;
                confidence: "high" | "medium" | "low";
                reasoning: string;
                sources: string[];
            }[];
            matchName: string;
            homeTeam: string;
            awayTeam: string;
            sport: string;
            overround: number;
            league?: string | undefined;
            matchDate?: string | undefined;
            selectedPick?: {
                label: string;
                odds: number;
                impliedProbability: number;
                fairProbability: number;
                modelProbability: number;
                ev: number;
                confidence: "high" | "medium" | "low";
                reasoning: string;
                sources: string[];
            } | undefined;
        }[];
        disclaimer: string;
        recommendations: {
            type: "stable" | "balanced" | "aggressive";
            typeName: string;
            picks: {
                matchName: string;
                homeTeam: string;
                awayTeam: string;
                odds: number;
                modelProbability: number;
                ev: number;
                confidence: "high" | "medium" | "low";
                reasoning: string;
                pick: string;
            }[];
            combinedOdds: number;
            combinedProbability: number;
            combinedEV: number;
            riskLevel: "high" | "medium" | "low";
            riskScore: number;
            summary: string;
            disclaimer: string;
        }[];
        isMock: boolean;
        processingTimeMs?: number | undefined;
    }, {
        id: string;
        createdAt: string;
        matches: {
            options: {
                label: string;
                odds: number;
                impliedProbability: number;
                fairProbability: number;
                modelProbability: number;
                ev: number;
                confidence: "high" | "medium" | "low";
                reasoning: string;
                sources: string[];
            }[];
            matchName: string;
            homeTeam: string;
            awayTeam: string;
            sport: string;
            overround: number;
            league?: string | undefined;
            matchDate?: string | undefined;
            selectedPick?: {
                label: string;
                odds: number;
                impliedProbability: number;
                fairProbability: number;
                modelProbability: number;
                ev: number;
                confidence: "high" | "medium" | "low";
                reasoning: string;
                sources: string[];
            } | undefined;
        }[];
        disclaimer: string;
        recommendations: {
            type: "stable" | "balanced" | "aggressive";
            typeName: string;
            picks: {
                matchName: string;
                homeTeam: string;
                awayTeam: string;
                odds: number;
                modelProbability: number;
                ev: number;
                confidence: "high" | "medium" | "low";
                reasoning: string;
                pick: string;
            }[];
            combinedOdds: number;
            combinedProbability: number;
            combinedEV: number;
            riskLevel: "high" | "medium" | "low";
            riskScore: number;
            summary: string;
            disclaimer: string;
        }[];
        isMock?: boolean | undefined;
        processingTimeMs?: number | undefined;
    }>>;
    error: z.ZodOptional<z.ZodObject<{
        code: z.ZodString;
        message: z.ZodString;
        retryable: z.ZodBoolean;
    }, "strip", z.ZodTypeAny, {
        message: string;
        code: string;
        retryable: boolean;
    }, {
        message: string;
        code: string;
        retryable: boolean;
    }>>;
}, "strip", z.ZodTypeAny, {
    success: boolean;
    data?: {
        id: string;
        createdAt: string;
        matches: {
            options: {
                label: string;
                odds: number;
                impliedProbability: number;
                fairProbability: number;
                modelProbability: number;
                ev: number;
                confidence: "high" | "medium" | "low";
                reasoning: string;
                sources: string[];
            }[];
            matchName: string;
            homeTeam: string;
            awayTeam: string;
            sport: string;
            overround: number;
            league?: string | undefined;
            matchDate?: string | undefined;
            selectedPick?: {
                label: string;
                odds: number;
                impliedProbability: number;
                fairProbability: number;
                modelProbability: number;
                ev: number;
                confidence: "high" | "medium" | "low";
                reasoning: string;
                sources: string[];
            } | undefined;
        }[];
        disclaimer: string;
        recommendations: {
            type: "stable" | "balanced" | "aggressive";
            typeName: string;
            picks: {
                matchName: string;
                homeTeam: string;
                awayTeam: string;
                odds: number;
                modelProbability: number;
                ev: number;
                confidence: "high" | "medium" | "low";
                reasoning: string;
                pick: string;
            }[];
            combinedOdds: number;
            combinedProbability: number;
            combinedEV: number;
            riskLevel: "high" | "medium" | "low";
            riskScore: number;
            summary: string;
            disclaimer: string;
        }[];
        isMock: boolean;
        processingTimeMs?: number | undefined;
    } | undefined;
    error?: {
        message: string;
        code: string;
        retryable: boolean;
    } | undefined;
}, {
    success: boolean;
    data?: {
        id: string;
        createdAt: string;
        matches: {
            options: {
                label: string;
                odds: number;
                impliedProbability: number;
                fairProbability: number;
                modelProbability: number;
                ev: number;
                confidence: "high" | "medium" | "low";
                reasoning: string;
                sources: string[];
            }[];
            matchName: string;
            homeTeam: string;
            awayTeam: string;
            sport: string;
            overround: number;
            league?: string | undefined;
            matchDate?: string | undefined;
            selectedPick?: {
                label: string;
                odds: number;
                impliedProbability: number;
                fairProbability: number;
                modelProbability: number;
                ev: number;
                confidence: "high" | "medium" | "low";
                reasoning: string;
                sources: string[];
            } | undefined;
        }[];
        disclaimer: string;
        recommendations: {
            type: "stable" | "balanced" | "aggressive";
            typeName: string;
            picks: {
                matchName: string;
                homeTeam: string;
                awayTeam: string;
                odds: number;
                modelProbability: number;
                ev: number;
                confidence: "high" | "medium" | "low";
                reasoning: string;
                pick: string;
            }[];
            combinedOdds: number;
            combinedProbability: number;
            combinedEV: number;
            riskLevel: "high" | "medium" | "low";
            riskScore: number;
            summary: string;
            disclaimer: string;
        }[];
        isMock?: boolean | undefined;
        processingTimeMs?: number | undefined;
    } | undefined;
    error?: {
        message: string;
        code: string;
        retryable: boolean;
    } | undefined;
}>;
export declare const HealthResponseSchema: z.ZodObject<{
    status: z.ZodEnum<["ok", "degraded", "error"]>;
    version: z.ZodString;
    timestamp: z.ZodString;
    openaiModel: z.ZodString;
    mockMode: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    status: "error" | "ok" | "degraded";
    version: string;
    timestamp: string;
    openaiModel: string;
    mockMode: boolean;
}, {
    status: "error" | "ok" | "degraded";
    version: string;
    timestamp: string;
    openaiModel: string;
    mockMode: boolean;
}>;
export type OddsOption = z.infer<typeof OddsOptionSchema>;
export type HandicapInfo = z.infer<typeof HandicapSchema>;
export type ExtractedMatch = z.infer<typeof ExtractedMatchSchema>;
export type GeminiExtraction = z.infer<typeof GeminiExtractionSchema>;
export type ProbabilityResult = z.infer<typeof ProbabilityResultSchema>;
export type MatchAnalysis = z.infer<typeof MatchAnalysisSchema>;
export type ComboType = z.infer<typeof ComboTypeSchema>;
export type ComboPick = z.infer<typeof ComboPick>;
export type ComboRecommendation = z.infer<typeof ComboRecommendationSchema>;
export type AnalysisResult = z.infer<typeof AnalysisResultSchema>;
export type AnalyzeResponse = z.infer<typeof AnalyzeResponseSchema>;
export type HealthResponse = z.infer<typeof HealthResponseSchema>;
