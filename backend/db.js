const mongoose = require('mongoose');

// mongoose.connect('mongodb+srv://mayureshpitambare:Riddhi24@cluster0.6laimla.mongodb.net/paytmApp');

// Simple Schema defination
// const UserSchema = new mongoose.Schema({
//     username: String,
//     password: String,
//     firstName: String,
//     lastName: String
// });

// Elegant Schema Defination
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minLength: 3,
        maxLength: 30
    },

    password: {
        type: String,
        required: true,
        minLength: 6
    },

    firstname: {
        type: String,
        required: true,
        trim: true,
        maxLength: 30
    },

    lastname: {
        type: String,
        required: true,
        trim: true,
        maxLength: 30
    },
});

const AccountSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    balance: {
        type: Number,
        required: true
    }
});

const User = mongoose.model('User', UserSchema);
const Account = mongoose.model('Account', AccountSchema);

module.exports = {
    User,
    Account
}







import {LitElement, html, css} from 'lit';
import {PTCS} from '../../utils/ptcs-utils/library.js';
import '../../behaviors/ptcs-behavior-tabindex/ptcs-behavior-tabindex.js';
import '../../behaviors/ptcs-behavior-tooltip/ptcs-behavior-tooltip.js';
import '../../behaviors/ptcs-behavior-focus/ptcs-behavior-focus.js';
import '../../behaviors/ptcs-behavior-styleable/ptcs-behavior-styleable.js';

const placement_object = {
    top_start:    'top start',
    top:          'top center',
    top_end:      'top end',
    bottom_start: 'bottom start',
    bottom:       'bottom center',
    bottom_end:   'bottom end'
};

const timeout_object = {
    none:  0,
    short: 4000,
    long:  10000
};

const iconMap = {
    'informational': 'cds:icon_info',
    'success': 'cds:icon_success',
    'warning': 'cds:icon_warning'
};

