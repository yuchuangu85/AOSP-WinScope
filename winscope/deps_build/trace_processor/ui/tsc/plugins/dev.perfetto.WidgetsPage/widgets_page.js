"use strict";
// Copyright (C) 2025 The Android Open Source Project
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
Object.defineProperty(exports, "__esModule", { value: true });
exports.WidgetsPage = void 0;
const tslib_1 = require("tslib");
const mithril_1 = tslib_1.__importDefault(require("mithril"));
const classnames_1 = require("../../base/classnames");
const object_utils_1 = require("../../base/object_utils");
const semantic_icons_1 = require("../../base/semantic_icons");
const anchor_1 = require("../../widgets/anchor");
const button_1 = require("../../widgets/button");
const callout_1 = require("../../widgets/callout");
const checkbox_1 = require("../../widgets/checkbox");
const editor_1 = require("../../widgets/editor");
const empty_state_1 = require("../../widgets/empty_state");
const form_1 = require("../../widgets/form");
const hotkey_glyphs_1 = require("../../widgets/hotkey_glyphs");
const icon_1 = require("../../widgets/icon");
const menu_1 = require("../../widgets/menu");
const modal_1 = require("../../widgets/modal");
const multiselect_1 = require("../../widgets/multiselect");
const popup_1 = require("../../widgets/popup");
const portal_1 = require("../../widgets/portal");
const select_1 = require("../../widgets/select");
const spinner_1 = require("../../widgets/spinner");
const switch_1 = require("../../widgets/switch");
const text_input_1 = require("../../widgets/text_input");
const text_paragraph_1 = require("../../widgets/text_paragraph");
const tree_1 = require("../../widgets/tree");
const vega_view_1 = require("../../components/widgets/vega_view");
const treetable_1 = require("../../components/widgets/treetable");
const common_1 = require("../../widgets/common");
const virtual_table_1 = require("../../widgets/virtual_table");
const tag_input_1 = require("../../widgets/tag_input");
const segmented_buttons_1 = require("../../widgets/segmented_buttons");
const middle_ellipsis_1 = require("../../widgets/middle_ellipsis");
const chip_1 = require("../../widgets/chip");
const track_shell_1 = require("../../widgets/track_shell");
const copyable_link_1 = require("../../widgets/copyable_link");
const copy_to_clipboard_button_1 = require("../../widgets/copy_to_clipboard_button");
const virtual_overlay_canvas_1 = require("../../widgets/virtual_overlay_canvas");
const split_panel_1 = require("../../widgets/split_panel");
const language_1 = require("../../base/perfetto_sql_lang/language");
const cursor_tooltip_1 = require("../../widgets/cursor_tooltip");
const multiselect_input_1 = require("../../widgets/multiselect_input");
const data_grid_1 = require("../../components/widgets/data_grid/data_grid");
const sql_data_source_1 = require("../../components/widgets/data_grid/sql_data_source");
const card_1 = require("../../widgets/card");
const stack_1 = require("../../widgets/stack");
const tooltip_1 = require("../../widgets/tooltip");
const tabs_1 = require("../../widgets/tabs");
const code_snippet_1 = require("../../widgets/code_snippet");
const grid_1 = require("../../widgets/grid");
const DATA_ENGLISH_LETTER_FREQUENCY = {
    table: [
        { category: 'a', amount: 8.167 },
        { category: 'b', amount: 1.492 },
        { category: 'c', amount: 2.782 },
        { category: 'd', amount: 4.253 },
        { category: 'e', amount: 12.7 },
        { category: 'f', amount: 2.228 },
        { category: 'g', amount: 2.015 },
        { category: 'h', amount: 6.094 },
        { category: 'i', amount: 6.966 },
        { category: 'j', amount: 0.253 },
        { category: 'k', amount: 1.772 },
        { category: 'l', amount: 4.025 },
        { category: 'm', amount: 2.406 },
        { category: 'n', amount: 6.749 },
        { category: 'o', amount: 7.507 },
        { category: 'p', amount: 1.929 },
        { category: 'q', amount: 0.095 },
        { category: 'r', amount: 5.987 },
        { category: 's', amount: 6.327 },
        { category: 't', amount: 9.056 },
        { category: 'u', amount: 2.758 },
        { category: 'v', amount: 0.978 },
        { category: 'w', amount: 2.36 },
        { category: 'x', amount: 0.25 },
        { category: 'y', amount: 1.974 },
        { category: 'z', amount: 0.074 },
    ],
};
const DATA_POLISH_LETTER_FREQUENCY = {
    table: [
        { category: 'a', amount: 8.965 },
        { category: 'b', amount: 1.482 },
        { category: 'c', amount: 3.988 },
        { category: 'd', amount: 3.293 },
        { category: 'e', amount: 7.921 },
        { category: 'f', amount: 0.312 },
        { category: 'g', amount: 1.377 },
        { category: 'h', amount: 1.072 },
        { category: 'i', amount: 8.286 },
        { category: 'j', amount: 2.343 },
        { category: 'k', amount: 3.411 },
        { category: 'l', amount: 2.136 },
        { category: 'm', amount: 2.911 },
        { category: 'n', amount: 5.6 },
        { category: 'o', amount: 7.59 },
        { category: 'p', amount: 3.101 },
        { category: 'q', amount: 0.003 },
        { category: 'r', amount: 4.571 },
        { category: 's', amount: 4.263 },
        { category: 't', amount: 3.966 },
        { category: 'u', amount: 2.347 },
        { category: 'v', amount: 0.034 },
        { category: 'w', amount: 4.549 },
        { category: 'x', amount: 0.019 },
        { category: 'y', amount: 3.857 },
        { category: 'z', amount: 5.62 },
    ],
};
const DATA_EMPTY = {};
const SPEC_BAR_CHART = `
{
  "$schema": "https://vega.github.io/schema/vega/v5.json",
  "description": "A basic bar chart example, with value labels shown upon mouse hover.",
  "width": 400,
  "height": 200,
  "padding": 5,

  "data": [
    {
      "name": "table"
    }
  ],

  "signals": [
    {
      "name": "tooltip",
      "value": {},
      "on": [
        {"events": "rect:mouseover", "update": "datum"},
        {"events": "rect:mouseout",  "update": "{}"}
      ]
    }
  ],

  "scales": [
    {
      "name": "xscale",
      "type": "band",
      "domain": {"data": "table", "field": "category"},
      "range": "width",
      "padding": 0.05,
      "round": true
    },
    {
      "name": "yscale",
      "domain": {"data": "table", "field": "amount"},
      "nice": true,
      "range": "height"
    }
  ],

  "axes": [
    { "orient": "bottom", "scale": "xscale" },
    { "orient": "left", "scale": "yscale" }
  ],

  "marks": [
    {
      "type": "rect",
      "from": {"data":"table"},
      "encode": {
        "enter": {
          "x": {"scale": "xscale", "field": "category"},
          "width": {"scale": "xscale", "band": 1},
          "y": {"scale": "yscale", "field": "amount"},
          "y2": {"scale": "yscale", "value": 0}
        },
        "update": {
          "fill": {"value": "steelblue"}
        },
        "hover": {
          "fill": {"value": "red"}
        }
      }
    },
    {
      "type": "text",
      "encode": {
        "enter": {
          "align": {"value": "center"},
          "baseline": {"value": "bottom"},
          "fill": {"value": "#333"}
        },
        "update": {
          "x": {"scale": "xscale", "signal": "tooltip.category", "band": 0.5},
          "y": {"scale": "yscale", "signal": "tooltip.amount", "offset": -2},
          "text": {"signal": "tooltip.amount"},
          "fillOpacity": [
            {"test": "datum === tooltip", "value": 0},
            {"value": 1}
          ]
        }
      }
    }
  ]
}
`;
const SPEC_BAR_CHART_LITE = `
{
  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
  "description": "A simple bar chart with embedded data.",
  "data": {
    "name": "table"
  },
  "mark": "bar",
  "encoding": {
    "x": {"field": "category", "type": "nominal", "axis": {"labelAngle": 0}},
    "y": {"field": "amount", "type": "quantitative"}
  }
}
`;
const SPEC_BROKEN = `{
  "description": 123
}
`;
var SpecExample;
(function (SpecExample) {
    SpecExample["BarChart"] = "Barchart";
    SpecExample["BarChartLite"] = "Barchart (Lite)";
    SpecExample["Broken"] = "Broken";
})(SpecExample || (SpecExample = {}));
var DataExample;
(function (DataExample) {
    DataExample["English"] = "English";
    DataExample["Polish"] = "Polish";
    DataExample["Empty"] = "Empty";
})(DataExample || (DataExample = {}));
function arg(anyArg, valueIfTrue, valueIfFalse = undefined) {
    return Boolean(anyArg) ? valueIfTrue : valueIfFalse;
}
function getExampleSpec(example) {
    switch (example) {
        case SpecExample.BarChart:
            return SPEC_BAR_CHART;
        case SpecExample.BarChartLite:
            return SPEC_BAR_CHART_LITE;
        case SpecExample.Broken:
            return SPEC_BROKEN;
        default:
            const exhaustiveCheck = example;
            throw new Error(`Unhandled case: ${exhaustiveCheck}`);
    }
}
function getExampleData(example) {
    switch (example) {
        case DataExample.English:
            return DATA_ENGLISH_LETTER_FREQUENCY;
        case DataExample.Polish:
            return DATA_POLISH_LETTER_FREQUENCY;
        case DataExample.Empty:
            return DATA_EMPTY;
        default:
            const exhaustiveCheck = example;
            throw new Error(`Unhandled case: ${exhaustiveCheck}`);
    }
}
const options = {
    foobar: false,
    foo: false,
    bar: false,
    baz: false,
    qux: false,
    quux: false,
    corge: false,
    grault: false,
    garply: false,
    waldo: false,
    fred: false,
    plugh: false,
    xyzzy: false,
    thud: false,
};
let currentTab = 'foo';
function PortalButton() {
    let portalOpen = false;
    return {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        view: function ({ attrs }) {
            const { zIndex = true, absolute = true, top = true } = attrs;
            return [
                (0, mithril_1.default)(button_1.Button, {
                    label: 'Toggle Portal',
                    onclick: () => {
                        portalOpen = !portalOpen;
                    },
                }),
                portalOpen &&
                    (0, mithril_1.default)(portal_1.Portal, {
                        style: {
                            position: arg(absolute, 'absolute'),
                            top: arg(top, '0'),
                            zIndex: arg(zIndex, '10', '0'),
                            background: 'white',
                        },
                    }, (0, mithril_1.default)('', `A very simple portal - a div rendered outside of the normal
              flow of the page`)),
            ];
        },
    };
}
function lorem() {
    const text = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
      tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
      veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
      commodo consequat.Duis aute irure dolor in reprehenderit in voluptate
      velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
      cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
      est laborum.`;
    return (0, mithril_1.default)('', { style: { width: '200px' } }, text);
}
function ControlledPopup() {
    let popupOpen = false;
    return {
        view: function () {
            return (0, mithril_1.default)(popup_1.Popup, {
                trigger: (0, mithril_1.default)(button_1.Button, { label: `${popupOpen ? 'Close' : 'Open'} Popup` }),
                isOpen: popupOpen,
                onChange: (shouldOpen) => (popupOpen = shouldOpen),
            }, (0, mithril_1.default)(button_1.Button, {
                label: 'Close Popup',
                onclick: () => {
                    popupOpen = !popupOpen;
                },
            }));
        },
    };
}
class EnumOption {
    initial;
    options;
    constructor(initial, options) {
        this.initial = initial;
        this.options = options;
    }
}
function recursiveTreeNode() {
    return (0, mithril_1.default)(tree_1.LazyTreeNode, {
        left: 'Recursive',
        right: '...',
        fetchData: async () => {
            // await new Promise((r) => setTimeout(r, 1000));
            return () => recursiveTreeNode();
        },
    });
}
class WidgetTitle {
    view({ attrs }) {
        const { label } = attrs;
        const id = label.replaceAll(' ', '').toLowerCase();
        const href = `#!/widgets#${id}`;
        return (0, mithril_1.default)(anchor_1.Anchor, { id, href }, (0, mithril_1.default)('h2', label));
    }
}
// A little helper class to render any vnode with a dynamic set of options
class WidgetShowcase {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    optValues = {};
    opts;
    renderOptions(listItems) {
        if (listItems.length === 0) {
            return null;
        }
        return (0, mithril_1.default)('.pf-widget-controls', (0, mithril_1.default)('h3', 'Options'), (0, mithril_1.default)('ul', listItems));
    }
    oninit({ attrs: { initialOpts: opts } }) {
        this.opts = opts;
        if (opts) {
            // Make the initial options values
            for (const key in opts) {
                if (Object.prototype.hasOwnProperty.call(opts, key)) {
                    const option = opts[key];
                    if (option instanceof EnumOption) {
                        this.optValues[key] = option.initial;
                    }
                    else {
                        this.optValues[key] = option;
                    }
                }
            }
        }
    }
    view({ attrs }) {
        const { renderWidget, wide, label, description } = attrs;
        const listItems = [];
        if (this.opts) {
            for (const key in this.opts) {
                if (Object.prototype.hasOwnProperty.call(this.opts, key)) {
                    listItems.push((0, mithril_1.default)('li', this.renderControlForOption(key)));
                }
            }
        }
        return [
            (0, mithril_1.default)(WidgetTitle, { label }),
            description && (0, mithril_1.default)('p', description),
            (0, mithril_1.default)('.pf-widget-block', (0, mithril_1.default)('div', {
                class: (0, classnames_1.classNames)('pf-widget-container', wide && 'pf-widget-container--wide'),
            }, renderWidget(this.optValues)), this.renderOptions(listItems)),
        ];
    }
    renderControlForOption(key) {
        if (!this.opts)
            return null;
        const value = this.opts[key];
        if (value instanceof EnumOption) {
            return this.renderEnumOption(key, value);
        }
        else if (typeof value === 'boolean') {
            return this.renderBooleanOption(key);
        }
        else if ((0, object_utils_1.isString)(value)) {
            return this.renderStringOption(key);
        }
        else if (typeof value === 'number') {
            return this.renderNumberOption(key);
        }
        else {
            return null;
        }
    }
    renderBooleanOption(key) {
        return (0, mithril_1.default)(checkbox_1.Checkbox, {
            checked: this.optValues[key],
            label: key,
            onchange: () => {
                this.optValues[key] = !Boolean(this.optValues[key]);
            },
        });
    }
    renderStringOption(key) {
        return (0, mithril_1.default)('label', `${key}:`, (0, mithril_1.default)(text_input_1.TextInput, {
            placeholder: key,
            value: this.optValues[key],
            oninput: (e) => {
                this.optValues[key] = e.target.value;
            },
        }));
    }
    renderNumberOption(key) {
        return (0, mithril_1.default)('label', `${key}:`, (0, mithril_1.default)(text_input_1.TextInput, {
            type: 'number',
            placeholder: key,
            value: this.optValues[key],
            oninput: (e) => {
                this.optValues[key] = Number.parseInt(e.target.value);
            },
        }));
    }
    renderEnumOption(key, opt) {
        const optionElements = opt.options.map((option) => {
            return (0, mithril_1.default)('option', { value: option }, option);
        });
        return (0, mithril_1.default)('label', `${key}:`, (0, mithril_1.default)(select_1.Select, {
            value: this.optValues[key],
            onchange: (e) => {
                const el = e.target;
                this.optValues[key] = el.value;
            },
        }, optionElements));
    }
}
const files = [
    {
        name: 'foo',
        size: '10MB',
        date: '2023-04-02',
    },
    {
        name: 'bar',
        size: '123KB',
        date: '2023-04-08',
        children: [
            {
                name: 'baz',
                size: '4KB',
                date: '2023-05-07',
            },
            {
                name: 'qux',
                size: '18KB',
                date: '2023-05-28',
                children: [
                    {
                        name: 'quux',
                        size: '4KB',
                        date: '2023-05-07',
                    },
                    {
                        name: 'corge',
                        size: '18KB',
                        date: '2023-05-28',
                        children: [
                            {
                                name: 'grault',
                                size: '4KB',
                                date: '2023-05-07',
                            },
                            {
                                name: 'garply',
                                size: '18KB',
                                date: '2023-05-28',
                            },
                            {
                                name: 'waldo',
                                size: '87KB',
                                date: '2023-05-02',
                            },
                        ],
                    },
                ],
            },
        ],
    },
    {
        name: 'fred',
        size: '8KB',
        date: '2022-12-27',
    },
];
let virtualTableData = {
    offset: 0,
    rows: [],
};
function TagInputDemo() {
    const tags = ['foo', 'bar', 'baz'];
    let tagInputValue = '';
    return {
        view: () => {
            return (0, mithril_1.default)(tag_input_1.TagInput, {
                tags,
                value: tagInputValue,
                onTagAdd: (tag) => {
                    tags.push(tag);
                    tagInputValue = '';
                },
                onChange: (value) => {
                    tagInputValue = value;
                },
                onTagRemove: (index) => {
                    tags.splice(index, 1);
                },
            });
        },
    };
}
function SegmentedButtonsDemo({ attrs }) {
    let selectedIdx = 0;
    return {
        view: () => {
            return (0, mithril_1.default)(segmented_buttons_1.SegmentedButtons, {
                ...attrs,
                options: [{ label: 'Yes' }, { label: 'Maybe' }, { label: 'No' }],
                selectedOption: selectedIdx,
                onOptionSelected: (num) => {
                    selectedIdx = num;
                },
            });
        },
    };
}
function RadioButtonGroupDemo() {
    let setting = 'no';
    console.log(setting);
    return {
        view: ({ attrs }) => {
            return (0, mithril_1.default)(button_1.ButtonGroup, [
                (0, mithril_1.default)(button_1.Button, {
                    ...attrs,
                    label: 'Yes',
                    active: setting === 'yes',
                    onclick: () => {
                        setting = 'yes';
                    },
                }),
                (0, mithril_1.default)(button_1.Button, {
                    ...attrs,
                    label: 'Maybe',
                    active: setting === 'maybe',
                    onclick: () => {
                        setting = 'maybe';
                    },
                }),
                (0, mithril_1.default)(button_1.Button, {
                    ...attrs,
                    label: 'No',
                    active: setting === 'no',
                    onclick: () => {
                        setting = 'no';
                    },
                }),
            ]);
        },
    };
}
class WidgetsPage {
    view({ attrs }) {
        return (0, mithril_1.default)('.pf-widgets-page', (0, mithril_1.default)('h1', 'Widgets'), (0, mithril_1.default)(WidgetShowcase, {
            label: 'Button',
            renderWidget: ({ label, icon, rightIcon, showAsGrid, showInlineWithText, ...rest }) => Boolean(showAsGrid)
                ? (0, mithril_1.default)('', {
                    style: {
                        display: 'grid',
                        gridTemplateColumns: 'auto auto auto',
                        gap: '4px',
                    },
                }, Object.values(common_1.Intent).map((intent) => {
                    return Object.values(button_1.ButtonVariant).map((variant) => {
                        return (0, mithril_1.default)(button_1.Button, {
                            style: {
                                width: '80px',
                            },
                            ...rest,
                            label: variant,
                            variant,
                            intent,
                        });
                    });
                }))
                : (0, mithril_1.default)('', [
                    Boolean(showInlineWithText) && 'Inline',
                    (0, mithril_1.default)(button_1.Button, {
                        icon: arg(icon, 'send'),
                        rightIcon: arg(rightIcon, 'arrow_forward'),
                        label: arg(label, 'Button', ''),
                        onclick: () => console.log('button pressed'),
                        ...rest,
                    }),
                    Boolean(showInlineWithText) && 'text',
                ]),
            initialOpts: {
                label: true,
                icon: true,
                rightIcon: false,
                disabled: false,
                intent: new EnumOption(common_1.Intent.None, Object.values(common_1.Intent)),
                active: false,
                compact: false,
                loading: false,
                variant: new EnumOption(button_1.ButtonVariant.Filled, Object.values(button_1.ButtonVariant)),
                showAsGrid: false,
                showInlineWithText: false,
                rounded: false,
            },
        }), (0, mithril_1.default)(WidgetShowcase, {
            label: 'Segmented Buttons',
            description: `
          Segmented buttons are a group of buttons where one of them is
          'selected'; they act similar to a set of radio buttons.
        `,
            renderWidget: (opts) => (0, mithril_1.default)(SegmentedButtonsDemo, opts),
            initialOpts: {
                disabled: false,
            },
        }), (0, mithril_1.default)(WidgetShowcase, {
            label: 'ButtonGroup',
            renderWidget: (opts) => (0, mithril_1.default)(stack_1.Stack, [
                (0, mithril_1.default)(button_1.ButtonGroup, [
                    (0, mithril_1.default)(button_1.Button, {
                        label: 'Commit',
                        ...opts,
                    }),
                    (0, mithril_1.default)(button_1.Button, {
                        icon: semantic_icons_1.Icons.ContextMenu,
                        ...opts,
                    }),
                ]),
                (0, mithril_1.default)(RadioButtonGroupDemo, opts),
            ]),
            initialOpts: {
                variant: new EnumOption(button_1.ButtonVariant.Filled, Object.values(button_1.ButtonVariant)),
                disabled: false,
                intent: new EnumOption(common_1.Intent.None, Object.values(common_1.Intent)),
            },
        }), (0, mithril_1.default)(WidgetShowcase, {
            label: 'Checkbox',
            renderWidget: (opts) => (0, mithril_1.default)(checkbox_1.Checkbox, { label: 'Checkbox', ...opts }),
            initialOpts: {
                disabled: false,
            },
        }), (0, mithril_1.default)(WidgetShowcase, {
            label: 'Switch',
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            renderWidget: ({ label, labelLeft, ...rest }) => (0, mithril_1.default)(switch_1.Switch, {
                label: arg(label, 'Switch'),
                labelLeft: arg(labelLeft, 'Left Label'),
                ...rest,
            }),
            initialOpts: {
                label: true,
                labelLeft: false,
                disabled: false,
            },
        }), (0, mithril_1.default)(WidgetShowcase, {
            label: 'Anchor',
            renderWidget: ({ icon, showInlineWithText, long }) => (0, mithril_1.default)('', [
                Boolean(showInlineWithText) && 'Inline',
                (0, mithril_1.default)(anchor_1.Anchor, {
                    icon: arg(icon, 'open_in_new'),
                    href: 'https://perfetto.dev/docs/',
                    target: '_blank',
                }, Boolean(long)
                    ? 'This is some really long text and it will probably overflow the container'
                    : 'Link'),
                Boolean(showInlineWithText) && 'text',
            ]),
            initialOpts: {
                icon: true,
                showInlineWithText: false,
                long: false,
            },
        }), (0, mithril_1.default)(WidgetShowcase, {
            label: 'Text Input',
            renderWidget: ({ placeholder, leftIcon, ...rest }) => (0, mithril_1.default)(text_input_1.TextInput, {
                placeholder: arg(placeholder, 'Placeholder...', ''),
                leftIcon: arg(leftIcon, 'search'),
                ...rest,
            }),
            initialOpts: {
                placeholder: true,
                disabled: false,
                leftIcon: true,
            },
        }), (0, mithril_1.default)(WidgetShowcase, {
            label: 'Select',
            renderWidget: (opts) => (0, mithril_1.default)(select_1.Select, opts, [
                (0, mithril_1.default)('option', { value: 'foo', label: 'Foo' }),
                (0, mithril_1.default)('option', { value: 'bar', label: 'Bar' }),
                (0, mithril_1.default)('option', { value: 'baz', label: 'Baz' }),
            ]),
            initialOpts: {
                disabled: false,
            },
        }), (0, mithril_1.default)(WidgetShowcase, {
            label: 'Empty State',
            renderWidget: ({ header, content }) => (0, mithril_1.default)(empty_state_1.EmptyState, {
                title: arg(header, 'No search results found...'),
            }, arg(content, (0, mithril_1.default)(button_1.Button, { label: 'Try again' }))),
            initialOpts: {
                header: true,
                content: true,
            },
        }), (0, mithril_1.default)(WidgetShowcase, {
            label: 'Card',
            description: `A card is a simple container with a shadow and rounded
          corners. It can be used to display grouped content in a visually
          appealing way.`,
            renderWidget: ({ interactive }) => (0, mithril_1.default)(card_1.Card, { interactive }, [
                (0, mithril_1.default)('h1', { style: { margin: 'unset' } }, 'Welcome!'),
                (0, mithril_1.default)('p', 'Would you like to start your journey?'),
                (0, mithril_1.default)(stack_1.Stack, { orientation: 'horizontal' }, [
                    (0, mithril_1.default)(button_1.Button, {
                        variant: button_1.ButtonVariant.Filled,
                        label: 'No thanks...',
                    }),
                    (0, mithril_1.default)(button_1.Button, {
                        intent: common_1.Intent.Primary,
                        variant: button_1.ButtonVariant.Filled,
                        label: "Let's go!",
                    }),
                ]),
            ]),
            initialOpts: { interactive: true },
        }), (0, mithril_1.default)(WidgetShowcase, {
            label: 'CardStack',
            description: `A container component that can be used to display
          multiple Card elements in a vertical stack. Cards placed in this list
          automatically have their borders adjusted to appear as one continuous
          card with thin borders between them.`,
            renderWidget: ({ direction, interactive }) => (0, mithril_1.default)(card_1.CardStack, { direction }, [
                (0, mithril_1.default)(card_1.Card, { interactive }, (0, mithril_1.default)(switch_1.Switch, { label: 'Option 1' })),
                (0, mithril_1.default)(card_1.Card, { interactive }, (0, mithril_1.default)(switch_1.Switch, { label: 'Option 2' })),
                (0, mithril_1.default)(card_1.Card, { interactive }, (0, mithril_1.default)(switch_1.Switch, { label: 'Option 3' })),
            ]),
            initialOpts: {
                direction: new EnumOption('vertical', ['vertical', 'horizontal']),
                interactive: true,
            },
        }), (0, mithril_1.default)(WidgetShowcase, {
            label: 'CopyableLink',
            renderWidget: ({ noicon }) => (0, mithril_1.default)(copyable_link_1.CopyableLink, {
                noicon: arg(noicon, true),
                url: 'https://perfetto.dev/docs/',
            }),
            initialOpts: {
                noicon: false,
            },
        }), (0, mithril_1.default)(WidgetShowcase, {
            label: 'CopyToClipboardButton',
            renderWidget: (opts) => (0, mithril_1.default)(copy_to_clipboard_button_1.CopyToClipboardButton, {
                textToCopy: 'Text to copy',
                ...opts,
            }),
            initialOpts: {
                label: 'Copy',
                variant: new EnumOption(button_1.ButtonVariant.Outlined, Object.values(button_1.ButtonVariant)),
            },
        }), (0, mithril_1.default)(WidgetShowcase, {
            label: 'Portal',
            description: `A portal is a div rendered out of normal flow
          of the hierarchy.`,
            renderWidget: (opts) => (0, mithril_1.default)(PortalButton, opts),
            initialOpts: {
                absolute: true,
                zIndex: true,
                top: true,
            },
        }), (0, mithril_1.default)(WidgetShowcase, {
            label: 'Popup',
            description: `A popup is a nicely styled portal element whose position is
        dynamically updated to appear to float alongside a specific element on
        the page, even as the element is moved and scrolled around.`,
            renderWidget: (opts) => (0, mithril_1.default)(popup_1.Popup, {
                trigger: (0, mithril_1.default)(button_1.Button, { label: 'Toggle Popup' }),
                ...opts,
            }, lorem()),
            initialOpts: {
                position: new EnumOption(popup_1.PopupPosition.Auto, Object.values(popup_1.PopupPosition)),
                closeOnEscape: true,
                closeOnOutsideClick: true,
            },
        }), (0, mithril_1.default)(WidgetShowcase, {
            label: 'Controlled Popup',
            description: `The open/close state of a controlled popup is passed in via
        the 'isOpen' attribute. This means we can get open or close the popup
        from wherever we like. E.g. from a button inside the popup.
        Keeping this state external also means we can modify other parts of the
        page depending on whether the popup is open or not, such as the text
        on this button.
        Note, this is the same component as the popup above, but used in
        controlled mode.`,
            renderWidget: (opts) => (0, mithril_1.default)(ControlledPopup, opts),
            initialOpts: {},
        }), (0, mithril_1.default)(WidgetShowcase, {
            label: 'Icon',
            renderWidget: (opts) => (0, mithril_1.default)(icon_1.Icon, { icon: 'star', ...opts }),
            initialOpts: {
                filled: false,
                intent: new EnumOption(common_1.Intent.None, Object.values(common_1.Intent)),
            },
        }), (0, mithril_1.default)(WidgetShowcase, {
            label: 'Tooltip',
            description: `A tooltip is a hover-only, useful as an alternative to the browser's inbuilt 'title' tooltip.`,
            renderWidget: (opts) => (0, mithril_1.default)(tooltip_1.Tooltip, {
                trigger: (0, mithril_1.default)(icon_1.Icon, { icon: 'Warning' }),
                ...opts,
            }, lorem()),
            initialOpts: {
                position: new EnumOption(popup_1.PopupPosition.Auto, Object.values(popup_1.PopupPosition)),
                showArrow: true,
                offset: 0,
                edgeOffset: 0,
            },
        }), (0, mithril_1.default)(WidgetShowcase, {
            label: 'MultiSelect panel',
            renderWidget: ({ ...rest }) => (0, mithril_1.default)(multiselect_1.MultiSelect, {
                options: Object.entries(options).map(([key, value]) => {
                    return {
                        id: key,
                        name: key,
                        checked: value,
                    };
                }),
                onChange: (diffs) => {
                    diffs.forEach(({ id, checked }) => {
                        options[id] = checked;
                    });
                },
                ...rest,
            }),
            initialOpts: {
                repeatCheckedItemsAtTop: false,
                fixedSize: false,
            },
        }), (0, mithril_1.default)(WidgetShowcase, {
            label: 'Popup with MultiSelect',
            renderWidget: ({ icon, ...rest }) => (0, mithril_1.default)(multiselect_1.PopupMultiSelect, {
                options: Object.entries(options).map(([key, value]) => {
                    return {
                        id: key,
                        name: key,
                        checked: value,
                    };
                }),
                popupPosition: popup_1.PopupPosition.Top,
                label: 'Multi Select',
                icon: arg(icon, semantic_icons_1.Icons.LibraryAddCheck),
                onChange: (diffs) => {
                    diffs.forEach(({ id, checked }) => {
                        options[id] = checked;
                    });
                },
                ...rest,
            }),
            initialOpts: {
                icon: true,
                showNumSelected: true,
                repeatCheckedItemsAtTop: false,
            },
        }), (0, mithril_1.default)(WidgetShowcase, {
            label: 'MultiselectInput',
            description: `Tag input with options`,
            renderWidget: () => {
                return (0, mithril_1.default)(MultiselectInputDemo);
            },
        }), (0, mithril_1.default)(WidgetShowcase, {
            label: 'Menu',
            renderWidget: () => (0, mithril_1.default)(menu_1.Menu, (0, mithril_1.default)(menu_1.MenuItem, { label: 'New', icon: 'add' }), (0, mithril_1.default)(menu_1.MenuItem, { label: 'Open', icon: 'folder_open' }), (0, mithril_1.default)(menu_1.MenuItem, { label: 'Save', icon: 'save', disabled: true }), (0, mithril_1.default)(menu_1.MenuDivider), (0, mithril_1.default)(menu_1.MenuItem, { label: 'Delete', icon: 'delete' }), (0, mithril_1.default)(menu_1.MenuDivider), (0, mithril_1.default)(menu_1.MenuItem, { label: 'Share', icon: 'share' }, (0, mithril_1.default)(menu_1.MenuItem, { label: 'Everyone', icon: 'public' }), (0, mithril_1.default)(menu_1.MenuItem, { label: 'Friends', icon: 'group' }), (0, mithril_1.default)(menu_1.MenuItem, { label: 'Specific people', icon: 'person_add' }, (0, mithril_1.default)(menu_1.MenuItem, { label: 'Alice', icon: 'person' }), (0, mithril_1.default)(menu_1.MenuItem, { label: 'Bob', icon: 'person' }))), (0, mithril_1.default)(menu_1.MenuItem, { label: 'More', icon: 'more_horiz' }, (0, mithril_1.default)(menu_1.MenuItem, { label: 'Query', icon: 'database' }), (0, mithril_1.default)(menu_1.MenuItem, { label: 'Download', icon: 'download' }), (0, mithril_1.default)(menu_1.MenuItem, { label: 'Clone', icon: 'copy_all' }))),
        }), (0, mithril_1.default)(WidgetShowcase, {
            label: 'PopupMenu',
            renderWidget: (opts) => (0, mithril_1.default)(menu_1.PopupMenu, {
                trigger: (0, mithril_1.default)(button_1.Button, {
                    label: 'Menu',
                    rightIcon: semantic_icons_1.Icons.ContextMenu,
                }),
                ...opts,
            }, (0, mithril_1.default)(menu_1.MenuItem, { label: 'New', icon: 'add' }), (0, mithril_1.default)(menu_1.MenuItem, { label: 'Open', icon: 'folder_open' }), (0, mithril_1.default)(menu_1.MenuItem, { label: 'Save', icon: 'save', disabled: true }), (0, mithril_1.default)(menu_1.MenuDivider), (0, mithril_1.default)(menu_1.MenuItem, { label: 'Delete', icon: 'delete' }), (0, mithril_1.default)(menu_1.MenuDivider), (0, mithril_1.default)(menu_1.MenuItem, { label: 'Share', icon: 'share' }, (0, mithril_1.default)(menu_1.MenuItem, { label: 'Everyone', icon: 'public' }), (0, mithril_1.default)(menu_1.MenuItem, { label: 'Friends', icon: 'group' }), (0, mithril_1.default)(menu_1.MenuItem, { label: 'Specific people', icon: 'person_add' }, (0, mithril_1.default)(menu_1.MenuItem, { label: 'Alice', icon: 'person' }), (0, mithril_1.default)(menu_1.MenuItem, { label: 'Bob', icon: 'person' }))), (0, mithril_1.default)(menu_1.MenuItem, { label: 'More', icon: 'more_horiz' }, (0, mithril_1.default)(menu_1.MenuItem, { label: 'Query', icon: 'database' }), (0, mithril_1.default)(menu_1.MenuItem, { label: 'Download', icon: 'download' }), (0, mithril_1.default)(menu_1.MenuItem, { label: 'Clone', icon: 'copy_all' }))),
            initialOpts: {
                popupPosition: new EnumOption(popup_1.PopupPosition.Bottom, Object.values(popup_1.PopupPosition)),
            },
        }), (0, mithril_1.default)(WidgetShowcase, {
            label: 'CursorTooltip',
            description: 'A tooltip that follows the mouse around.',
            renderWidget: () => (0, mithril_1.default)(CursorTooltipShowcase),
        }), (0, mithril_1.default)(WidgetShowcase, {
            label: 'Spinner',
            description: `Simple spinner, rotates forever.
            Width and height match the font size.`,
            renderWidget: ({ fontSize, easing }) => (0, mithril_1.default)('', { style: { fontSize } }, (0, mithril_1.default)(spinner_1.Spinner, { easing })),
            initialOpts: {
                fontSize: new EnumOption('16px', [
                    '12px',
                    '16px',
                    '24px',
                    '32px',
                    '64px',
                    '128px',
                ]),
                easing: false,
            },
        }), (0, mithril_1.default)(WidgetShowcase, {
            label: 'Tree',
            description: `Hierarchical tree with left and right values aligned to
        a grid.`,
            renderWidget: (opts) => (0, mithril_1.default)(tree_1.Tree, opts, (0, mithril_1.default)(tree_1.TreeNode, { left: 'Name', right: 'my_event', icon: 'badge' }), (0, mithril_1.default)(tree_1.TreeNode, { left: 'CPU', right: '2', icon: 'memory' }), (0, mithril_1.default)(tree_1.TreeNode, {
                left: 'Start time',
                right: '1s 435ms',
                icon: 'schedule',
            }), (0, mithril_1.default)(tree_1.TreeNode, { left: 'Duration', right: '86ms', icon: 'timer' }), (0, mithril_1.default)(tree_1.TreeNode, {
                left: 'SQL',
                right: (0, mithril_1.default)(menu_1.PopupMenu, {
                    popupPosition: popup_1.PopupPosition.RightStart,
                    trigger: (0, mithril_1.default)(anchor_1.Anchor, {
                        icon: semantic_icons_1.Icons.ContextMenu,
                    }, 'SELECT * FROM ftrace_event WHERE id = 123'),
                }, (0, mithril_1.default)(menu_1.MenuItem, {
                    label: 'Copy SQL Query',
                    icon: 'content_copy',
                }), (0, mithril_1.default)(menu_1.MenuItem, {
                    label: 'Execute Query in new tab',
                    icon: 'open_in_new',
                })),
            }), (0, mithril_1.default)(tree_1.TreeNode, {
                icon: 'account_tree',
                left: 'Process',
                right: (0, mithril_1.default)(anchor_1.Anchor, { icon: 'open_in_new' }, '/bin/foo[789]'),
            }), (0, mithril_1.default)(tree_1.TreeNode, {
                left: 'Thread',
                right: (0, mithril_1.default)(anchor_1.Anchor, { icon: 'open_in_new' }, 'my_thread[456]'),
            }), (0, mithril_1.default)(tree_1.TreeNode, {
                left: 'Args',
                summary: 'foo: string, baz: string, quux: string[4]',
            }, (0, mithril_1.default)(tree_1.TreeNode, { left: 'foo', right: 'bar' }), (0, mithril_1.default)(tree_1.TreeNode, { left: 'baz', right: 'qux' }), (0, mithril_1.default)(tree_1.TreeNode, { left: 'quux', summary: 'string[4]' }, (0, mithril_1.default)(tree_1.TreeNode, { left: '[0]', right: 'corge' }), (0, mithril_1.default)(tree_1.TreeNode, { left: '[1]', right: 'grault' }), (0, mithril_1.default)(tree_1.TreeNode, { left: '[2]', right: 'garply' }), (0, mithril_1.default)(tree_1.TreeNode, { left: '[3]', right: 'waldo' }))), (0, mithril_1.default)(tree_1.LazyTreeNode, {
                left: 'Lazy',
                icon: 'bedtime',
                fetchData: async () => {
                    await new Promise((r) => setTimeout(r, 1000));
                    return () => (0, mithril_1.default)(tree_1.TreeNode, { left: 'foo' });
                },
            }), (0, mithril_1.default)(tree_1.LazyTreeNode, {
                left: 'Dynamic',
                unloadOnCollapse: true,
                icon: 'bedtime',
                fetchData: async () => {
                    await new Promise((r) => setTimeout(r, 1000));
                    return () => (0, mithril_1.default)(tree_1.TreeNode, { left: 'foo' });
                },
            }), recursiveTreeNode()),
            wide: true,
        }), (0, mithril_1.default)(WidgetShowcase, {
            label: 'Form',
            renderWidget: () => renderForm('form'),
        }), (0, mithril_1.default)(WidgetShowcase, {
            label: 'Nested Popups',
            renderWidget: () => (0, mithril_1.default)(popup_1.Popup, {
                trigger: (0, mithril_1.default)(button_1.Button, { label: 'Open the popup' }),
            }, (0, mithril_1.default)(button_1.ButtonBar, [
                (0, mithril_1.default)(menu_1.PopupMenu, {
                    trigger: (0, mithril_1.default)(button_1.Button, { label: 'Select an option' }),
                }, (0, mithril_1.default)(menu_1.MenuItem, { label: 'Option 1' }), (0, mithril_1.default)(menu_1.MenuItem, { label: 'Option 2' })),
                (0, mithril_1.default)(button_1.Button, {
                    label: 'Done',
                    dismissPopup: true,
                }),
            ])),
        }), (0, mithril_1.default)(WidgetShowcase, {
            label: 'Callout',
            renderWidget: ({ icon, ...opts }) => (0, mithril_1.default)(callout_1.Callout, {
                icon: Boolean(icon) ? 'info' : undefined,
                ...opts,
            }, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ' +
                'Nulla rhoncus tempor neque, sed malesuada eros dapibus vel. ' +
                'Aliquam in ligula vitae tortor porttitor laoreet iaculis ' +
                'finibus est.'),
            initialOpts: {
                intent: new EnumOption(common_1.Intent.None, Object.values(common_1.Intent)),
                dismissable: false,
                icon: true,
            },
        }), (0, mithril_1.default)(WidgetShowcase, {
            label: 'Editor',
            renderWidget: () => (0, mithril_1.default)(editor_1.Editor, {
                language: 'perfetto-sql',
                onUpdate: (text) => {
                    (0, language_1.parseAndPrintTree)(text);
                },
            }),
        }), (0, mithril_1.default)(WidgetShowcase, {
            label: 'VegaView',
            renderWidget: (opt) => (0, mithril_1.default)(vega_view_1.VegaView, {
                spec: getExampleSpec(opt.exampleSpec),
                data: getExampleData(opt.exampleData),
            }),
            initialOpts: {
                exampleSpec: new EnumOption(SpecExample.BarChart, Object.values(SpecExample)),
                exampleData: new EnumOption(DataExample.English, Object.values(DataExample)),
            },
        }), (0, mithril_1.default)(WidgetShowcase, {
            label: 'Form within PopupMenu',
            description: `A form placed inside a popup menu works just fine,
              and the cancel/submit buttons also dismiss the popup. A bit more
              margin is added around it too, which improves the look and feel.`,
            renderWidget: () => (0, mithril_1.default)(menu_1.PopupMenu, {
                trigger: (0, mithril_1.default)(button_1.Button, { label: 'Popup!' }),
            }, (0, mithril_1.default)(menu_1.MenuItem, {
                label: 'Open form...',
            }, renderForm('popup-form'))),
        }), (0, mithril_1.default)(WidgetShowcase, {
            label: 'Hotkey',
            renderWidget: (opts) => {
                if (opts.platform === 'auto') {
                    return (0, mithril_1.default)(hotkey_glyphs_1.HotkeyGlyphs, { hotkey: opts.hotkey });
                }
                else {
                    const platform = opts.platform;
                    return (0, mithril_1.default)(hotkey_glyphs_1.HotkeyGlyphs, {
                        hotkey: opts.hotkey,
                        spoof: platform,
                    });
                }
            },
            initialOpts: {
                hotkey: 'Mod+Shift+P',
                platform: new EnumOption('auto', ['auto', 'Mac', 'PC']),
            },
        }), (0, mithril_1.default)(WidgetShowcase, {
            label: 'Text Paragraph',
            description: `A basic formatted text paragraph with wrapping. If
              it is desirable to preserve the original text format/line breaks,
              set the compressSpace attribute to false.`,
            renderWidget: (opts) => {
                return (0, mithril_1.default)(text_paragraph_1.TextParagraph, {
                    text: `Lorem ipsum dolor sit amet, consectetur adipiscing
                         elit. Nulla rhoncus tempor neque, sed malesuada eros
                         dapibus vel. Aliquam in ligula vitae tortor porttitor
                         laoreet iaculis finibus est.`,
                    compressSpace: opts.compressSpace,
                });
            },
            initialOpts: {
                compressSpace: true,
            },
        }), (0, mithril_1.default)(WidgetShowcase, {
            label: 'Multi Paragraph Text',
            description: `A wrapper for multiple paragraph widgets.`,
            renderWidget: () => {
                return (0, mithril_1.default)(text_paragraph_1.MultiParagraphText, (0, mithril_1.default)(text_paragraph_1.TextParagraph, {
                    text: `Lorem ipsum dolor sit amet, consectetur adipiscing
                         elit. Nulla rhoncus tempor neque, sed malesuada eros
                         dapibus vel. Aliquam in ligula vitae tortor porttitor
                         laoreet iaculis finibus est.`,
                    compressSpace: true,
                }), (0, mithril_1.default)(text_paragraph_1.TextParagraph, {
                    text: `Sed ut perspiciatis unde omnis iste natus error sit
                         voluptatem accusantium doloremque laudantium, totam rem
                         aperiam, eaque ipsa quae ab illo inventore veritatis et
                         quasi architecto beatae vitae dicta sunt explicabo.
                         Nemo enim ipsam voluptatem quia voluptas sit aspernatur
                         aut odit aut fugit, sed quia consequuntur magni dolores
                         eos qui ratione voluptatem sequi nesciunt.`,
                    compressSpace: true,
                }));
            },
        }), (0, mithril_1.default)(WidgetShowcase, {
            label: 'Modal',
            description: `Shows a dialog box in the center of the screen over the
                      top of other elements.`,
            renderWidget: () => (0, mithril_1.default)(button_1.Button, {
                label: 'Show Modal',
                onclick: () => {
                    (0, modal_1.showModal)({
                        title: 'Attention',
                        icon: semantic_icons_1.Icons.Help,
                        content: () => [
                            (0, mithril_1.default)('', 'This is a modal dialog'),
                            (0, mithril_1.default)(popup_1.Popup, {
                                trigger: (0, mithril_1.default)(button_1.Button, {
                                    variant: button_1.ButtonVariant.Filled,
                                    label: 'Open Popup',
                                }),
                            }, 'Popup content'),
                        ],
                        buttons: [
                            {
                                text: 'Cancel',
                            },
                            {
                                text: 'OK',
                                primary: true,
                            },
                        ],
                    });
                },
            }),
        }), (0, mithril_1.default)(WidgetShowcase, {
            label: 'Advanced Modal',
            description: `A helper for modal dialog.`,
            renderWidget: () => (0, mithril_1.default)(ModalShowcase),
        }), (0, mithril_1.default)(WidgetShowcase, {
            label: 'TreeTable',
            description: `Hierarchical tree with multiple columns`,
            renderWidget: () => {
                const attrs = {
                    rows: files,
                    getChildren: (file) => file.children,
                    columns: [
                        { name: 'Name', getData: (file) => file.name },
                        { name: 'Size', getData: (file) => file.size },
                        { name: 'Date', getData: (file) => file.date },
                    ],
                };
                return (0, mithril_1.default)((treetable_1.TreeTable), attrs);
            },
        }), (0, mithril_1.default)(WidgetShowcase, {
            label: 'VirtualTable',
            description: `Virtualized table for efficient rendering of large datasets`,
            renderWidget: () => {
                const attrs = {
                    columns: [
                        { header: 'x', width: '4em' },
                        { header: 'x^2', width: '8em' },
                    ],
                    rows: virtualTableData.rows,
                    firstRowOffset: virtualTableData.offset,
                    rowHeight: 20,
                    numRows: 500_000,
                    style: { height: '200px' },
                    onReload: (rowOffset, rowCount) => {
                        const rows = [];
                        for (let i = rowOffset; i < rowOffset + rowCount; i++) {
                            rows.push({ id: i, cells: [i, i ** 2] });
                        }
                        virtualTableData = {
                            offset: rowOffset,
                            rows,
                        };
                    },
                };
                return (0, mithril_1.default)(virtual_table_1.VirtualTable, attrs);
            },
        }), (0, mithril_1.default)(WidgetShowcase, {
            label: 'Tag Input',
            description: `
          TagInput displays Tag elements inside an input, followed by an
          interactive text input. The container is styled to look like a
          TextInput, but the actual editable element appears after the last tag.
          Clicking anywhere on the container will focus the text input.`,
            renderWidget: () => (0, mithril_1.default)(TagInputDemo),
        }), (0, mithril_1.default)(WidgetShowcase, {
            label: 'Middle Ellipsis',
            description: `
          Sometimes the start and end of a bit of text are more important than
          the middle. This element puts the ellipsis in the midde if the content
          is too wide for its container.`,
            renderWidget: (opts) => (0, mithril_1.default)('div', { style: { width: Boolean(opts.squeeze) ? '150px' : '450px' } }, (0, mithril_1.default)(middle_ellipsis_1.MiddleEllipsis, {
                text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
            })),
            initialOpts: {
                squeeze: false,
            },
        }), (0, mithril_1.default)(WidgetShowcase, {
            label: 'Chip',
            description: `A little chip or tag`,
            renderWidget: (opts) => {
                const { icon, ...rest } = opts;
                return (0, mithril_1.default)(stack_1.Stack, { orientation: 'horizontal' }, (0, mithril_1.default)(chip_1.Chip, {
                    label: 'Foo',
                    icon: icon === true ? 'info' : undefined,
                    ...rest,
                }), (0, mithril_1.default)(chip_1.Chip, {
                    label: 'Bar',
                    icon: icon === true ? 'warning' : undefined,
                    ...rest,
                }), (0, mithril_1.default)(chip_1.Chip, {
                    label: 'Baz',
                    icon: icon === true ? 'error' : undefined,
                    ...rest,
                }));
            },
            initialOpts: {
                intent: new EnumOption(common_1.Intent.None, Object.values(common_1.Intent)),
                icon: true,
                compact: false,
                rounded: false,
                disabled: false,
                removable: true,
            },
        }), (0, mithril_1.default)(WidgetShowcase, {
            label: 'TrackShell',
            description: `The Mithril parts of a track (the shell, mainly).`,
            renderWidget: (opts) => {
                const { buttons, chips, multipleTracks, error, ...rest } = opts;
                const dummyButtons = () => [
                    (0, mithril_1.default)(button_1.Button, { icon: 'info', compact: true }),
                    (0, mithril_1.default)(button_1.Button, { icon: 'settings', compact: true }),
                ];
                const dummyChips = () => ['foo', 'bar'];
                const renderTrack = (children) => (0, mithril_1.default)(track_shell_1.TrackShell, {
                    buttons: Boolean(buttons) ? dummyButtons() : undefined,
                    chips: Boolean(chips) ? dummyChips() : undefined,
                    error: Boolean(error)
                        ? new Error('An error has occurred')
                        : undefined,
                    ...rest,
                }, children);
                return (0, mithril_1.default)('', {
                    style: { width: '500px', boxShadow: '0px 0px 1px 1px lightgray' },
                }, Boolean(multipleTracks)
                    ? [renderTrack(), renderTrack(), renderTrack()]
                    : renderTrack());
            },
            initialOpts: {
                title: 'This is the title of the track',
                subtitle: 'This is the subtitle of the track',
                buttons: true,
                chips: true,
                heightPx: 32,
                collapsible: true,
                collapsed: true,
                summary: false,
                highlight: false,
                error: false,
                multipleTracks: false,
                reorderable: false,
                depth: 0,
                lite: false,
            },
        }), (0, mithril_1.default)(WidgetShowcase, {
            label: 'Virtual Overlay Canvas',
            description: `A scrolling container that draws a virtual canvas over
          the top of it's content and keeps it in the viewport to make it appear
          like there is one big canvas over the top of the content.`,
            renderWidget: () => {
                const width = 200;
                const rowCount = 65536;
                const rowHeight = 20;
                return (0, mithril_1.default)(virtual_overlay_canvas_1.VirtualOverlayCanvas, {
                    className: 'pf-virtual-canvas',
                    overflowY: 'auto',
                    onCanvasRedraw({ ctx, canvasRect }) {
                        ctx.strokeStyle = 'red';
                        ctx.lineWidth = 1;
                        ctx.font = '20px Arial';
                        ctx.fillStyle = 'black';
                        ctx.textAlign = 'left';
                        ctx.textBaseline = 'top';
                        for (let i = 0; i < rowCount; i++) {
                            const rect = {
                                left: 0,
                                top: i * rowHeight,
                                right: width,
                                bottom: i * rowHeight + rowHeight,
                            };
                            if (canvasRect.overlaps(rect)) {
                                ctx.strokeRect(0, i * rowHeight, width, rowHeight);
                                ctx.fillText(`Row: ${i}`, 0, i * rowHeight);
                            }
                        }
                    },
                }, (0, mithril_1.default)('', {
                    style: { height: `${rowCount * rowHeight}px`, width: `${width}px` },
                }));
            },
            initialOpts: {},
        }), (0, mithril_1.default)(WidgetShowcase, {
            label: 'SplitPanel',
            description: `Resizeable split panel with optional tabs.`,
            renderWidget: (opts) => {
                return (0, mithril_1.default)('', {
                    style: {
                        height: '400px',
                        width: '400px',
                        border: 'solid 2px gray',
                    },
                }, (0, mithril_1.default)(split_panel_1.SplitPanel, {
                    leftHandleContent: [
                        Boolean(opts.leftContent) && (0, mithril_1.default)(button_1.Button, { icon: 'Menu' }),
                    ],
                    drawerContent: 'Drawer Content',
                    tabs: Boolean(opts.tabs) &&
                        (0, mithril_1.default)('.pf-split-panel__tabs', (0, mithril_1.default)(split_panel_1.Tab, { active: true, hasCloseButton: opts.showCloseButtons }, 'Foo'), (0, mithril_1.default)(split_panel_1.Tab, { hasCloseButton: opts.showCloseButtons }, 'Bar')),
                }, 'Main Content'));
            },
            initialOpts: {
                leftContent: true,
                tabs: true,
                showCloseButtons: true,
            },
        }), renderWidgetShowcase({
            label: 'Grid',
            description: `
          Presentation layer for grid/table elements. Defines a consistent look
          and feel for grids but leaves the data and interaction handling to the
          user. For instance, it provides slots and callbacks for sorting, column
          reordering and column level aggregations, but doesn't have any
          opinions about the data or how they should be manipulated.
        `,
            renderWidget: ({ reorderable, ...rest }) => (0, mithril_1.default)('', { style: { height: '400px', width: '400px', overflow: 'hidden' } }, (0, mithril_1.default)(grid_1.Grid, rest, [
                (0, mithril_1.default)(grid_1.GridHeader, [
                    (0, mithril_1.default)(grid_1.GridRow, [
                        (0, mithril_1.default)(grid_1.GridHeaderCell, {
                            key: 'id',
                            sort: 'ASC',
                            onSort: () => { },
                            aggregation: {
                                left: 'Σ',
                                right: 15,
                            },
                            reorderable: reorderable ? { handle: 'left' } : undefined,
                        }, 'ID'),
                        (0, mithril_1.default)(grid_1.GridHeaderCell, {
                            key: 'lang',
                            onSort: () => { },
                            menuItems: [
                                (0, mithril_1.default)(menu_1.MenuItem, { label: 'Filter nulls' }),
                                (0, mithril_1.default)(menu_1.MenuItem, { label: 'Show only nulls' }),
                            ],
                            reorderable: reorderable ? { handle: 'left' } : undefined,
                            thickRightBorder: true,
                        }, 'Language'),
                        (0, mithril_1.default)(grid_1.GridHeaderCell, {
                            key: 'year',
                            aggregation: {
                                left: 'AVG',
                                right: 1998.3,
                            },
                            reorderable: reorderable ? { handle: 'right' } : undefined,
                        }, 'Year'),
                        (0, mithril_1.default)(grid_1.GridHeaderCell, {
                            key: 'creator',
                            reorderable: reorderable ? { handle: 'right' } : undefined,
                        }, 'Creator'),
                        (0, mithril_1.default)(grid_1.GridHeaderCell, {
                            key: 'typing',
                            reorderable: reorderable ? { handle: 'right' } : undefined,
                        }, 'Typing'),
                    ]),
                ]),
                (0, mithril_1.default)(grid_1.GridBody, [
                    (0, mithril_1.default)(grid_1.GridRow, [
                        (0, mithril_1.default)(grid_1.GridDataCell, { align: 'right' }, 1),
                        (0, mithril_1.default)(grid_1.GridDataCell, {
                            menuItems: [
                                (0, mithril_1.default)(menu_1.MenuItem, { label: 'Filter to "TypeScript"' }),
                                (0, mithril_1.default)(menu_1.MenuItem, { label: 'Exclude "TypeScript"' }),
                            ],
                            thickRightBorder: true,
                        }, 'TypeScript'),
                        (0, mithril_1.default)(grid_1.GridDataCell, { align: 'right' }, 2012),
                        (0, mithril_1.default)(grid_1.GridDataCell, 'Microsoft'),
                        (0, mithril_1.default)(grid_1.GridDataCell, 'Static'),
                    ]),
                    (0, mithril_1.default)(grid_1.GridRow, [
                        (0, mithril_1.default)(grid_1.GridDataCell, { align: 'right' }, 2),
                        (0, mithril_1.default)(grid_1.GridDataCell, { thickRightBorder: true }, 'JavaScript'),
                        (0, mithril_1.default)(grid_1.GridDataCell, { align: 'right' }, 1995),
                        (0, mithril_1.default)(grid_1.GridDataCell, 'Brendan Eich'),
                        (0, mithril_1.default)(grid_1.GridDataCell, 'Dynamic'),
                    ]),
                    (0, mithril_1.default)(grid_1.GridRow, [
                        (0, mithril_1.default)(grid_1.GridDataCell, { align: 'right' }, 3),
                        (0, mithril_1.default)(grid_1.GridDataCell, { thickRightBorder: true }, 'Python'),
                        (0, mithril_1.default)(grid_1.GridDataCell, { align: 'right' }, 1991),
                        (0, mithril_1.default)(grid_1.GridDataCell, 'Guido van Rossum'),
                        (0, mithril_1.default)(grid_1.GridDataCell, 'Dynamic'),
                    ]),
                    (0, mithril_1.default)(grid_1.GridRow, [
                        (0, mithril_1.default)(grid_1.GridDataCell, { align: 'right' }, 4),
                        (0, mithril_1.default)(grid_1.GridDataCell, { thickRightBorder: true }, 'Java'),
                        (0, mithril_1.default)(grid_1.GridDataCell, { align: 'right' }, 1995),
                        (0, mithril_1.default)(grid_1.GridDataCell, 'James Gosling'),
                        (0, mithril_1.default)(grid_1.GridDataCell, 'Static'),
                    ]),
                    (0, mithril_1.default)(grid_1.GridRow, [
                        (0, mithril_1.default)(grid_1.GridDataCell, { align: 'right' }, 5),
                        (0, mithril_1.default)(grid_1.GridDataCell, { thickRightBorder: true }, 'C++'),
                        (0, mithril_1.default)(grid_1.GridDataCell, { align: 'right' }, 1985),
                        (0, mithril_1.default)(grid_1.GridDataCell, 'Bjarne Stroustrup'),
                        (0, mithril_1.default)(grid_1.GridDataCell, 'Static'),
                    ]),
                    (0, mithril_1.default)(grid_1.GridRow, [
                        (0, mithril_1.default)(grid_1.GridDataCell, { align: 'right' }, 6),
                        (0, mithril_1.default)(grid_1.GridDataCell, { thickRightBorder: true }, 'Go'),
                        (0, mithril_1.default)(grid_1.GridDataCell, { align: 'right' }, 2009),
                        (0, mithril_1.default)(grid_1.GridDataCell, 'Google'),
                        (0, mithril_1.default)(grid_1.GridDataCell, 'Static'),
                    ]),
                    (0, mithril_1.default)(grid_1.GridRow, [
                        (0, mithril_1.default)(grid_1.GridDataCell, { align: 'right' }, 7),
                        (0, mithril_1.default)(grid_1.GridDataCell, { thickRightBorder: true }, 'Rust'),
                        (0, mithril_1.default)(grid_1.GridDataCell, { align: 'right' }, 2010),
                        (0, mithril_1.default)(grid_1.GridDataCell, 'Graydon Hoare'),
                        (0, mithril_1.default)(grid_1.GridDataCell, 'Static'),
                    ]),
                    (0, mithril_1.default)(grid_1.GridRow, [
                        (0, mithril_1.default)(grid_1.GridDataCell, { align: 'right' }, 8),
                        (0, mithril_1.default)(grid_1.GridDataCell, { thickRightBorder: true }, 'Ruby'),
                        (0, mithril_1.default)(grid_1.GridDataCell, { align: 'right' }, 1995),
                        (0, mithril_1.default)(grid_1.GridDataCell, 'Yukihiro Matsumoto'),
                        (0, mithril_1.default)(grid_1.GridDataCell, 'Dynamic'),
                    ]),
                    (0, mithril_1.default)(grid_1.GridRow, [
                        (0, mithril_1.default)(grid_1.GridDataCell, { align: 'right' }, 9),
                        (0, mithril_1.default)(grid_1.GridDataCell, { thickRightBorder: true }, 'Swift'),
                        (0, mithril_1.default)(grid_1.GridDataCell, { align: 'right' }, 2014),
                        (0, mithril_1.default)(grid_1.GridDataCell, 'Apple'),
                        (0, mithril_1.default)(grid_1.GridDataCell, 'Static'),
                    ]),
                    (0, mithril_1.default)(grid_1.GridRow, [
                        (0, mithril_1.default)(grid_1.GridDataCell, { align: 'right' }, 10),
                        (0, mithril_1.default)(grid_1.GridDataCell, { thickRightBorder: true }, 'Kotlin'),
                        (0, mithril_1.default)(grid_1.GridDataCell, { align: 'right' }, 2011),
                        (0, mithril_1.default)(grid_1.GridDataCell, 'JetBrains'),
                        (0, mithril_1.default)(grid_1.GridDataCell, 'Static'),
                    ]),
                    (0, mithril_1.default)(grid_1.GridRow, [
                        (0, mithril_1.default)(grid_1.GridDataCell, { align: 'right' }, 11),
                        (0, mithril_1.default)(grid_1.GridDataCell, { thickRightBorder: true }, 'PHP'),
                        (0, mithril_1.default)(grid_1.GridDataCell, { align: 'right' }, 1995),
                        (0, mithril_1.default)(grid_1.GridDataCell, 'Rasmus Lerdorf'),
                        (0, mithril_1.default)(grid_1.GridDataCell, 'Dynamic'),
                    ]),
                    (0, mithril_1.default)(grid_1.GridRow, [
                        (0, mithril_1.default)(grid_1.GridDataCell, { align: 'right' }, 12),
                        (0, mithril_1.default)(grid_1.GridDataCell, { thickRightBorder: true }, 'C#'),
                        (0, mithril_1.default)(grid_1.GridDataCell, { align: 'right' }, 2000),
                        (0, mithril_1.default)(grid_1.GridDataCell, 'Microsoft'),
                        (0, mithril_1.default)(grid_1.GridDataCell, 'Static'),
                    ]),
                    (0, mithril_1.default)(grid_1.GridRow, [
                        (0, mithril_1.default)(grid_1.GridDataCell, { align: 'right' }, 13),
                        (0, mithril_1.default)(grid_1.GridDataCell, { thickRightBorder: true }, 'Perl'),
                        (0, mithril_1.default)(grid_1.GridDataCell, { align: 'right' }, 1987),
                        (0, mithril_1.default)(grid_1.GridDataCell, 'Larry Wall'),
                        (0, mithril_1.default)(grid_1.GridDataCell, 'Dynamic'),
                    ]),
                    (0, mithril_1.default)(grid_1.GridRow, [
                        (0, mithril_1.default)(grid_1.GridDataCell, { align: 'right' }, 14),
                        (0, mithril_1.default)(grid_1.GridDataCell, { thickRightBorder: true }, 'Scala'),
                        (0, mithril_1.default)(grid_1.GridDataCell, { align: 'right' }, 2004),
                        (0, mithril_1.default)(grid_1.GridDataCell, 'Martin Odersky'),
                        (0, mithril_1.default)(grid_1.GridDataCell, 'Static'),
                    ]),
                    (0, mithril_1.default)(grid_1.GridRow, [
                        (0, mithril_1.default)(grid_1.GridDataCell, { align: 'right' }, 15),
                        (0, mithril_1.default)(grid_1.GridDataCell, { thickRightBorder: true }, 'Haskell'),
                        (0, mithril_1.default)(grid_1.GridDataCell, { align: 'right' }, 1990),
                        (0, mithril_1.default)(grid_1.GridDataCell, 'Lennart Augustsson, et al.'),
                        (0, mithril_1.default)(grid_1.GridDataCell, 'Static'),
                    ]),
                    (0, mithril_1.default)(grid_1.GridRow, [
                        (0, mithril_1.default)(grid_1.GridDataCell, { align: 'right' }, 16),
                        (0, mithril_1.default)(grid_1.GridDataCell, { thickRightBorder: true }, 'Lua'),
                        (0, mithril_1.default)(grid_1.GridDataCell, { align: 'right' }, 1993),
                        (0, mithril_1.default)(grid_1.GridDataCell, 'Roberto Ierusalimschy, et al.'),
                        (0, mithril_1.default)(grid_1.GridDataCell, 'Dynamic'),
                    ]),
                    (0, mithril_1.default)(grid_1.GridRow, [
                        (0, mithril_1.default)(grid_1.GridDataCell, { align: 'right' }, 17),
                        (0, mithril_1.default)(grid_1.GridDataCell, { thickRightBorder: true }, 'Dart'),
                        (0, mithril_1.default)(grid_1.GridDataCell, { align: 'right' }, 2011),
                        (0, mithril_1.default)(grid_1.GridDataCell, 'Google'),
                        (0, mithril_1.default)(grid_1.GridDataCell, 'Static'),
                    ]),
                    (0, mithril_1.default)(grid_1.GridRow, [
                        (0, mithril_1.default)(grid_1.GridDataCell, { align: 'right' }, 18),
                        (0, mithril_1.default)(grid_1.GridDataCell, { thickRightBorder: true }, 'Elixir'),
                        (0, mithril_1.default)(grid_1.GridDataCell, { align: 'right' }, 2012),
                        (0, mithril_1.default)(grid_1.GridDataCell, 'José Valim'),
                        (0, mithril_1.default)(grid_1.GridDataCell, 'Dynamic'),
                    ]),
                    (0, mithril_1.default)(grid_1.GridRow, [
                        (0, mithril_1.default)(grid_1.GridDataCell, { align: 'right' }, 19),
                        (0, mithril_1.default)(grid_1.GridDataCell, { thickRightBorder: true }, 'Clojure'),
                        (0, mithril_1.default)(grid_1.GridDataCell, { align: 'right' }, 2007),
                        (0, mithril_1.default)(grid_1.GridDataCell, 'Rich Hickey'),
                        (0, mithril_1.default)(grid_1.GridDataCell, 'Dynamic'),
                    ]),
                    (0, mithril_1.default)(grid_1.GridRow, [
                        (0, mithril_1.default)(grid_1.GridDataCell, { align: 'right' }, 20),
                        (0, mithril_1.default)(grid_1.GridDataCell, { thickRightBorder: true }, 'F#'),
                        (0, mithril_1.default)(grid_1.GridDataCell, { align: 'right' }, 2005),
                        (0, mithril_1.default)(grid_1.GridDataCell, 'Microsoft'),
                        (0, mithril_1.default)(grid_1.GridDataCell, 'Static'),
                    ]),
                    (0, mithril_1.default)(grid_1.GridRow, [
                        (0, mithril_1.default)(grid_1.GridDataCell, { align: 'right' }, 21),
                        (0, mithril_1.default)(grid_1.GridDataCell, { thickRightBorder: true }, 'Lisp'),
                        (0, mithril_1.default)(grid_1.GridDataCell, { align: 'right' }, 1958),
                        (0, mithril_1.default)(grid_1.GridDataCell, 'John McCarthy'),
                        (0, mithril_1.default)(grid_1.GridDataCell, 'Dynamic'),
                    ]),
                ]),
            ])),
            initialOpts: {
                fillHeight: true,
                reorderable: true,
            },
        }), renderWidgetShowcase({
            label: 'DataGrid (memory backed)',
            description: `An interactive data explorer and viewer.`,
            renderWidget: ({ readonlyFilters, readonlySorting, aggregation, ...rest }) => (0, mithril_1.default)(data_grid_1.DataGrid, {
                ...rest,
                filters: readonlyFilters ? [] : undefined,
                sorting: readonlySorting ? { direction: 'UNSORTED' } : undefined,
                columns: [
                    {
                        name: 'id',
                        title: 'ID',
                        aggregation: aggregation ? 'COUNT' : undefined,
                    },
                    { name: 'ts', title: 'Timestamp' },
                    {
                        name: 'dur',
                        aggregation: aggregation ? 'SUM' : undefined,
                        title: 'Duration',
                    },
                    { name: 'name', title: 'Name' },
                    { name: 'data', title: 'Data' },
                    { name: 'maybe_null', title: 'Maybe Null?' },
                    { name: 'category', title: 'Category' },
                ],
                data: [
                    {
                        id: 1,
                        name: 'foo',
                        ts: 123n,
                        dur: 16n,
                        data: new Uint8Array(),
                        maybe_null: null,
                        category: 'aaa',
                    },
                    {
                        id: 2,
                        name: 'bar',
                        ts: 185n,
                        dur: 4n,
                        data: new Uint8Array([1, 2, 3]),
                        maybe_null: 'Non null',
                        category: 'aaa',
                    },
                    {
                        id: 3,
                        name: 'baz',
                        ts: 575n,
                        dur: 12n,
                        data: new Uint8Array([1, 2, 3]),
                        maybe_null: null,
                        category: 'aaa',
                    },
                ],
            }),
            initialOpts: {
                showFiltersInToolbar: true,
                readonlyFilters: false,
                readonlySorting: false,
                aggregation: false,
            },
        }), renderWidgetShowcase({
            label: 'DataGrid (query backed)',
            description: `An interactive data explorer and viewer - fetched from SQL.`,
            renderWidget: ({ readonlyFilters, readonlySorting, aggregation, ...rest }) => {
                const trace = attrs.app.trace;
                if (trace) {
                    return (0, mithril_1.default)(QueryDataGrid, {
                        ...rest,
                        engine: trace.engine,
                        query: `
                SELECT
                  ts.id as id,
                  dur,
                  state,
                  thread.name as thread_name,
                  dur,
                  io_wait,
                  ucpu
                FROM thread_state ts
                JOIN thread USING(utid)
              `,
                        filters: readonlyFilters ? [] : undefined,
                        sorting: readonlySorting ? { direction: 'UNSORTED' } : undefined,
                        columns: [
                            {
                                name: 'id',
                                title: 'ID',
                                aggregation: aggregation ? 'COUNT' : undefined,
                            },
                            {
                                name: 'dur',
                                title: 'Duration',
                                aggregation: aggregation ? 'SUM' : undefined,
                            },
                            { name: 'state', title: 'State' },
                            { name: 'thread_name', title: 'Thread' },
                            { name: 'ucpu', title: 'CPU' },
                            { name: 'io_wait', title: 'IO Wait' },
                        ],
                        maxRowsPerPage: 10,
                    });
                }
                else {
                    return 'Load a trace to start';
                }
            },
            initialOpts: {
                showFiltersInToolbar: true,
                readonlyFilters: false,
                readonlySorting: false,
                aggregation: false,
            },
        }), (0, mithril_1.default)(WidgetShowcase, {
            label: 'TabStrip',
            description: `A simple tab strip`,
            renderWidget: () => {
                return (0, mithril_1.default)(tabs_1.TabStrip, {
                    tabs: [
                        { key: 'foo', title: 'Foo' },
                        { key: 'bar', title: 'Bar' },
                        { key: 'baz', title: 'Baz' },
                    ],
                    currentTabKey: currentTab,
                    onTabChange: (key) => {
                        currentTab = key;
                    },
                });
            },
            initialOpts: {},
        }), (0, mithril_1.default)(WidgetShowcase, {
            label: 'CodeSnippet',
            renderWidget: ({ wide }) => (0, mithril_1.default)(code_snippet_1.CodeSnippet, {
                language: 'SQL',
                text: Boolean(wide)
                    ? 'SELECT a_very_long_column_name, another_super_long_column_name, yet_another_ridiculously_long_column_name FROM a_table_with_an_unnecessarily_long_name WHERE some_condition_is_true AND another_condition_is_also_true;'
                    : 'SELECT * FROM slice LIMIT 10;',
            }),
            initialOpts: {
                wide: false,
            },
        }));
    }
}
exports.WidgetsPage = WidgetsPage;
function renderWidgetShowcase(attrs) {
    return (0, mithril_1.default)(WidgetShowcase, attrs);
}
function CursorTooltipShowcase() {
    let show = false;
    return {
        view() {
            return (0, mithril_1.default)('', {
                style: {
                    width: '150px',
                    height: '150px',
                    border: '1px dashed gray',
                    userSelect: 'none',
                    color: 'gray',
                    textAlign: 'center',
                    lineHeight: '150px',
                },
                onmouseover: () => (show = true),
                onmouseout: () => (show = false),
            }, 'Hover here...', show && (0, mithril_1.default)(cursor_tooltip_1.CursorTooltip, 'Hi!'));
        },
    };
}
function MultiselectInputDemo() {
    const options = [
        'foo',
        'bar',
        'baz',
        'qux',
        'quux',
        'corge',
        'grault',
        'garply',
        'waldo',
        'fred',
    ];
    let selectedOptions = [];
    return {
        view() {
            return (0, mithril_1.default)(multiselect_input_1.MultiselectInput, {
                options: options.map((o) => ({ key: o, label: o })),
                selectedOptions,
                onOptionAdd: (key) => selectedOptions.push(key),
                onOptionRemove: (key) => {
                    selectedOptions = selectedOptions.filter((x) => x !== key);
                },
            });
        },
    };
}
function QueryDataGrid(vnode) {
    const dataSource = new sql_data_source_1.SQLDataSource(vnode.attrs.engine, vnode.attrs.query);
    return {
        view({ attrs }) {
            return (0, mithril_1.default)(data_grid_1.DataGrid, { ...attrs, data: dataSource });
        },
    };
}
class ModalShowcase {
    static counter = 0;
    static log(txt) {
        const mwlogs = document.getElementById('mwlogs');
        if (!mwlogs || !(mwlogs instanceof HTMLTextAreaElement))
            return;
        const time = new Date().toLocaleTimeString();
        mwlogs.value += `[${time}] ${txt}\n`;
        mwlogs.scrollTop = mwlogs.scrollHeight;
    }
    static showModalDialog(staticContent = false) {
        const id = `N=${++ModalShowcase.counter}`;
        ModalShowcase.log(`Open ${id}`);
        const logOnClose = () => ModalShowcase.log(`Close ${id}`);
        let content;
        if (staticContent) {
            content = (0, mithril_1.default)('.pf-modal-pre', 'Content of the modal dialog.\nEnd of content');
        }
        else {
            // The humble counter is basically the VDOM 'Hello world'!
            function CounterComponent() {
                let counter = 0;
                return {
                    view: () => {
                        return (0, mithril_1.default)('', `Counter value: ${counter}`, (0, mithril_1.default)(button_1.Button, {
                            label: 'Increment Counter',
                            onclick: () => ++counter,
                        }));
                    },
                };
            }
            content = () => (0, mithril_1.default)(CounterComponent);
        }
        const closePromise = (0, modal_1.showModal)({
            title: `Modal dialog ${id}`,
            buttons: [
                { text: 'OK', action: () => ModalShowcase.log(`OK ${id}`) },
                { text: 'Cancel', action: () => ModalShowcase.log(`Cancel ${id}`) },
                {
                    text: 'Show another now',
                    action: () => ModalShowcase.showModalDialog(),
                },
                {
                    text: 'Show another in 2s',
                    action: () => setTimeout(() => ModalShowcase.showModalDialog(), 2000),
                },
            ],
            content,
        });
        closePromise.then(logOnClose);
    }
    view() {
        return (0, mithril_1.default)('div', {
            style: {
                'display': 'flex',
                'flex-direction': 'column',
                'width': '100%',
            },
        }, (0, mithril_1.default)('textarea', {
            id: 'mwlogs',
            readonly: 'readonly',
            rows: '8',
            placeholder: 'Logs will appear here',
        }), (0, mithril_1.default)('input[type=button]', {
            value: 'Show modal (static)',
            onclick: () => ModalShowcase.showModalDialog(true),
        }), (0, mithril_1.default)('input[type=button]', {
            value: 'Show modal (dynamic)',
            onclick: () => ModalShowcase.showModalDialog(false),
        }));
    }
} // class ModalShowcase
function renderForm(id) {
    return (0, mithril_1.default)(form_1.Form, {
        submitLabel: 'Submit',
        submitIcon: 'send',
        cancelLabel: 'Cancel',
        resetLabel: 'Reset',
        onSubmit: () => window.alert('Form submitted!'),
    }, (0, mithril_1.default)(form_1.FormLabel, { for: `${id}-foo` }, 'Foo'), (0, mithril_1.default)(text_input_1.TextInput, { id: `${id}-foo` }), (0, mithril_1.default)(form_1.FormLabel, { for: `${id}-bar` }, 'Bar'), (0, mithril_1.default)(select_1.Select, { id: `${id}-bar` }, [
        (0, mithril_1.default)('option', { value: 'foo', label: 'Foo' }),
        (0, mithril_1.default)('option', { value: 'bar', label: 'Bar' }),
        (0, mithril_1.default)('option', { value: 'baz', label: 'Baz' }),
    ]));
}
//# sourceMappingURL=widgets_page.js.map