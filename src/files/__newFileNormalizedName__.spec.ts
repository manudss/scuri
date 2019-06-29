import { autoSpy } from 'autoSpy';
import { <%= className %> } from './<%= normalizedName %>';

describe('<%= className %>', () => {
  <% publicMethods.forEach(meth=> { %>it('when <%= meth %> is called it should', () => {
    // arrange
    const { build } = setup().default();
    const c = build();
    // act
    c.<%= meth %>();
    // assert
    // expect(c).toEqual
  });

  <% }) %>
});

function setup() {
  <%= toDeclaration() %>
  const builder = {
    <%= toBuilderExports() %>
    default() {
      return builder;
    },
    build() {
      return new <%= className %>(<%= toConstructorParams() %>);
    }
  };

  return builder;
}
