import deepmerge from 'deepmerge';

/**
 * Plugin Base class
 */
export default class Plugin {

    /**
     * plugin constructor
     *
     * @param {HTMLElement} el
     * @param {Object} options
     * @param {string} instanceName
     */
    constructor(el, options = {}, instanceName = false) {
        if (!Plugin._isNode(el)) {
            throw new Error(`There is no valid element given.`);
        }

        this.el = el;
        this.options = this._mergeOptions(options);

        this._instanceName = instanceName;

        this._registerInstance();
        this.init();
    }

    /**
     * this function gets executed when the plugin is initialized
     *
     * @private
     */
    init() {
        throw new Error(`The "init" method for the plugin "${this.constructor.name}" is not defined.`);
    }

    /**
     * deep merge the passed options and the static defaults
     *
     * @param {Object} options
     *
     * @private
     */
    _mergeOptions(options) {
        let defaultOptions = this.options || {};

        if (this.constructor.options) {
            defaultOptions = this.constructor.options;
        }

        return deepmerge(defaultOptions, options || {});
    }

    /**
     * registers the plugin Instance to the element
     *
     * @private
     */
    _registerInstance() {
        const plugins = window.PluginManager.getPluginInstances(this.el);
        let instanceName = this._instanceName;

        if (!instanceName) {
            instanceName = this.constructor.name;
        }

        plugins.set(instanceName, this);
    }

    /**
     * returns if the passed element is a dom node
     *
     * @param el
     * @return {*}
     * @private
     */
    static _isNode(el) {
        if (typeof Node === "object") {
            return el instanceof Node;
        }

        return el && typeof el === "object" && typeof el.nodeType === "number" && typeof el.nodeName === "string";
    }

}
