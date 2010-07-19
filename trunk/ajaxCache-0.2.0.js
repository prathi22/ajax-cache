/*!
 * ajax-cache JavaScript Library v0.2.0
 * http://code.google.com/p/ajax-cache/
 *
 * Includes few JSON methods (open source)
 * http://www.json.org/js.html
 *
 * Date: 2010-07-19
 */
function ajaxCache(type, on, lifetime) {
	if (on) {
		this.on = true;
	} else
		this.on = false;

	// set default cache lifetime
	if (lifetime != null) {
		this.defaultLifetime = lifetime;
	}

	// set type
	this.type = type;

	// set cache functions according to type
	switch (this.type) {
	case 'url':
		this.put = this.put_url;
		break;
	case 'GET':
		this.put = this.put_GET;
		break;
	}

};

ajaxCache.prototype.on = false;
ajaxCache.prototype.type;
ajaxCache.prototype.defaultLifetime = 1800000; // 1800000=30min, 300000=5min, 30000=30sec
ajaxCache.prototype.items = Object();

/**
 * Caches the request and its response. Type: url
 * 
 * @param url - url of ajax response
 * @param response - ajax response
 * @param lifetime - (optional) sets cache lifetime in miliseconds
 * @return true on success
 */
ajaxCache.prototype.put_url = function(url, response, lifetime) {
	if (lifetime == null) lifetime = this.defaultLifetime;
	var key = this.make_key(url);
	this.items[key] = Object();
	this.items[key].key = key;
	this.items[key].url = url;
	this.items[key].response = response;
	this.items[key].expire = (new Date().getTime()) + lifetime;
	return true;
}

/**
 * Caches the request and its response. Type: GET
 * 
 * @param url - url of ajax response
 * @param data - data params (query)
 * @param response - ajax response
 * @param lifetime - (optional) sets cache lifetime in miliseconds
 * @return true on success
 */
ajaxCache.prototype.put_GET = function(url, data, response, lifetime) {
	if (lifetime == null)
		lifetime = this.defaultLifetime;
	var key = this.make_key(url, [ data ]);
	this.items[key] = Object();
	this.items[key].key = key;
	this.items[key].url = url;
	this.items[key].data = data;
	this.items[key].response = response;
	this.items[key].expire = (new Date().getTime()) + lifetime;
	return true;
}

/**
 * Get cached ajax response
 * 
 * @param url - url of ajax response
 * @param params - Array of additional parameters, to make key
 * @return ajax response or false if such does not exist or is expired
 */
ajaxCache.prototype.get = function(url, params) {
	var key = this.make_key(url, params);

	// if cache does not exist
	if (this.items[key] == null)
		return false;

	// if cache expired
	if (this.items[key].expire < (new Date().getTime()))
		return false;

	// everything is passed - lets return the response
	return this.items[key].response;
}

/**
 * Make unique key for each request depending on url and additional parameters
 * 
 * @param url - url of ajax response
 * @param params - Array of additional parameters, to make key
 * @return unique key
 */
ajaxCache.prototype.make_key = function(url, params) {
	var key = url;
	switch (this.type) {
	case 'url':
		break;
	case 'GET':
		key += this.stringify(params[0]);
		break;
	}

	return key;
}

/**
 * Flush cache
 * 
 * @return true on success
 */
ajaxCache.prototype.flush = function() {
	// flush all cache
	cache.items = Object();
	return true;
}

/*
 * Methods to stringify JavaScript/JSON objects.
 * 
 * Taken from: http://www.json.org/js.html to be more exact, this file:
 * http://www.json.org/json2.js copied on 2010-07-19
 * 
 * Taken methods: stringify, quote and str
 * 
 * Methods are slightly modified to best fit ajax-cache functionality
 * 
 */
