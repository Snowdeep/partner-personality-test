export interface Question {
  id: number;
  gender: 'both' | 'male' | 'female';
  category: 'attitude' | 'traits' | 'interaction' | 'communication';
  question: string;
  emoji: string;
  options: Array<{
    text: string;
    weights: Record<string, string>;
  }>;
}

export interface ScoreResult {
  attitude: Record<string, number>;
  traits: Record<string, number>;
  interaction: Record<string, number>;
  communication: Record<string, number>;
}

export interface PersonalityLabel {
  id: string;
  name: string;
  combination: {
    attitude: string;
    traits: string;
    interaction: string;
    communication: string;
  };
  overview: string;
  lovingStyle: string;
  advice: string;
  caution: string;
}

export interface FinalResult {
  userId: string;
  gender: 'male' | 'female';
  scores: ScoreResult;
  result: {
    attitude: string;
    traits: string;
    interaction: string;
    communication: string;
  };
  labelId: string;
  labelName: string;
  timestamp: Date;
}
