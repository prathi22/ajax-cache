function ajaxCache(type, on, lifetime){
	if(on)
	{
		this.on = true;
	}else this.on = false;
	
	// set default cache lifetime
	if(lifetime != null)
	{
		this.defaultLifetime = lifetime;
	}
	
	// set cache functions according to type
	switch(type)
	{
	case 'url':
		this.put = this.put_url;
		this.get = this.get_url;
		break;
	}
	
};

ajaxCache.prototype.on = false;
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
ajaxCache.prototype.put_url = function(url, response, lifetime)
{
	if(lifetime == null) lifetime = this.defaultLifetime;
	var key = url;
	this.items[key] = Object();
	this.items[key].key = key;
	this.items[key].url = url;
	this.items[key].response = response;
	this.items[key].expire = (new Date().getTime()) + lifetime;
	return true;
}

/**
 * Get cached ajax response. Type: url
 * 
 * @param url - url of ajax response
 * @return ajax response or false if such does not exist or is expired
 */
ajaxCache.prototype.get_url = function(url)
{
	var key = url;
	
	// if cache does not exist
	if(this.items[key] == null) return false;
	
	//if cache expired
	if(this.items[key].expire < (new Date().getTime())) return false;
	
	// everything is passed - lets return the response
	return this.items[key].response;
}

/**
 * Flush cache
 * 
 * @return true on success
 */
ajaxCache.prototype.flush = function()
{
	// flush all cache
	cache.items = Object();
	return true;
}