/* eslint-disable */
import { message } from 'ant-design-vue';

const SSE = function (url, options) {
    if (!(this instanceof SSE)) {
        return new SSE(url, options);
    }

    this.INITIALIZING = -1;
    this.CONNECTING = 0;
    this.OPEN = 1;
    this.CLOSED = 2;

    this.url = url;

    options = options || {};
    this.headers = options.headers || {};
    this.payload = options.payload !== undefined ? options.payload : '';
    this.method = options.method || (this.payload && 'POST' || 'GET');
    this.withCredentials = !!options.withCredentials;

    this.FIELD_SEPARATOR = ':';
    this.listeners = {};

    this.xhr = null;
    this.readyState = this.INITIALIZING;
    this.progress = 0;
    this.chunk = '';

    this.addEventListener = function (type, listener) {
        if (this.listeners[type] === undefined) {
            this.listeners[type] = [];
        }

        if (this.listeners[type].indexOf(listener) === -1) {
            this.listeners[type].push(listener);
        }
    };

    this.removeEventListener = function (type, listener) {
        if (this.listeners[type] === undefined) {
            return;
        }

        const filtered = [];
        this.listeners[type].forEach((element) => {
            if (element !== listener) {
                filtered.push(element);
            }
        });
        if (filtered.length === 0) {
            delete this.listeners[type];
        } else {
            this.listeners[type] = filtered;
        }
    };

    this.dispatchEvent = function (e) {
        if (!e) {
            return true;
        }

        e.source = this;

        const onHandler = `on${e.type}`;
        if (this.hasOwnProperty(onHandler)) {
            this[onHandler].call(this, e);
            if (e.defaultPrevented) {
                return false;
            }
        }

        if (this.listeners[e.type]) {
            return this.listeners[e.type].every((callback) => {
                callback(e);
                return !e.defaultPrevented;
            });
        }

        return true;
    };

    this._setReadyState = function (state) {
        const event = new CustomEvent('readystatechange');
        event.readyState = state;
        this.readyState = state;
        this.dispatchEvent(event);
    };

    this._onStreamFailure = function (e) {
        const event = new CustomEvent('error');
        event.data = e.currentTarget.response;
        this.dispatchEvent(event);
        this.close();
    };

    this._onStreamAbort = function (e) {
        this.dispatchEvent(new CustomEvent('abort'));
        this.close();
    };

    this._onStreamProgress = function (e) {
        if (!this.xhr) {
            return;
        }

        if (this.xhr.status !== 200) {
            this._onStreamFailure(e);
            return;
        }

        if (this.readyState == this.CONNECTING) {
            this.dispatchEvent(new CustomEvent('open'));
            this._setReadyState(this.OPEN);
        }

        const data = this.xhr.responseText.substring(this.progress);
        this.progress += data.length;
        data.split(/(\r\n|\r|\n){2}/g).forEach((part) => {
            if (part.trim().length === 0) {
                this.dispatchEvent(this._parseEventChunk(this.chunk.trim()));
                this.chunk = '';
            } else {
                this.chunk += part;
            }
        });
    };

    this._onStreamLoaded = function (e) {
        this._onStreamProgress(e);

        // Parse the last chunk.
        this.dispatchEvent(this._parseEventChunk(this.chunk));
        this.chunk = '';
    };

    /**
     * Parse a received SSE event chunk into a constructed event object.
     */
    this._parseEventChunk = function (chunk) {
        if (!chunk || chunk.length === 0) {
            return null;
        }
        const e = { id: null, retry: null, data: [], event: 'message' };
        chunk.split(/\n|\r\n|\r/).forEach((line) => {
            line = line.trimRight();
            const index = line.indexOf(this.FIELD_SEPARATOR);
            if (index <= 0) {
                // Line was either empty, or started with a separator and is a comment.
                // Either way, ignore.
                return;
            }

            const field = line.substring(0, index);
            if (!(field in e)) {
                return;
            }

            const value = line.substring(index + 1).trimLeft();

            if (field === 'data') {
                e[field].push(value);
            } else {
                e[field] = value;
            }
        });

        const event = new CustomEvent(e.event);
        event.data = e.data;
        event.id = e.id;
        return event;
    };

    this._checkStreamClosed = function () {
        if (!this.xhr) {
            return;
        }
        if (this.xhr.readyState === XMLHttpRequest.DONE) {
            try {
                const data = JSON.parse(this.xhr.responseText);
                const { code, message: msg } = data;
                if (code !== '200') {
                    message.error(msg);
                    this.listeners.err && this.listeners.err.forEach((cb) => cb(data));
                }
            } catch {
                this.listeners.err && this.listeners.err.forEach((cb) => cb());
            }
            this._setReadyState(this.CLOSED);
        }
    };

    this.stream = function () {
        this._setReadyState(this.CONNECTING);

        this.xhr = new XMLHttpRequest();
        this.xhr.addEventListener('progress', this._onStreamProgress.bind(this));
        this.xhr.addEventListener('load', this._onStreamLoaded.bind(this));
        this.xhr.addEventListener('readystatechange', this._checkStreamClosed.bind(this));
        this.xhr.addEventListener('error', this._onStreamFailure.bind(this));
        this.xhr.addEventListener('abort', this._onStreamAbort.bind(this));
        this.xhr.open(this.method, this.url);
        for (const header in this.headers) {
            this.xhr.setRequestHeader(header, this.headers[header]);
        }
        this.xhr.withCredentials = this.withCredentials;
        this.xhr.send(this.payload);
    };

    this.close = function () {
        if (this.readyState === this.CLOSED) {
            return;
        }

        this.xhr.abort();
        this.xhr = null;
        this._setReadyState(this.CLOSED);
    };
};

export default SSE;
