import { createElement } from 'lwc';

import Spinner from 'c/spinner';

describe('c-spinner', () => {
    afterEach(() => {
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('does not render spinner when by default is not loading', () => {
        const element = createElement('c-spinner', {
            is: Spinner
        });
        document.body.appendChild(element);
        const spinner = element.shadowRoot.querySelector('lightning-spinner');
        expect(spinner).toBeNull();
    });

    it('renders spinner when loading', async () => {
        const element = createElement('c-spinner', {
            is: Spinner
        });
        document.body.appendChild(element);
        await element.show();
        const spinner = element.shadowRoot.querySelector('lightning-spinner');
        expect(spinner).not.toBeNull();
    });

    it('does not render spinner when not loading', async () => {
        const element = createElement('c-spinner', {
            is: Spinner
        });
        document.body.appendChild(element);
        await element.show();
        let spinner = element.shadowRoot.querySelector('lightning-spinner');
        expect(spinner).not.toBeNull();
        await element.hide();
        spinner = element.shadowRoot.querySelector('lightning-spinner');
        expect(spinner).toBeNull();
    });
});
