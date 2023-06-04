import testFn from "../src/index";

test('doest test function return "result"?', () => {
  expect(testFn()).toBe("result");
});