PTCS.Toast = class extends (PTCS.BehaviorTabindex(PTCS.BehaviorTooltip(PTCS.BehaviorFocus(PTCS.BehaviorStyleable(LitElement))))) {

    static get styles() {
        return css`
            .toast-container {
                /* position: absolute !important; */
                transition: transform 0.3s ease-in-out;
            }

            .toast-messages-container {
                position: absolute;
                /* top: 20px;
                right: 20px; */
                height: 300px;
                width: 500px;
                display: flex;
                flex-direction: column; 
                gap: 10px;
            }

            :host([variant="dark"]) [part="close-button"]:not(:hover) {
                color: white;
                border-color: white;
            }

            [part="info-svg"] {
                padding: 8px;
                fill: #197bc0;
            }
        `;
    }

    render() {

        if (this.variant !== 'dark') {
            this.currentMsgIcon = iconMap[this.variant] || '';
        }

        const colorBar = (this.showColorBar && this.variant !== 'dark') ? html `<div part="color-bar"></div>`: html ``;

        const messageIcon = this.showMessageIcon && this.variant !== 'dark' && this.currentMsgIcon === 'cds:icon_info' ?
        html `<div part="message-icon"><svg part="info-svg" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
        <g clip-path="url(#a)">
          <path fill-rule="evenodd" d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0ZM9 6v7H7V6h2ZM8 5a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clip-rule="evenodd"/>
        </g>
        <defs>
          <clipPath id="a">
            <path d="M0 0h16v16H0z"/>
          </clipPath>
        </defs>
      </svg></div>` :
        (this.showMessageIcon && this.variant !== 'dark') ? html `<div part="message-icon">
            <ptcs-icon part="icon" size="small" icon=${this.currentMsgIcon}></ptcs-icon></div>` : html ``;
        

        const messageTitle = (this.showMessageTitle && this.variant !== 'dark') ? html `
        <div part="title-container">
        <ptcs-label
        part="message-title"
        .label=${this.messageTitle.trim() ? this.messageTitle :this.variant.charAt(0).toUpperCase() + this.variant.slice(1)}
        multi-line
        style="max-width: ${this.maxWidth}px;"
        ></ptcs-label></div>`: html ``;

        let toastComponent = html`
        ${!this._dimissToast ? html`<div part="toast-container" class="toast-container">
          ${colorBar}
          ${messageIcon}
          <div part="content-container">
            ${messageTitle}
            <div part="message-container">
                <ptcs-label
                part="toast-label"
                .label=${this.label}
                .tooltip=${this.tooltip}
                multi-line
                style="max-width: ${this.maxWidth}px;"
            ></ptcs-label>
            </div>
            <div part="toast-slot">
                ${this.showMessageLink && this.variant !== 'dark' ? html`<slot name="toast-slot"></slot>`: html``}
            </div>
          </div>
          <ptcs-button
            part="close-button"
            variant="small"
            mode="icon"
            icon="cds:icon_close_mini"
            icon-placement="left"
            content-align="center"
            role="button"
            icon-width="18"
            icon-height="18"
            @click=${this.dismissToastComponent}
          ></ptcs-button>
        </div>`: html ``}
        `;

        return html `
            <div class="toast-messages-container">
                ${this._toastMessages.map((message) => {
                    return toastComponent;
                })}
            </div>
        `;
    }

    static get is() {
        return 'ptcs-toast';
    }

    constructor() {
        super();
        this.label = '';
        this.maxWidth = '344';
        this.placement = '';
        this.timeout = '';
        this.noTabindex = true;
        this.variant = '';
        this.showColorBar = false;
        this.showMessageIcon = false;
        this.currentMsgIcon = '';
        this.showMessageTitle = false;
        this.messageTitle = '';
        this.showMessageLink = false;
        this._dimissToast = false;
        this._toastMessages = ["Message1"];
    }

    firstUpdated() {
        super.firstUpdated();
        document.addEventListener('keydown', this._handleKeyDown.bind(this));
    }

    _addToastMessage(message) {
        this._toastMessages.push(message);
        this.requestUpdate('_toastMessages');
    }

    _handleKeyDown(e) {
        this._addToastMessage("addToastCalled");
        if (e.key === 'Escape') {
            this.dismissToastComponent();
        }
    }

    willUpdate(changedProperties) {
        super.willUpdate(changedProperties);
        if (changedProperties.has('timeout')) {
            if (this.timeout === 'short' || this.timeout === 'long') {
                const timeoutId = setTimeout(() => {
                    this.dismissToastComponent();
                    clearTimeout(timeoutId);
                }, timeout_object[this.timeout]);
            }
        }
    }

    dismissToastComponent() {
        this._dimissToast = true;
        this.toastMessages.splice(index, 1);
        this.requestUpdate('toastMessages');
        document.removeEventListener('keydown', this._handleKeyDown);
    }

    static get properties() {
        return {
            // The text that is displayed as the message in the toast.
            label: {
                type: String,
            },

            // Sets the maximum width of the toast in pixels. If undefined, the toast will expand horizontally to
            // fit the label content until the toast hits the viewport width, at which point the label content will wrap
            // and increase the height of the toast.
            // If set, the toast will expand horizontally until it hits the max width, then the label content will wrap
            // and increase the height of the toast.
            maxWidth: {
                type:      String,
                attribute: 'max-width',
            },

            // Sets the placement of the toast on the screen. placement = 'top_start' | 'top' | 'top_end' | 'bottom_start' | 'bottom' | 'bottom_end'
            placement: {
                type:      String,
                attribute: 'placement',
                reflect:   true
            },

            // The automatic timeout for the toast in milliseconds. none: disables the timeout completly short & long: 4000 and 10000 millseconds
            timeout: {
                type:      String,
                attribute: 'timeout',
                reflect:   true
            },

            // Sets the variant of Toast.
            variant: {
                type:    String,
                value:   'dark',
                attribute: 'variant',
                reflect: true,
            },

            showColorBar: {
                type:      Boolean,
                attribute: 'show-color-bar',
                reflect: true
            },

            showMessageIcon: {
                type:      Boolean,
                attribute: 'show-message-icon',
                reflect: true
            },

            showMessageTitle: {
                type:      Boolean,
                attribute: 'show-message-title',
                reflect: true
            },

            messageTitle: {
                type:      String,
                attribute: 'message-title',
                reflect: true
            },

            showMessageLink: {
                type: Boolean,
                attribute: 'show-message-link',
            },

            _dimissToast: {
                type: Boolean,
                state: true
            },

            _toastMessages: {
                type: Array
            }
        };
    }
};

customElements.define(PTCS.Toast.is, PTCS.Toast);





import {LitElement, html, css} from 'lit';
import {PTCS} from '../../utils/ptcs-utils/library.js';
import '../../behaviors/ptcs-behavior-tabindex/ptcs-behavior-tabindex.js';
import '../../behaviors/ptcs-behavior-tooltip/ptcs-behavior-tooltip.js';
import '../../behaviors/ptcs-behavior-focus/ptcs-behavior-focus.js';
import '../../behaviors/ptcs-behavior-styleable/ptcs-behavior-styleable.js';

const placement_object = {
    top_start:    'top start',
    top:          'top center',
    top_end:      'top end',
    bottom_start: 'bottom start',
    bottom:       'bottom center',
    bottom_end:   'bottom end'
};

