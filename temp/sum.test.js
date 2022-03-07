const sum = require('./sum.js')

test('basic additions', () => {
    expect(sum(1, 2)).toBe(3)
    expect(sum(1, -1)).toBe(0)
    expect(sum(-1, 2)).toBe(1)
    expect(sum(-1, -2)).toBe(-3)
    expect(sum(0, 0)).toBe(0)
});

test('object assignment', () => {
    const data = {one: 1}
    data['two'] = 2;
    expect(data).toEqual({one: 1, two: 2})
})

test('adding positive numbers can never yield zero. Testing mathematics here', () => {
    for(let a = 1; a < 10; a ++){
    for (let b =1 ; b < 10; b++){
      expect(a + b).not.toBe(0)
    }}
})

test('null', () => {
    const n = null;
    expect(n).toBeNull();
    expect(n).toBeDefined()
    expect(n).not.toBeUndefined()
    expect(n).not.toBeTruthy()
    expect(n).toBeFalsy()
})