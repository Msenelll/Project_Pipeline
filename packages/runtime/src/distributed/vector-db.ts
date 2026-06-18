export interface VectorDocument {
  id: string;
  text: string;
  metadata: Record<string, any>;
  wordWeights: Map<string, number>;
}

export class VectorDatabaseService {
  private documents: VectorDocument[] = [];

  // Add a document and calculate its term frequencies as mock embedding weights
  public async addDocument(id: string, text: string, metadata: Record<string, any> = {}): Promise<void> {
    const wordWeights = this.calculateWordWeights(text);
    this.documents.push({
      id,
      text,
      metadata,
      wordWeights
    });
    console.log(`[VectorDatabaseService] Indexed document: ${id} (Words: ${wordWeights.size})`);
  }

  // Find similar documents using Cosine Similarity of term weights
  public async searchSimilarity(
    query: string,
    limit: number = 3
  ): Promise<Array<{ id: string; text: string; score: number; metadata: Record<string, any> }>> {
    const queryWeights = this.calculateWordWeights(query);
    
    const scores = this.documents.map(doc => {
      const score = this.calculateCosineSimilarity(queryWeights, doc.wordWeights);
      return {
        id: doc.id,
        text: doc.text,
        score,
        metadata: doc.metadata
      };
    });

    // Sort descending by score
    return scores
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  // Clear database
  public clear(): void {
    this.documents = [];
  }

  // Helper: Term frequency calculation (normalized words)
  private calculateWordWeights(text: string): Map<string, number> {
    const weights = new Map<string, number>();
    const words = text
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(w => w.length > 2); // Exclude short stop words

    words.forEach(word => {
      weights.set(word, (weights.get(word) || 0) + 1);
    });

    // Normalize weights
    let sumSquares = 0;
    for (const val of weights.values()) {
      sumSquares += val * val;
    }
    const magnitude = Math.sqrt(sumSquares);

    if (magnitude > 0) {
      for (const [key, val] of weights.entries()) {
        weights.set(key, val / magnitude);
      }
    }

    return weights;
  }

  // Helper: Cosine Similarity between two weight maps
  private calculateCosineSimilarity(vecA: Map<string, number>, vecB: Map<string, number>): number {
    let dotProduct = 0;
    
    // vecA is normalized query, vecB is normalized doc
    for (const [word, weightA] of vecA.entries()) {
      const weightB = vecB.get(word);
      if (weightB) {
        dotProduct += weightA * weightB;
      }
    }
    
    return dotProduct;
  }
}
