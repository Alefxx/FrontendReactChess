import assert from 'node:assert/strict';
import test from 'node:test';
import {
  parseStockfishEvaluation,
  stabilizeEvaluation,
} from '../src/features/stockfish/analysis/utils/evaluation.utils.ts';
import {
  calcularAlturaBarraBranca,
  formatarTextoAvaliacao,
} from '../src/features/stockfish/analysis/utils/evalBar.utils.ts';
import { MoveClassifierService } from '../src/features/stockfish/classificationmoves/service/moveClassifier.service.ts';
import { openingService } from '../src/features/stockfish/analysis/service/opening.service.ts';

test('normaliza centipawns para o ponto de vista das brancas', () => {
  const line = 'info depth 12 seldepth 18 multipv 1 score cp 132 nodes 50000';
  assert.deepEqual(parseStockfishEvaluation(line, false), {
    tipo: 'cp',
    valorOriginal: 132,
    vantagemBrancas: 1.32,
    profundidade: 12,
  });
  assert.equal(parseStockfishEvaluation(line, true)?.vantagemBrancas, -1.32);
  assert.equal(parseStockfishEvaluation(`${line} upperbound`, false), null);
});

test('preserva vencedor e distância em avaliações de mate, inclusive mate zero', () => {
  assert.equal(parseStockfishEvaluation('info depth 10 score mate 3', false)?.vantagemBrancas, 3);
  assert.equal(parseStockfishEvaluation('info depth 10 score mate -2', true)?.vantagemBrancas, 2);
  assert.equal(parseStockfishEvaluation('info depth 1 score mate 0', false)?.vantagemBrancas, -1);
  assert.equal(parseStockfishEvaluation('info depth 1 score mate 0', true)?.vantagemBrancas, 1);
});

test('suaviza ruído pequeno sem atrasar viradas importantes ou mate', () => {
  const previous = { tipo: 'cp', valorOriginal: 20, vantagemBrancas: 0.2, profundidade: 10 };
  const smallChange = { tipo: 'cp', valorOriginal: 60, vantagemBrancas: 0.6, profundidade: 11 };
  const largeChange = { tipo: 'cp', valorOriginal: -200, vantagemBrancas: -2, profundidade: 12 };
  const mate = { tipo: 'mate', valorOriginal: 4, vantagemBrancas: 4, profundidade: 13 };

  assert.equal(stabilizeEvaluation(previous, smallChange).vantagemBrancas, 0.34);
  assert.equal(stabilizeEvaluation(previous, largeChange), largeChange);
  assert.equal(stabilizeEvaluation(previous, mate), mate);
});

test('mapeia a barra de forma simétrica e formata cp/mate', () => {
  assert.equal(calcularAlturaBarraBranca(0, false), 50);
  assert.ok(calcularAlturaBarraBranca(3, false) > calcularAlturaBarraBranca(1, false));
  assert.equal(calcularAlturaBarraBranca(1, false), 100 - calcularAlturaBarraBranca(-1, false));
  assert.equal(calcularAlturaBarraBranca(1, true), 100);
  assert.equal(calcularAlturaBarraBranca(-1, true), 0);
  assert.equal(formatarTextoAvaliacao(1.26, false), '+1.3');
  assert.equal(formatarTextoAvaliacao(-0, false), '0.0');
  assert.equal(formatarTextoAvaliacao(-3, true), 'M3');
});

test('não classifica como capivara cada lance de um mate já forçado', () => {
  const losingMate = { tipo: 'mate', valorOriginal: -5, vantagemBrancas: -5, profundidade: 15 };
  const stillLosingMate = { tipo: 'mate', valorOriginal: 4, vantagemBrancas: -4, profundidade: 15 };
  const allowsMate = { tipo: 'mate', valorOriginal: 3, vantagemBrancas: -3, profundidade: 15 };
  const neutral = { tipo: 'cp', valorOriginal: 0, vantagemBrancas: 0, profundidade: 15 };

  assert.equal(MoveClassifierService.classificar(losingMate, stillLosingMate, 'w'), 2);
  assert.equal(MoveClassifierService.classificar(neutral, allowsMate, 'w'), 5);
  assert.equal(MoveClassifierService.classificar(neutral, allowsMate, 'b'), 1);
});

test('não confunde uma repetição do tabuleiro com a posição inicial', () => {
  assert.equal(openingService.isStartPosition('start'), true);
  assert.equal(
    openingService.isStartPosition('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 4 3'),
    false,
  );
});
