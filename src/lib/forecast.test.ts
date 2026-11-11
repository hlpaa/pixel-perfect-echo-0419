import { describe, expect, it } from "vitest";
import { estimateDays, estimateEndDate, daysRemaining, foodStatus } from "./forecast";

describe("previsão de consumo", () => {
  it("pacote de 10 kg com 200 g/dia dura 50 dias", () => {
    expect(estimateDays(10000, 200)).toBe(50);
  });
  it("data de término = abertura + dias estimados", () => {
    expect(estimateEndDate("2026-01-01", 10000, 200)).toBe("2026-02-20");
  });
  it("sem consumo informado não gera previsão automática", () => {
    expect(estimateEndDate("2026-01-01", 10000, null)).toBeNull();
  });
  it("data manual tem prioridade", () => {
    expect(estimateEndDate("2026-01-01", 10000, null, "2026-03-10")).toBe("2026-03-10");
  });
  it("dias restantes", () => {
    expect(daysRemaining("2026-02-20", "2026-02-10")).toBe(10);
  });
});

describe("semáforo da alimentação", () => {
  it("vermelho quando a previsão é atingida", () => {
    expect(foodStatus(0, 7)).toBe("critico");
    expect(foodStatus(-3, 7)).toBe("critico");
  });
  it("amarelo dentro da antecedência do alerta", () => {
    expect(foodStatus(7, 7)).toBe("proximo");
  });
  it("verde com estoque suficiente", () => {
    expect(foodStatus(8, 7)).toBe("ok");
  });
  it("sem dados quando não há previsão", () => {
    expect(foodStatus(null, 7)).toBe("sem_dados");
  });
});
