import { describe, expect, it } from "vitest";
import { match } from "./int";

describe("match", () => {
  it("should return true if input string is composed entirely of numeric characters", () => {
    const result = match("0123456789");
    expect(result).toBe(true)
  })

  it("should return false if input string contains any non-numeric characters", () => {
    expect(match("0 ")).toBe(false)
    expect(match(" 1")).toBe(false)
    expect(match("%$^@*?")).toBe(false)
    expect(match("h3y")).toBe(false)
  })
})