import { stockfishEngine } from '../../engine.service';

class EngineService {
  private activeId: number | null = null;

  getBestMove(fen: string, depth = 1, skillLevel = 0): Promise<string> {
    this.stopThinking();
    const search = stockfishEngine.search({
      fen,
      limit: { depth },
      skillLevel,
      timeoutMs: 15_000,
    });
    const result = search.result.finally(() => {
      if (this.activeId === search.id) this.activeId = null;
    });
    this.activeId = search.id;
    return result;
  }

  stopThinking(): void {
    if (this.activeId === null) return;
    stockfishEngine.cancel(this.activeId);
    this.activeId = null;
  }
}

export const engineService = new EngineService();