const timeout_object = {
    none:  0,
    short: 4000,
    long:  10000
};

const iconMap = {
    informational: 'cds:icon_info',
    success:       'cds:icon_success',
    warning:       'cds:icon_warning'
};

PTCS.Toast = class extends (PTCS.BehaviorTabindex(PTCS.BehaviorTooltip(PTCS.BehaviorFocus(PTCS.BehaviorStyleable(LitElement))))) {
    static get styles() {
        return css`
            :host([variant="dark"]) [part="close-button"]:not(:hover) {
                color: white;
                border-color: white;
            }

            [part="close-button"] {
                display: none;
            }

            [part="toast-container"]:first-child [part="close-button"] {
                display: inline-block;
            }

            #toast-1 {
                transform: translateY(75%);
            }

            [part="toast-container"] {
                /* top: 0px;
                right: 10px; */
                position: relative !important;
                transition: transform 0.3s ease-in-out;
                /* transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out; */
                /* opacity: 0; */
                /* transform: translateY(-50%); */
            }

            /* .show {
                opacity: 1;
                transform: translateY(100%);
            } */

            [part~="toast-messages-container"] {
                position: absolute;
                height: max-content;
                width: max-content;
                max-width: fit-content;
                max-height: 130px;
                overflow-y: hidden;
                display: flex;
                flex-direction: column; 
                gap: 10px;
                background-color: pink
            }

            :host([placement="top_start"]) [part~="toast-messages-container"] {
                top: 24px;
                left: 24px;
            }

            :host([placement="top"]) [part~="toast-messages-container"] {
                top: 24px;
                left: 50%;
                transform: translateX(-50%);
            }

            :host([placement="top_end"]) [part~="toast-messages-container"] {
                top: 24px;
                right: 24px;
            }

            :host([placement="bottom_start"]) [part~="toast-messages-container"] {
                bottom: 24px;
                left: 24px;
            }

            :host([placement="bottom"]) [part~="toast-messages-container"] {
                bottom: 24px;
                left: 50%;
                transform: translateX(-50%);
            }

            :host([placement="bottom_end"]) [part~="toast-messages-container"] {
                bottom: 24px;
                right: 24px;
            }


            [part="info-svg"] {
                padding: 8px;
                fill: #197bc0;
            }
        `;
    }

    render() {
        if (this.variant !== 'dark') {
            this.currentMsgIcon = iconMap[this.variant] || '';
        }

        const colorBar = (this.showColorBar && this.variant !== 'dark') ? html `<div part="color-bar"></div>` : html ``;

        let messageIcon = html``;

        if (this.showMessageIcon && this.variant !== 'dark') {
            if (this.currentMsgIcon === 'cds:icon_info') {
                messageIcon = html`<div part="message-icon">
                <svg part="info-svg" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                <g clip-path="url(#a)">
                    <path fill-rule="evenodd" d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0ZM9 6v7H7V6h2ZM8 5a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
                    clip-rule="evenodd"/>
                </g>
                <defs>
                    <clipPath id="a">
                    <path d="M0 0h16v16H0z"/>
                    </clipPath>
                </defs>
                </svg>
            </div>`;
            } else {
                messageIcon = html`<div part="message-icon">
                <ptcs-icon part="icon" size="small" icon=${this.currentMsgIcon}></ptcs-icon>
            </div>`;
            }
        }

        const messageTitle = (this.showMessageTitle && this.variant !== 'dark') ? html `
        <div part="title-container">
        <ptcs-label
        part="message-title"
        .label=${this.messageTitle.trim() ? this.messageTitle : this.variant.charAt(0).toUpperCase() + this.variant.slice(1)}
        multi-line
        style="max-width: ${this.maxWidth}px;"
        ></ptcs-label></div>` : html ``;

        const toastComponent = (messsage, toastId) => {
            return html`
            ${!this._dimissToast ? html`<div part="toast-container" id=${toastId} class=${placement_object[this.placement]}>
              ${colorBar}
              ${messageIcon}
              <div part="content-container">
                ${messageTitle}
                <div part="message-container">
                    <ptcs-label
                    part="toast-label"
                    .label=${`Toasty Toast contains ${messsage} ${toastId}`}
                    .tooltip=${this.tooltip}
                    multi-line
                    style="max-width: ${this.maxWidth}px;"
                ></ptcs-label>
                </div>
                <div part="toast-slot">
                    ${this.showMessageLink && this.variant !== 'dark' ? html`<slot name="toast-slot"></slot>` : html``}
                </div>
              </div>
              <ptcs-button
                part="close-button"
                variant="small"
                mode="icon"
                icon="cds:icon_close_mini"
                icon-placement="left"
                content-align="center"
                role="button"
                icon-width="18"
                icon-height="18"
                @click=${this._dismissToastComponent}
              ></ptcs-button>
            </div>` : html ``}
            `;
        } 

        return html `
        <div part="toast-messages-container" class=${placement_object[this.placement]}>
            ${this._toastMessages.map((message, index) => {
                const toastId = `toast-${index}`;
                return toastComponent(message, toastId);
            })}
        </div>
`;
    }

    static get is() {
        return 'ptcs-toast';
    }

    static get properties() {
        return {
            // The text that is displayed as the message in the toast.
            label: {
                type: String,
            },

            // Sets the maximum width of the toast in pixels. If undefined, the toast will expand horizontally to
            // fit the label content until the toast hits the viewport width, at which point the label content will wrap
            // and increase the height of the toast.
            // If set, the toast will expand horizontally until it hits the max width, then the label content will wrap
            // and increase the height of the toast.
            maxWidth: {
                type:      String,
                attribute: 'max-width',
            },

            // Sets the placement of the toast on the screen. placement = 'top_start' | 'top' | 'top_end' | 'bottom_start' | 'bottom' | 'bottom_end'
            placement: {
                type:      String,
                attribute: 'placement',
                reflect:   true
            },

            // The automatic timeout for the toast in milliseconds. none: disables the timeout completly short & long: 4000 and 10000 millseconds
            timeout: {
                type:      String,
                attribute: 'timeout',
                reflect:   true
            },

            // Sets the variant of Toast.
            variant: {
                type:      String,
                value:     'dark',
                attribute: 'variant',
                reflect:   true,
            },

            // Shows color bar if set to true
            showColorBar: {
                type:      Boolean,
                attribute: 'show-color-bar',
                reflect:   true
            },

            // Shows message icon if set to true
            showMessageIcon: {
                type:      Boolean,
                attribute: 'show-message-icon',
                reflect:   true
            },

            // Shows type/title of the message if set to true
            showMessageTitle: {
                type:      Boolean,
                attribute: 'show-message-title',
                reflect:   true
            },

            // The text that is displayed as the type/title of the message in the toast
            messageTitle: {
                type:      String,
                attribute: 'message-title',
                reflect:   true
            },

            // Shows link in toast if set to true
            showMessageLink: {
                type:      Boolean,
                attribute: 'show-message-link',
            },

            _dimissToast: {
                type:  Boolean,
                state: true
            },

            _toastMessages: {
                type: Array
            },
        };
    }

    constructor() {
        super();
        this.label = '';
        this.maxWidth = '344';
        this.placement = '';
        this.timeout = '';
        this.noTabindex = true;
        this.variant = '';
        this.showColorBar = false;
        this.showMessageIcon = false;
        this.currentMsgIcon = '';
        this.showMessageTitle = false;
        this.messageTitle = '';
        this.showMessageLink = false;
        this._dimissToast = false;
        this._toastMessages = ["Message1"];
    }

    willUpdate(changedProperties) {
        super.willUpdate(changedProperties);
        if (changedProperties.has('timeout')) {
            if (this.timeout === 'short' || this.timeout === 'long') {
                const timeoutId = setTimeout(() => {
                    this._dismissToastComponent();
                    clearTimeout(timeoutId);
                }, timeout_object[this.timeout]);
            }
        }
    }

    firstUpdated() {
        super.firstUpdated();
        document.addEventListener('keydown', this._handleKeyDown.bind(this));
    }

    _handleKeyDown(e) {
        this._addToastMessage(`addToastCalled`);
        if (e.key === 'Escape') {
            this._dismissToastComponent();
        }
    }

    dismissToast = new CustomEvent('dismiss-toast', {bubbles: true, composed: true});
    _dismissToastComponent(event) {
        const toastId = event.target.closest('[part="toast-container"]').id;
        if (toastId) {
            const toastComponent = this.shadowRoot.getElementById(toastId);
            if (toastComponent) {
                toastComponent.remove();
                console.log('removed', toastComponent);
                console.log(this._toastMessages);
            }
        }
        // this._dimissToast = true;
        this._toastMessages.pop();
        this.requestUpdate('toastMessages');
        document.removeEventListener('keydown', this._handleKeyDown);
    }

    _addToastMessage(message) {
        this._toastMessages.unshift(message);
        this.requestUpdate('_toastMessages');
        // const latestToast = this.shadowRoot.querySelector('[part="toast-container"]:first-child');
        // latestToast.classList.add('show');
    }
};

customElements.define(PTCS.Toast.is, PTCS.Toast);
