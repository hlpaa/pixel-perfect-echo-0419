import { describe, expect, it } from "vitest";
import { addDays, daysOfFood, whatsappLink } from "./plan";

describe("plano", () => {
  it("pacote de 10 kg a 250 g/dia dura 40 dias", () => expect(daysOfFood(10, 250)).toBe(40));
  it("valores inválidos dão 0 dias", () => expect(daysOfFood(0, 250)).toBe(0));
  it("soma dias atravessando o mês", () => expect(addDays("2026-11-25", 10)).toBe("2026-12-05"));
  it("adiciona 55 ao número do WhatsApp", () => expect(whatsappLink("(81) 99999-0000", "oi")).toBe("https://wa.me/5581999990000?text=oi"));
});
