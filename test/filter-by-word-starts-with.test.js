const testAnyWordStartsWith = (sentence, startsWith) => {
    const re = new RegExp("\\b" + startsWith, "i");
    return re.test(sentence);
}

test('"This is fun" tests to return "true"', () => {
    expect(testAnyWordStartsWith("This is fun", "is")).toBe(true);
    expect(testAnyWordStartsWith("This is fun", "Is")).toBe(true);
    expect(testAnyWordStartsWith("This is fun", "iS")).toBe(true);
    expect(testAnyWordStartsWith("This is fun", "IS")).toBe(true);
    expect(testAnyWordStartsWith("This is fun", "Thi")).toBe(true);
    expect(testAnyWordStartsWith("This is fun", "ThI")).toBe(true);
    expect(testAnyWordStartsWith("this is fun", "ThI")).toBe(true);
    expect(testAnyWordStartsWith("this is fun", "FUN")).toBe(true);
    expect(testAnyWordStartsWith("this is fun", "Fu")).toBe(true);
});

test('"This 12tell is fun" tests to return "true"', () => {
    expect(testAnyWordStartsWith("This 12tell is fun", "1")).toBe(true);
    expect(testAnyWordStartsWith("This 12tell is fun", "12T")).toBe(true);
});

test('"This is fun" tests to return "false"', () => {
   expect(testAnyWordStartsWith("This is fun", "s")).toBe(false);
   expect(testAnyWordStartsWith("This is fun", "hiS")).toBe(false);
   expect(testAnyWordStartsWith("This is fun", "hi")).toBe(false);
   expect(testAnyWordStartsWith("this is fun", "UN")).toBe(false);
   expect(testAnyWordStartsWith("this is fun", "s fun")).toBe(false);
});

test('"This 12tell is fun" tests to return "false"', () => {
    expect(testAnyWordStartsWith("This 12tell is fun", "2t")).toBe(false);
    expect(testAnyWordStartsWith("This 12tell is fun", "tell")).toBe(false);
});
