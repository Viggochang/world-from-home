import { getBirthdayString } from "./Birthday";

describe("getBirthdayString_1", () => {
  it("should return empty string if birthday = new Data(1900, 0, 1)", () => {
    const birthday = new Date(1900, 0, 1);
    expect(getBirthdayString(birthday)).toEqual("");
  });
});

describe("getBirthdayString_2", () => {
  it("should return new Data() if birthday = new Data()", () => {
    const birthday = new Date();
    expect(getBirthdayString(birthday)).toEqual(
      new Date().toDateString().slice(4)
    );
  });
});
