/*
 * BSD 3-Clause License
 *
 * Copyright (c) 2022, kratapps.com
 * See the LICENSE: https://github.com/kratapps/component-library/blob/main/LICENSE
 */

/**
 * @file Modal for Error Handler.
 *
 * @link    https://docs.kratapps.com/component-library/error-handler
 *
 * @author  kratapps.com
 */
import { api } from 'lwc';

import LightningModal from 'lightning/modal';

export const standardActions = [{ label: 'Close', variant: 'neutral', name: 'close' }];

export default class ErrorHandlerModal extends LightningModal {
    @api label;
    @api message;
    @api fieldErrors;
    @api actions;

    get allActions() {
        return this.actions ?? standardActions;
    }

    get allFieldErrors() {
        return (this.fieldErrors ?? []).map((it) => ({
            ...it,
            key: it.fieldName ?? it.field ?? it.fieldLabel
        }));
    }

    handleActionClick(event) {
        const action = this.allActions.find((it) => it.name === event.target.name);
        if (action.onclick) {
            action.onclick();
        }
        this.close(action.name);
    }
}
