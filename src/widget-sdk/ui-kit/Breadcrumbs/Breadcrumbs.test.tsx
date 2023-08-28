/// <reference types="@types/jest" />;
import { render } from '@testing-library/preact';

import Breadcrumbs from './Breadcrumbs';
import { pages } from './MockPages';

describe('WidgetSDK - UIKit/Breadcrumbs', () => {
  it('renders', () => {
    const { container } = render(<Breadcrumbs pages={pages} />);

    const elem = container.querySelector('.ds-sdk-breadcrumbs');

    expect(!!elem).toEqual(true);
  });
});