ajaxCache.prototype.stringify = function(value, replacer, space) {

	// The stringify method takes a value and an optional replacer, and an
	// optional
	// space parameter, and returns a JSON text. The replacer can be a function
	// that can replace values, or an array of strings that will select the
	// keys.
	// A default replacer method can be provided. Use of the space parameter can
	// produce text that is more easily readable.

	var i;
	gap = '';
	indent = '';

	// If the space parameter is a number, make an indent string containing that
	// many spaces.

	if (typeof space === 'number') {
		for (i = 0; i < space; i += 1) {
			indent += ' ';
		}

		// If the space parameter is a string, it will be used as the indent
		// string.

	} else if (typeof space === 'string') {
		indent = space;
	}

	// If there is a replacer, it must be a function or an array.
	// Otherwise, throw an error.

	rep = replacer;
	if (replacer
			&& typeof replacer !== 'function'
			&& (typeof replacer !== 'object' || typeof replacer.length !== 'number')) {
		throw new Error('JSON.stringify');
	}

	// Make a fake root object containing our value under the key of ''.
	// Return the result of stringifying the value.

	return this.str('', {
		'' : value
	});
}

ajaxCache.prototype.quote = function(string) {

	// If the string contains no control characters, no quote characters, and no
	// backslash characters, then we can safely slap some quotes around it.
	// Otherwise we must also replace the offending characters with safe escape
	// sequences.

	var escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;

	escapable.lastIndex = 0;
	return escapable.test(string) ? '"' + string.replace(escapable,
			function(a) {
				var c = meta[a];
				return typeof c === 'string' ? c : '\\u' + ('0000' + a
						.charCodeAt(0).toString(16)).slice(-4);
			}) + '"' : '"' + string + '"';
}

ajaxCache.prototype.str = function(key, holder) {

	// Produce a string from holder[key].

	var i, // The loop counter.
	k, // The member key.
	v, // The member value.
	length, mind = gap, partial, value = holder[key];

	// If the value has a toJSON method, call it to obtain a replacement value.

	if (value && typeof value === 'object'
			&& typeof value.toJSON === 'function') {
		value = value.toJSON(key);
	}

	// If we were called with a replacer function, then call the replacer to
	// obtain a replacement value.

	if (typeof rep === 'function') {
		value = rep.call(holder, key, value);
	}

	// What happens next depends on the value's type.

	switch (typeof value) {
	case 'string':
		return this.quote(value);

	case 'number':

		// JSON numbers must be finite. Encode non-finite numbers as null.

		return isFinite(value) ? String(value) : 'null';

	case 'boolean':
	case 'null':

		// If the value is a boolean or null, convert it to a string. Note:
		// typeof null does not produce 'null'. The case is included here in
		// the remote chance that this gets fixed someday.

		return String(value);

		// If the type is 'object', we might be dealing with an object or an
		// array or
		// null.

	case 'object':

		// Due to a specification blunder in ECMAScript, typeof null is
		// 'object',
		// so watch out for that case.

		if (!value) {
			return 'null';
		}

		// Make an array to hold the partial results of stringifying this object
		// value.

		gap += indent;
		partial = [];

		// Is the value an array?

		if (Object.prototype.toString.apply(value) === '[object Array]') {

			// The value is an array. Stringify every element. Use null as a
			// placeholder
			// for non-JSON values.

			length = value.length;
			for (i = 0; i < length; i += 1) {
				partial[i] = this.str(i, value) || 'null';
			}

			// Join all of the elements together, separated with commas, and
			// wrap them in
			// brackets.

			v = partial.length === 0 ? '[]' : gap ? '[\n' + gap
					+ partial.join(',\n' + gap) + '\n' + mind + ']'
					: '[' + partial.join(',') + ']';
			gap = mind;
			return v;
		}

		// If the replacer is an array, use it to select the members to be
		// stringified.

		if (rep && typeof rep === 'object') {
			length = rep.length;
			for (i = 0; i < length; i += 1) {
				k = rep[i];
				if (typeof k === 'string') {
					v = this.str(k, value);
					if (v) {
						partial.push(this.quote(k) + (gap ? ': ' : ':') + v);
					}
				}
			}
		} else {

			// Otherwise, iterate through all of the keys in the object.

			for (k in value) {
				if (Object.hasOwnProperty.call(value, k)) {
					v = this.str(k, value);
					if (v) {
						partial.push(this.quote(k) + (gap ? ': ' : ':') + v);
					}
				}
			}
		}

		// Join all of the member texts together, separated with commas,
		// and wrap them in braces.

		v = partial.length === 0 ? '{}' : gap ? '{\n' + gap
				+ partial.join(',\n' + gap) + '\n' + mind + '}' : '{' + partial
				.join(',') + '}';
		gap = mind;
		return v;
	}
}
