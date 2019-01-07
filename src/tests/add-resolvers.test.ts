import { addResolvers } from '../add-resolvers';

it('adds resolvers from child modules', () => {
  expect(
    addResolvers([
      {
        query: { a: 1 }
      },
      {
        mutation: { b: 1 }
      },
      {
        resolver: {
          Foo: {}
        }
      },
      {
        query: { c: 1 },
        mutation: { d: 1 },
        resolver: { Boo: {} }
      }
    ])
  ).toEqual({ Boo: {}, Foo: {}, Mutation: { b: 1, d: 1 }, Query: { a: 1, c: 1 } });
});
