type EntityResolver = {
  query?: object;
  mutation?: object;
  resolver?: object;
};

export function addResolvers(resolvers: EntityResolver[]) {
  const parent = {
    Query: {},
    Mutation: {}
  };

  for (let resolver of resolvers) {
    if (resolver.query) {
      // tslint:disable-next-line:prefer-object-spread
      parent.Query = { ...parent.Query, ...resolver.query };
    }
    if (resolver.mutation) {
      parent.Mutation = { ...parent.Mutation, ...resolver.mutation };
    }
    if (resolver.resolver) {
      Object.assign(parent, resolver.resolver);
    }
  }

  return parent;
}

export default addResolvers;
